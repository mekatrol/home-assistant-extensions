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

  setConfig(_: unknown) {
    // Method needed else HA will error with 'i.setConfig is not a function'
  }

  render() {
    return html`
      <div class="mekatrol-time-card">
        <div>
          <p class="time">${this.timeDisplay}</p>
        </div>
        <div>
          <p class="date">${this.dateDisplay}</p>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      padding: 0.1rem;
    }

    .mekatrol-time-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      font-family: 'Orbitron';
      margin-top: 1rem;
      padding-bottom: 10px;
      width: 100%;

      @font-face {
        font-family: 'Orbitron';
        font-style: normal;
        font-weight: 400 900;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC,
          U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    }

    .mekatrol-time-card > div {
      display: flex;
      padding: 5px;
    }

    .time {
      font-size: 5rem;
      color: #ff0000;
      padding: 0;
      margin: 0;
    }

    .date {
      font-size: 1.5rem;
      color: #d4d2d2;
      padding: 0;
      margin: 0;
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
