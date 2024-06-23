import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HassEntity, HomeAssistantConfig } from '../types';

interface PanicConfig {
  entity: string;
}

@customElement('mekatrol-panic-switch')
export class MekatrolPanicSwitch extends LitElement {
  @property({ type: Object })
  hass: HomeAssistantConfig | undefined;

  @property({ type: Object })
  config: PanicConfig | undefined;

  render() {
    if (!this.hass || !this.config) {
      // TODO: loading div
      return html`<div></div>`;
    }

    const entity = this.hass.states[this.config.entity];

    const friendlyName = entity.attributes.friendly_name;

    return html`
      <div class="mekatrol-panic-switch  ${entity.state === 'on' ? 'active' : ''}">
        <div>
          <button
            class="switch"
            @click="${() => this._toggle(entity)}"
          >
            <ha-icon icon="mdi:alarm-light"></ha-icon>
          </button>
        </div>
        <div><p>${friendlyName}</p></div>
      </div>
    `;
  }

  setConfig(config: PanicConfig) {
    if (!config || !config.entity) {
      return;
    }

    this.config = config;
  }

  _toggle(state: HassEntity) {
    if (this.hass) {
      this.hass.callService('homeassistant', 'toggle', {
        entity_id: state.entity_id
      });
    }
  }

  static styles = css`
    .mekatrol-panic-switch {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      background-color: #333;
      padding: 0.5em;
      align-items: center;
      margin: 1rem;
      border-radius: 10rem;
      border: 2px solid #ff0000;
    }

    .mekatrol-panic-switch > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }

    .mekatrol-panic-switch > div:first-child {
      font-size: 2em;
    }

    .mekatrol-panic-switch .offline {
      color: var(--clr-negative);
    }

    .mekatrol-panic-switch button {
      background-color: inherit;
      border: none;
      padding: 0;
      margin: 0;
      min-height: 66px;
      cursor: pointer;
    }

    .mekatrol-panic-switch.active {
      background-color: #ff0000;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-panic-switch': MekatrolPanicSwitch;
  }
}

if (!customElements.get('mekatrol-panic-switch')) {
  customElements.define('mekatrol-panic-switch', MekatrolPanicSwitch);
}
