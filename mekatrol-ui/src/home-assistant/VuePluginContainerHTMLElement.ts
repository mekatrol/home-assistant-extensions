import { MekatrolVuePluginConfig, HomeAssistant, useHomeAssistantGlobal } from './types';

const homeAssistantGlobal = useHomeAssistantGlobal();

export class VuePluginContainerHTMLElement extends HTMLElement {
  private _contentPlaceholder: HTMLDivElement | null = null;

  set hass(hass: HomeAssistant) {
    // Update global 'reactive' property so that all vue components get latest values
    homeAssistantGlobal.hass = hass;

    // Create initial card HTML structure if not yet defined.
    if (!this._contentPlaceholder) {
      // Create the default (initial render) time content.
      // We insert a div here because when this HTML is rendered the first time the
      // web component may not yet be loaded (it this component is loaded before the inner web component)
      this.innerHTML = `
        <ha-card header="Mekatrol Vue Plugin Card">
          <div></div>
        </ha-card>
      `;

      // The content placeholder is the div inside the card
      this._contentPlaceholder = this.querySelector('div');
    }

    // If we haven't yet set inner content to the web component then do so now
    if (this._contentPlaceholder && homeAssistantGlobal.config?.cardType) {
      // Set the inner web component
      this._contentPlaceholder!.innerHTML = `<${homeAssistantGlobal.config.cardType}></${homeAssistantGlobal.config.cardType}>`;
    }
  }

  setConfig(config: MekatrolVuePluginConfig) {
    // The card type must be set
    if (!config || !config.cardType || config.cardType.length < 1) {
      throw new Error('Config must be set with the cardType setting.');
    }

    // Update global 'reactive' property so that all vue components get latest values
    homeAssistantGlobal.config = config;

    // If we haven't yet set inner content to the web component then do so now
    if (this._contentPlaceholder && homeAssistantGlobal.config?.cardType) {
      // Set the inner web component
      this._contentPlaceholder!.innerHTML = `<${homeAssistantGlobal.config.cardType}></${homeAssistantGlobal.config.cardType}>`;
    }
  }
}

customElements.define('mekatrol-vue-plugin-container', VuePluginContainerHTMLElement);
