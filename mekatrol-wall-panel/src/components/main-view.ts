import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('main-view')
export class MainView extends LitElement {
  private _entityIds: string[] = [
    'switch.kitchen_cabinet_lights_led',
    'switch.alfresco_usb',
    'switch.kitchen_cabinet_lights',
    'switch.pb1_usb',
    'switch.pb1_op2',
    'switch.garage_spare',
    'switch.bbq_area_christmas_lights'
  ];

  constructor() {
    super();
  }

  render() {
    const buttons: TemplateResult<1>[] = [];
    this._entityIds.forEach((entityId) => {
      buttons.push(html` <toggle-switch .entityId="${entityId}"></toggle-switch>`);
    });

    return html`
      <h1>Mekatrol Wall Panel</h1>
      <div class="card"><div>${buttons.map((h) => h)}</div></div>
    `;
  }

  static styles = css`
    :host {
      margin: 0 auto;
      text-align: center;
    }

    .card {
      padding: 2em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'main-view': MainView;
  }
}
