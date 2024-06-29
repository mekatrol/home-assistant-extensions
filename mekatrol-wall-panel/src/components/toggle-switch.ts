import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, HomeAssistantSubscriber, useHomeAssistant } from '../helpers/HomeAssistant';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';

@customElement('toggle-switch')
export class ToggleSwitch extends LitElement implements HomeAssistantSubscriber {
  private _homeAssistant: HomeAssistant = useHomeAssistant();

  @state()
  entity: HassEntity | undefined = undefined;

  private _entityId: string = '';
  @property({ type: String }) set entityId(entityId: string) {
    this._entityId = entityId;
    this.initialise();
  }

  get entityId() {
    return this._entityId;
  }

  constructor() {
    super();
    this._homeAssistant.subscribeEntity(this, this._entityId);
  }

  render() {
    if (!this.entity) {
      return html`Loading...`;
    }

    return html`<button
      @click=${this._onClick}
      part="button"
    >
      ${this.entity.attributes.friendly_name} is '${this.entity.state}'
    </button>`;
  }

  public onHomeAssistantInitialised() {
    this.initialise();
  }

  public onHomeAssistantEntities(entities: HassEntities) {
    this.entity = entities[this._entityId];

    // We did not update the reactive property so force refresh
    this.requestUpdate();
  }

  private _onClick() {
    if (!this.entity) {
      return;
    }
    this._homeAssistant.callService(this._entityId);
  }

  private initialise() {
    this.entity = this._homeAssistant.getEntity(this._entityId);
    this._homeAssistant.subscribeEntity(this, this._entityId);
  }

  static styles = css`
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
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'toggle-switch': ToggleSwitch;
  }
}
