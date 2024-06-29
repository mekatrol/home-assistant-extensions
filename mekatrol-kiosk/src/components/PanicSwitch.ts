import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HassEntity } from 'home-assistant-js-websocket';
import { HomeAssistant } from '../home-assistant/types';
import { createVirtualEntity, getOrCreateEntity as getVirtualEntity } from '../home-assistant/HomeAssistantImpl';

interface PanicConfig {
  entity: string;
}

const VIRTUAL_ENTITY_KEY = 'switch.panic';

@customElement('mekatrol-panic-switch')
export class MekatrolPanicSwitch extends LitElement {
  @property({ type: Object })
  hass: HomeAssistant | undefined;

  @property({ type: Object })
  config: PanicConfig | undefined;

  getEntity(): HassEntity {
    if (!this.hass || !this.config) {
      let virtualEntity = getVirtualEntity(VIRTUAL_ENTITY_KEY);

      if (!virtualEntity) {
        virtualEntity = createVirtualEntity(VIRTUAL_ENTITY_KEY, 'PANIC', 'off');
      }

      return virtualEntity;
    }

    const entity = this.hass.states[this.config.entity];
    return entity;
  }

  render() {
    const entity = this.getEntity();
    const friendlyName = entity.attributes.friendly_name;

    return html`
      <button
        class="mekatrol-panic-switch ${entity.state === 'on' ? 'active' : ''}"
        @click="${() => this._toggle(entity)}"
      >
        <ha-icon icon="mdi:alarm-light"></ha-icon>

        <div class="label"><p>${friendlyName}</p></div>
      </button>
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
    } else {
      const virtualEntity = getVirtualEntity(VIRTUAL_ENTITY_KEY);

      if (!virtualEntity) {
        return;
      }

      virtualEntity.state = virtualEntity.state === 'on' ? 'off' : 'on';
      this.requestUpdate();
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      align-self: center;
      width: 90%;

      --mdc-icon-size: 70px;
    }

    .mekatrol-panic-switch {
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 0.1rem;
      background-color: #444;
      padding: 2em;
      align-items: center;
      border-radius: 10rem;
      border: 2px solid #faf6f6;
      cursor: pointer;
      min-width: 80%;
    }

    .mekatrol-panic-switch.active {
      background-color: #ff0000;
      border: 2px solid #ff0000;
    }

    p {
      font-size: 2rem;
      padding: 0.1rem;
      margin: 0;
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
