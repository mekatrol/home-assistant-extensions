import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/*************************************************************************************************************
 * This web component 'mocks' the home assistant <ha-icon> web component dor debugging outside home assistant.
 * It is not included in the build (i.e. not exported from main.ts) so it will not clash when deployed.
 *************************************************************************************************************/

@customElement('ha-icon')
export class MekatrolMockIcon extends LitElement {
  @property({ type: String })
  icon?: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    console.log('the icon 2', this.icon);
    const [iconPrefix, origIconName] = this.icon?.split(':', 2) ?? ['mdi', 'mdi-home'];
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `      
        <link rel=stylesheet  href=https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css>  
        <span class="${iconPrefix} mdi-${origIconName}"></span>`;
    }

    return html`<span class="${iconPrefix} ${origIconName}"></span>`;
  }

  static styles = css`
    .mdi {
      font-size: 2rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ha-icon': MekatrolMockIcon;
  }
}

if (!customElements.get('ha-icon')) {
  customElements.define('ha-icon', MekatrolMockIcon);
}
