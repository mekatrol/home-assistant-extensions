import {
  Connection,
  HassEntities,
  HassServices,
  HassConfig,
  HassServiceTarget,
  MessageBase,
  HassEntity,
  ConnectionOptions,
  HaWebSocket
} from 'home-assistant-js-websocket';
import {
  AreaRegistryEntry,
  DeviceRegistryEntry,
  EntityRegistryDisplayEntry,
  HomeAssistant,
  Resources,
  ServiceCallResponse,
  ThemeSettings
} from './types';
import { LitElement } from 'lit';

export interface ConfigurableLitElement<T> extends LitElement {
  hass: HomeAssistant;
  config: T | undefined;
}

const getDefaultUnitSystem = () => {
  return {
    mass: 'kg',
    length: 'm',
    pressure: 'kPa',
    temperature: '°C',
    volume: 'm3',
    accumulated_precipitation: '',
    wind_speed: ''
  };
};

export const getOrCreateEntity = (key: string): HassEntity | undefined => {
  if (key in virtualEntities) {
    return virtualEntities[key];
  }

  return undefined;
};

export const createVirtualEntity = (
  key: string,
  friendlyName: string = 'Unknown',
  initialState: string = 'off',
  icon?: string | undefined
): HassEntity => {
  const dt = new Date().toISOString();
  const entity = {
    entity_id: key,
    attributes: {
      friendly_name: friendlyName,
      icon: icon
    },
    state: initialState,
    last_changed: dt,
    last_updated: dt,
    context: {
      id: '',
      user_id: null,
      parent_id: null
    }
  };

  return entity;
};

const getDefaultConfig = (): HassConfig => {
  return {
    latitude: 0,
    longitude: 0,
    elevation: 0,
    radius: 0,
    location_name: '',
    allowlist_external_dirs: [],
    allowlist_external_urls: [],
    components: [],
    time_zone: '',
    config_dir: '',
    config_source: '',
    country: '',
    version: '',
    currency: '',
    external_url: '',
    internal_url: '',
    language: '',
    recovery_mode: false,
    safe_mode: false,
    state: 'RUNNING',
    unit_system: getDefaultUnitSystem()
  };
};

const getDefaultConnectionOptions = (): ConnectionOptions => {
  return {
    setupRetry: 0,
    auth: undefined,
    createSocket: async (options: ConnectionOptions): Promise<HaWebSocket> => {
      console.log(options);
      throw new Error('Method not implemented.');
    }
  };
};

const getStates = (): HassEntities => {
  return virtualEntities;
};

const getDefaultConnection = (): Connection => {
  return {
    options: getDefaultConnectionOptions(),
    commandId: 1,
    commands: {}
  } as Connection;
};

export const virtualEntities: Record<string, HassEntity> = {
  'switch.switch1': createVirtualEntity('switch.switch1', 'Switch 1', 'off', 'mdi:home'),
  'switch.switch2': createVirtualEntity('switch.switch2', 'Switch 2', 'off', 'mdi:water'),
  'switch.switch3': createVirtualEntity('switch.switch3', 'Switch 3', 'off', 'mdi:alarm'),
  'switch.switch4': createVirtualEntity('switch.switch4', 'Switch 4', 'off', 'mdi:air-conditioner')
};

export const virtualEntityKeys = Object.keys(virtualEntities);
export const switchEntityKeys = virtualEntityKeys.filter((k) => k.startsWith('switch.'));

export class HomeAssistantImpl implements HomeAssistant {
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

  constructor() {
    this.connection = getDefaultConnection();
    this.connected = false;
    this.states = getStates();
    this.entities = {};
    this.devices = {};
    this.areas = {};
    this.services = {};
    this.config = getDefaultConfig();
    this.selectedTheme = null;
    this.language = '';
    this.selectedLanguage = '';
    this.resources = {};
  }

  hassUrl(path?: string | undefined): string {
    console.log(path);
    throw new Error('Method not implemented.');
  }

  updateViews() {
    const debugContainerElement = document.getElementById('mekatrol-debug-container') as ConfigurableLitElement<Object>;
    debugContainerElement.config = {};
    debugContainerElement.hass = this;
    debugContainerElement.requestUpdate();
  }

  callService(
    _domain: string,
    _service: string,
    serviceData?: Record<string, any> | undefined,
    _target?: HassServiceTarget | undefined,
    _notifyOnError?: boolean | undefined,
    _returnResponse?: boolean | undefined
  ): Promise<ServiceCallResponse> {
    if (serviceData) {
      const entityId = serviceData['entity_id'];
      const entity = virtualEntities[entityId];
      entity.state = entity.state === 'on' ? 'off' : 'on';
    }

    this.updateViews();

    return Promise.resolve({} as ServiceCallResponse);
  }

  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, any> | undefined,
    headers?: Record<string, string> | undefined
  ): Promise<T> {
    console.log(method, path, parameters, headers);
    throw new Error('Method not implemented.');
  }

  fetchWithAuth(path: string, init?: Record<string, any> | undefined): Promise<Response> {
    console.log(path, init);
    throw new Error('Method not implemented.');
  }

  sendWS(msg: MessageBase): void {
    console.log(msg);
    throw new Error('Method not implemented.');
  }

  callWS<T>(msg: MessageBase): Promise<T> {
    console.log(msg);
    throw new Error('Method not implemented.');
  }

  formatEntityState(stateObj: HassEntity, state?: string | undefined): string {
    console.log(stateObj, state);
    throw new Error('Method not implemented.');
  }

  formatEntityAttributeValue(stateObj: HassEntity, attribute: string, value?: any): string {
    console.log(stateObj, attribute, value);
    throw new Error('Method not implemented.');
  }

  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string {
    console.log(stateObj, attribute);
    throw new Error('Method not implemented.');
  }
}
