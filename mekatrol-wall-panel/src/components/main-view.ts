import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { HomeAssistant, HomeAssistantSubscriber, useHomeAssistant } from '../helpers/HomeAssistant';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';

@customElement('main-view')
export class MainView extends LitElement implements HomeAssistantSubscriber {
  @state()
  entities: HassEntities = {};

  private _homeAssistant: HomeAssistant = useHomeAssistant();

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
    this._homeAssistant.subscribeEntities(this, this._entityIds);
    this.entities = this._homeAssistant.getEntities(this._entityIds);
  }

  render() {
    const buttons: TemplateResult<1>[] = [];
    for (const key in this.entities) {
      const entity = this.entities[key];
      buttons.push(
        html` <button
          @click=${() => this._onClick(entity)}
          part="button"
        >
          ${entity.attributes.friendly_name} is '${entity.state}'
        </button>`
      );
    }

    return html`
      <h1>Mekatrol Wall Panel</h1>
      <div class="card"><div>${buttons.map((h) => h)}</div></div>
    `;
  }

  private _onClick(entity: HassEntity) {
    this._homeAssistant.callService(entity.entity_id);
  }

  public onHomeAssistantInitialised() {
    this.entities = this._homeAssistant.getEntities(this._entityIds);
  }

  public onHomeAssistantEntities(entities: HassEntities) {
    // Update changed entities
    for (const key in entities) {
      this.entities[key] = entities[key];
    }

    // We did not update the reactive property so force refresh
    this.requestUpdate();
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'main-view': MainView;
  }
}
