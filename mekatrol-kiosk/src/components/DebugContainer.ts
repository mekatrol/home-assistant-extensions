import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppConfig, CardConfig } from '../types';
import { MenuSelectedEvent } from './menu/MenuSelectedEvent';
import { HomeAssistant } from '../home-assistant/types';
import { ConfigurableLitElement, HomeAssistantImpl, switchEntityKeys } from '../home-assistant/HomeAssistantImpl';
import { SwitchCardConfig } from './SwitchCard';

@customElement('mekatrol-debug-container')
export class DebugContainerElement extends LitElement {
  @property({ type: Object })
  hass: HomeAssistant;

  @property({ type: Object })
  config?: AppConfig;

  @state()
  private _currentView: string = '';

  constructor() {
    super();
    this.hass = new HomeAssistantImpl();
    this.config = {} as AppConfig;

    // We just need to update once after everything loaded
    const timerId = setInterval(() => {
      this.requestUpdate();
      clearInterval(timerId);
    }, 10);
  }

  initMenu() {
    if (!this.config) {
      this._currentView = '';
      return;
    }

    // Set default menu item if one defined
    const defaultMenu = this.config.menu.find((mi) => mi.isDefault === true);
    if (defaultMenu) {
      this._currentView = defaultMenu.id;
    }
  }

  async initViews() {
    const element = (this.shadowRoot ?? document).getElementById('mekatrol-switch-card') as ConfigurableLitElement<SwitchCardConfig>;

    if (element) {
      element.hass = this.hass!;
      element.config = {
        entities: switchEntityKeys
      } as SwitchCardConfig;
      element.requestUpdate();
    }

    // No cards then do nothing other than reset
    if (!this.config || !this.config.cards || this.config.cards.length === 0) {
      return;
    }

    const cardPromises = this.config.cards.map((config) => this.createCardElement(config));
    const cardPromiseResults = await Promise.all(cardPromises);

    console.log(cardPromiseResults);
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    this.initViews();

    if (name && name === 'devConfig' && this.config === undefined) {
      this.config = this.config;
      this.initMenu();
    }
    return super.requestUpdate(name, oldValue);
  }

  setConfig(config: AppConfig) {
    if (!config) {
      return;
    }

    this.config = config;
    this.initMenu();
    this.initViews();
  }

  render() {
    this.initViews();
    return html`
      <div class="mekatrol-kiosk">
        <!-- <div>
          <mekatrol-sidebar-menu
            .config=${this.config ?? this.config}
            .activeMenu=${this._currentView}
            @menu-selected="${this.menuSelected}"
          ></mekatrol-sidebar-menu>
        </div> -->
        <div class="kiosk-content">
          <div>
            <mekatrol-time-card></mekatrol-time-card>
            <mekatrol-switch-card
              id="mekatrol-switch-card"
              .config="${{ entities: switchEntityKeys }}"
            ></mekatrol-switch-card>
            <mekatrol-panic-switch></mekatrol-panic-switch>
          </div>
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
    }

    .kiosk-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-content: center;
    }

    .kiosk-content > div {
      width: 100%;
      height: 100%;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .kiosk-content > footer {
      height: 15%;
      width: 100%;

      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-debug-container': DebugContainerElement;
  }
}

if (!customElements.get('mekatrol-debug-container')) {
  customElements.define('mekatrol-debug-container', DebugContainerElement);
}
