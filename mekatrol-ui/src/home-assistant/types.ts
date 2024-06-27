import { Connection, HassConfig, HassEntities, HassEntity, HassServiceTarget, HassServices, MessageBase } from 'home-assistant-js-websocket';
import { Ref, ref } from 'vue';

export interface ValueChangedEvent<T> extends CustomEvent {
  detail: {
    value: T;
  };
}

export type Constructor<T = any> = new (...args: any[]) => T;

export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

// Currently selected theme and its settings. These are the values stored in local storage.
// Note: These values are not meant to be used at runtime to check whether dark mode is active
// or which theme name to use, as this interface represents the config data for the theme picker.
// The actually active dark mode and theme name can be read from hass.themes.
export interface ThemeSettings {
  theme: string;
  // Radio box selection for theme picker. Do not use in Lovelace rendering as
  // it can be undefined == auto.
  // Property hass.themes.darkMode carries effective current mode.
  dark?: boolean;
  primaryColor?: string;
  accentColor?: string;
}

export interface PanelInfo<T = Record<string, any> | null> {
  component_name: string;
  config: T;
  icon: string | null;
  title: string | null;
  url_path: string;
  config_panel_domain?: string;
}

export interface Panels {
  [name: string]: PanelInfo;
}

export interface CalendarViewChanged {
  end: Date;
  start: Date;
  view: string;
}

export type FullCalendarView = 'dayGridMonth' | 'dayGridWeek' | 'dayGridDay' | 'listWeek';

export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ToggleButton {
  label: string;
  iconPath?: string;
  value: string;
}

export interface Translation {
  nativeName: string;
  isRTL: boolean;
  hash: string;
}

export interface TranslationMetadata {
  fragments: string[];
  translations: {
    [lang: string]: Translation;
  };
}

export interface IconMetaFile {
  version: string;
  parts: IconMeta[];
}

export interface IconMeta {
  start: string;
  file: string;
}

export interface Notification {
  notification_id: string;
  message: string;
  title: string;
  status: 'read' | 'unread';
  created_at: string;
}

export interface Resources {
  [language: string]: Record<string, string>;
}

export interface Context {
  id: string;
  parent_id?: string;
  user_id?: string | null;
}

export interface ServiceCallResponse {
  context: Context;
  response?: any;
}

export interface ServiceCallRequest {
  domain: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: HassServiceTarget;
}

export type EntityCategory = 'config' | 'diagnostic';

export interface EntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: EntityCategory;
  translation_key?: string;
  platform?: string;
  display_precision?: number;
}

export interface AreaRegistryEntry {
  area_id: string;
  floor_id: string | null;
  name: string;
  picture: string | null;
  icon: string | null;
  labels: string[];
  aliases: string[];
}

export interface DeviceRegistryEntry {
  id: string;
  config_entries: string[];
  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: 'service' | null;
  disabled_by: 'user' | 'integration' | 'config_entry' | null;
  configuration_url: string | null;
}

export interface HomeAssistant {
  connection: Connection;
  connected: boolean;
  states: HassEntities;
  entities: { [id: string]: EntityRegistryDisplayEntry };
  devices: { [id: string]: DeviceRegistryEntry };
  areas: { [id: string]: AreaRegistryEntry };
  services: HassServices;
  config: HassConfig;
  selectedTheme: ThemeSettings | null;
  language: string;
  selectedLanguage: string | null;
  resources: Resources;
  hassUrl(path?: string): string;
  callService(
    domain: ServiceCallRequest['domain'],
    service: ServiceCallRequest['service'],
    serviceData?: ServiceCallRequest['serviceData'],
    target?: ServiceCallRequest['target'],
    notifyOnError?: boolean,
    returnResponse?: boolean
  ): Promise<ServiceCallResponse>;
  callApi<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T>;
  fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
  sendWS(msg: MessageBase): void;
  callWS<T>(msg: MessageBase): Promise<T>;
  formatEntityState(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue(stateObj: HassEntity, attribute: string, value?: any): string;
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

export interface MekatrolVuePluginConfig {
  cardType: string | undefined;
}

export interface HomeAssistantGlobal {
  hass: HomeAssistant | undefined;
  config: MekatrolVuePluginConfig | undefined;
}

class HomeAssistantGlobalImplementation implements HomeAssistantGlobal {
  private _hass: Ref<HomeAssistant | undefined>;
  private _config: Ref<MekatrolVuePluginConfig | undefined>;

  constructor() {
    this._hass = ref(undefined);
    this._config = ref({ cardType: undefined });
  }

  public get hass() {
    return this._hass.value;
  }

  public set hass(hass: HomeAssistant | undefined) {
    this._hass.value = hass;
  }

  public get config() {
    return this._config.value;
  }

  public set config(config: MekatrolVuePluginConfig | undefined) {
    this._config.value = config;
  }
}

const homeAssistantGlobal = new HomeAssistantGlobalImplementation();

export const useHomeAssistantGlobal = (): HomeAssistantGlobal => {
  return homeAssistantGlobal;
};
