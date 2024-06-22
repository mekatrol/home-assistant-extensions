import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AppConfig, HomeAssistant, useHomeAssistant, type HomeAssistantConfig } from './types';

@customElement('mekatrol-kiosk')
export class MekatrolKioskElement extends LitElement {
  config: AppConfig | undefined;
  hassConfig: HomeAssistantConfig | undefined;
  homeAssistantConnector: HomeAssistant;

  constructor() {
    super();
    this.homeAssistantConnector = useHomeAssistant();
  }

  @property({ type: Object })
  devConfig?: AppConfig;

  setConfig(config: AppConfig) {
    if (!config) {
      return;
    }

    this.config = config;
  }

  set hass(hassConfig: HomeAssistantConfig) {
    this.hassConfig = hassConfig;
    this.homeAssistantConnector.attachSocket(hassConfig.connection.socket);
  }

  render() {
    return html`
      <div class="mekatrol-kiosk">
        <div>
          <mekatrol-sidebar-menu .config=${this.config ?? this.devConfig}></mekatrol-sidebar-menu>
        </div>
        <div><p>lorem</p></div>
      </div>
    `;
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
