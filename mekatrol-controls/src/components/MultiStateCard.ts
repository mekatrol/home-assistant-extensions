import { CSSResult, LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard } from '../ha/types';
import { styles } from './styles';

interface StateConfig {
  // The entity ID that presents this state
  entityId: string;

  // The icon to use for this state
  icon: string;

  // The state to match on this entity
  state: string;

  // The priority to display this state compared to all other states.
  // That is, which state across multiple entities is most important and will be displayed.
  priority: number;

  // Optional styles
  styles?: Record<string, string>[];
}

interface MultiStateConfig {
  title?: string;
  states: StateConfig[];
}

@customElement('mekatrol-multi-state-card')
export class MekatrolMultiStateCardElement extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: MultiStateConfig;

  setConfig(config: MultiStateConfig): void {
    // Method needed else HA will error with 'i.setConfig is not a function'
    this._config = config as MultiStateConfig;
  }

  render() {
    try {
      if (!this._config) {
        return nothing;
      }

      // Start with priority of max value
      let priority = 999999; // Big enough value

      // Create default state, will be displayed if no other states match
      let stateConfig: StateConfig = { priority, entityId: 'unknown', state: 'Unknown', icon: 'mdi:question' };

      // Get all entity state values
      this._config.states.forEach((s) => {
        // This state a higher priority than the currently selected one?
        if (s.priority >= priority) {
          // No higher priority, so return from this iteration of the loop.
          return;
        }

        // Get the entity state value
        const entity = this.hass?.states[s.entityId];

        if (entity && entity.state === s.state) {
          priority = s.priority;
          stateConfig = s;
        }
      });

      let stylesOverride = '';
      if (stateConfig.styles) {
        for (let i = 0; i < stateConfig.styles.length; i++) {
          for (let [key, value] of Object.entries(stateConfig.styles[i])) {
            stylesOverride += `${key}:${value};`;
          }
        }
      }

      return html`
        <div class="mekatrol-multi-state-card">
          <div
            class="container"
            style="${stylesOverride}"
          >
            <div>
              <ha-icon icon="${stateConfig.icon}">${stateConfig.state}</ha-icon>
            </div>
            <div>${this._config.title ? html`<p>${this._config.title}</p>` : ``}</div>
          </div>
        </div>
      `;
    } catch (e: any) {
      if (e.stack) console.error(e.stack);
      else console.error(e);
      const errorCard = document.createElement('hui-error-card') as LovelaceCard;
      errorCard.setConfig({
        type: 'error',
        error: e.toString(),
        origConfig: this._config
      });
      return html` ${errorCard} `;
    }
  }

  static get styles(): CSSResult {
    return styles;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-multi-state-card': MekatrolMultiStateCardElement;
  }
}

if (!customElements.get('mekatrol-multi-state-card')) {
  customElements.define('mekatrol-multi-state-card', MekatrolMultiStateCardElement);
}
