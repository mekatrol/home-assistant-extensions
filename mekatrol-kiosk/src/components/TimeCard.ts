import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getShortDateWithDay, getTimeWithMeridiem } from '../date-helper';

@customElement('mekatrol-time-card')
export class MekatrolTimeCardElement extends LitElement {
  @state()
  timeDisplay: string = '';

  @state()
  dateDisplay: string = '';

  constructor() {
    super();

    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 500);
  }

  updateDateTime() {
    const dt = new Date();
    this.timeDisplay = getTimeWithMeridiem(dt);
    this.dateDisplay = getShortDateWithDay(dt);
  }

  render() {
    return html`
      <div class="mekatrol-time-card">
        <div class="time">${this.timeDisplay}</div>
        <div class="date">${this.dateDisplay}</div>
      </div>
    `;
  }

  static styles = css`
    .mekatrol-time-card {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      align-items: center;

      > .time {
        font-size: 3rem;
        color: #74e906;
      }

      > .date {
        font-size: 1.5rem;
        color: #04be20;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-time-card': MekatrolTimeCardElement;
  }
}

if (!customElements.get('mekatrol-time-card')) {
  customElements.define('mekatrol-time-card', MekatrolTimeCardElement);
}
