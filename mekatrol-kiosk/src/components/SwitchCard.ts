import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant } from '../home-assistant/types';
import { HassEntity } from 'home-assistant-js-websocket';
import { ifDefined } from 'lit/directives/if-defined.js';

export interface SwitchCardConfig {
  entities: string[];
}

@customElement('mekatrol-switch-card')
export class MekatrolSwitchCardElement extends LitElement {
  @property({ type: Object })
  config: SwitchCardConfig = { entities: [] };

  @property({ type: Object })
  hass: HomeAssistant | undefined = undefined;

  constructor() {
    super();
  }

  setConfig(config: SwitchCardConfig) {
    this.config = config;
  }

  render() {
    if (!this.config || !this.hass) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <div class="mekatrol-switch-card">
        ${this.config.entities.map((ent) => {
          const entity = this.hass!.states[ent];
          return entity
            ? html`
                <div>
                  <label class="switch">
                    <input
                      type="checkbox"
                      @click="${() => this._toggle(entity)}"
                    />
                    <span class="slider round"></span>
                  </label>
                  <ha-icon icon="${ifDefined(entity.attributes.icon)}"></ha-icon>
                </div>
              `
            : html` <div class="not-found">Entity ${ent} not found.</div> `;
        })}
      </div>
    `;
  }

  _toggle(state: HassEntity) {
    this.hass!.callService('homeassistant', 'toggle', {
      entity_id: state.entity_id
    });
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0.1rem;

      min-height: 10px;
      min-width: 100%;
    }

    :host > div {
      display: flex;
      flex-direction: row;
      align-items: center;

      min-height: 100px;
      min-width: 100%;
    }

    :host > div > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      padding: 0;
    }

    p {
      padding: 1rem;
      font-size: 2rem;
      font: Consolas;
      color: #0096ff;
    }

    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-block;
      width: 34px;
      height: 60px;
    }

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: '';
      height: 26px;
      width: 26px;
      left: 4px;
      top: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: #2196f3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateY(26px);
      -ms-transform: translateY(26px);
      transform: translateY(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-switch-card': MekatrolSwitchCardElement;
  }
}

if (!customElements.get('mekatrol-switch-card')) {
  customElements.define('mekatrol-switch-card', MekatrolSwitchCardElement);
}
