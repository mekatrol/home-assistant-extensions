import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { AppConfig, MenuItem } from './types';

@customElement('mekatrol-sidebar-menu')
export class MekatrolSidebarMenuElement extends LitElement {
  @property({ type: Object })
  config?: AppConfig;

  getLabel(menuItem: MenuItem): TemplateResult<1> {
    return menuItem.showLabel ? html`<span>${menuItem.label}</span>` : html``;
  }

  render() {
    return html`
      <nav class="sidebar-menu">
        ${this.config?.menu.map((menuItem: MenuItem) => {
          return html`
            <a href="#">
              <ha-icon icon="${menuItem.icon}"></ha-icon>
              ${this.getLabel(menuItem)}
            </a>
          `;
        })}
      </nav>
    `;
  }

  static styles = css`
    .sidebar-menu {
      display: flex;
      flex-direction: column;
      padding-top: 1rem;
      padding-inline: 20px;
      gap: 1rem;
      align-items: center;
    }

    .sidebar-menu > a {
      min-height: 50px;
      min-width: 50px;
      border-radius: 10px;
      outline: 2px solid currentColor;
      padding: 0.5em;
      width: 100%;
      cursor: pointer;
      color: currentColor;
      text-decoration: none;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      color: green;
    }

    .sidebar-menu > a.link-active,
    .sidebar-menu > a:hover {
      --clr-hover: #0096ff;
      border-color: var(--clr-hover);
      color: var(--clr-hover);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mekatrol-sidebar-menu': MekatrolSidebarMenuElement;
  }
}

if (!customElements.get('mekatrol-sidebar-menu')) {
  customElements.define('mekatrol-sidebar-menu', MekatrolSidebarMenuElement);
}
