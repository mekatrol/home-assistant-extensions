import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppConfig, CardConfig, HomeAssistant, useHomeAssistant, type HomeAssistantConfig } from '../../types';
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
      this._currentView = '';
      return;
    }

    // Set default menu item if one defined
    const defaultMenu = this._config.menu.find((mi) => mi.isDefault === true);
    if (defaultMenu) {
      this._currentView = defaultMenu.id;
    }
  }

  async initViews() {
    // No cards then do nothing other than reset
    if (!this._config || !this._config.cards || this._config.cards.length === 0) {
      return;
    }

    const cardPromises = this._config.cards.map((config) => this.createCardElement(config));
    const cardPromiseResults = await Promise.all(cardPromises);

    console.log(cardPromiseResults);
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
    this.initViews();
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
        <div class="kiosk-content">
          <div><mekatrol-time-card></mekatrol-time-card></div>
          <footer>
            <div>
              <mekatrol-panic-switch></mekatrol-panic-switch>
            </div>
            <div>
              <p>[v0.0.0.1]</p>
            </div>
          </footer>
        </div>
      </div>
    `;
  }

  menuSelected(menuItem: MenuSelectedEvent) {
    this._currentView = menuItem.detail.id;
  }

  async createCardElement(cardConfig: CardConfig) {
    console.log(cardConfig);
  }

  static styles = css`
    :host {
      margin: 0 auto;
      padding: 0;
    }

    .mekatrol-kiosk {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;

      font-family: Consolas, serif;
    }

    .kiosk-content {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .kiosk-content > div {
      height: 85%;
      width: 100%;
    }

    .kiosk-content > footer {
      height: 15%;
      width: 100%;

      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .kiosk-content > footer > * {
      align-content: center;
    }

    .kiosk-content > footer > *:nth-child(2) {
      margin-left: auto;
      padding-right: 1rem;
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
