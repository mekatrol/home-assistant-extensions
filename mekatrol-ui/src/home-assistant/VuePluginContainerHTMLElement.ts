import { DefaultConfig, HomeAssistant, useHomeAssistantGlobal } from './types';

const homeAssistantGlobal = useHomeAssistantGlobal();

export class VuePluginContainerHTMLElement extends HTMLElement {
  private _content: HTMLDivElement | null = null;

  set hass(hass: HomeAssistant) {
    // Update global 'reactive' property so that all vue components get latest values
    homeAssistantGlobal.hass = hass;

    // Create initial card HTML structure if not yet defined.
    if (!this._content) {
      this.innerHTML = `
        <ha-card header="Mekatrol Vue Plugin Card">
          <div></div>
        </ha-card>
      `;

      // The content is the div inside the card
      this._content = this.querySelector('div');
    }

    // Set the inner web component
    this._content!.innerHTML = '<main-view></main-view>';
  }

  setConfig(config: DefaultConfig) {
    // Update global 'reactive' property so that all vue components get latest values
    homeAssistantGlobal.config = config;
  }
}

customElements.define('mekatrol-vue-plugin-container', VuePluginContainerHTMLElement);
