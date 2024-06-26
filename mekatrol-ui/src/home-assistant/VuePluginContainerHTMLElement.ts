import { DefaultConfig, HomeAssistant, useHomeAssistantGlobal } from './types';

const homeAssistantGlobal = useHomeAssistantGlobal();

export class VuePluginContainerHTMLElement extends HTMLElement {
  private _content: HTMLDivElement | null = null;

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass: HomeAssistant) {
    homeAssistantGlobal.hass = hass;

    // Initialize the content if it's not there yet.
    if (!this._content) {
      this.innerHTML = `
        <ha-card header="Mekatrol Vue Plugin Card">
          <div></div>
        </ha-card>
      `;
      this._content = this.querySelector('div');
    }

    this._content!.innerHTML = '<main-view></main-view>';
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config: DefaultConfig) {
    homeAssistantGlobal.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('mekatrol-vue-plugin-container', VuePluginContainerHTMLElement);
