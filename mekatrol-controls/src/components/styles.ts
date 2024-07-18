import { css } from 'lit';

export const styles = css`
  :host {
    position: relative;
    display: flex;
    --state-inactive-color: var(--paper-item-icon-color);
  }

  .container {
    --mdc-icon-size: 55px;

    cursor: pointer;
    pointer-events: none;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: normal;
    user-select: none;
    gap: 0;
    padding: auto;

    max-height: 120px;
    width: 115px;
    font-size: 14px;
    border: 3px solid rgb(255, 140, 0);
    border-radius: 12px;
  }

  .container > div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
  }

  @keyframes twister {
    0% {
      transform: rotatez(0deg);
      top: 10px;
    }
    25% {
      transform: rotatez(15deg);
    }
    50% {
      top: -15px;
    }
    75% {
      transform: rotatez(-15deg);
    }
    100% {
      transform: rotatez(0deg);
      top: 10px;
    }
  }

  @keyframes flasher {
    50% {
      background: radial-gradient(rgb(0, 0, 0, 10%), 20%, rgb(255, 0, 0, 50%));
      box-shadow: 0px 0px 30px rgb(255, 0, 0, 100%);
      border: 3px solid rgb(200, 150, 150);
    }
  }
`;

export default styles;
