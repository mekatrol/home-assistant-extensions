import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppConfig, HomeAssistant, useHomeAssistant, type HomeAssistantConfig } from '../../types';
import { MenuSelectedEvent } from '../menu/MenuSelectedEvent';

@customElement('mekatrol-kiosk')
export class MekatrolKioskElement extends LitElement {
  private _config: AppConfig | undefined;
  private _hassConfig: HomeAssistantConfig | undefined;
  private _homeAssistantConnector: HomeAssistant;

  @state()
  private _currentView: string = '';

  constructor() {
    super();
    this._homeAssistantConnector = useHomeAssistant();
  }

  @property({ type: Object })
  devConfig?: AppConfig;

  initMenu() {
    if (!this._config) {
      return;
    }

    // Set default menu item if one defined
    const defaultMenu = this._config.menu.find((mi) => mi.isDefault === true);
    if (defaultMenu) {
      this._currentView = defaultMenu.id;
    }
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    if (name && name === 'devConfig' && this._config === undefined) {
      this._config = this.devConfig;
      this.initMenu();
    }
    return super.requestUpdate(name, oldValue);
  }

  setConfig(config: AppConfig) {
    if (!config) {
      return;
    }

    this._config = config;
    this.initMenu();
  }

  set hass(hassConfig: HomeAssistantConfig) {
    this._hassConfig = hassConfig;
    this._homeAssistantConnector.attachSocket(this._hassConfig.connection.socket);
  }

  render() {
    return html`
      <div class="mekatrol-kiosk">
        <div>
          <mekatrol-sidebar-menu
            .config=${this._config ?? this.devConfig}
            .activeMenu=${this._currentView}
            @menu-selected="${this.menuSelected}"
          ></mekatrol-sidebar-menu>
        </div>
        <div><p>${this._currentView}</p></div>
      </div>
    `;
  }

  menuSelected(menuItem: MenuSelectedEvent) {
    this._currentView = menuItem.detail.id;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0;
    }

    .mekatrol-kiosk {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-kiosk': MekatrolKioskElement;
  }
}

if (!customElements.get('mekatrol-kiosk')) {
  customElements.define('mekatrol-kiosk', MekatrolKioskElement);
}
