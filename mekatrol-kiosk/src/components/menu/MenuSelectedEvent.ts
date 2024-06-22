import { MenuItem } from '../../types';

export class MenuSelectedEvent extends CustomEvent<MenuItem> {
  static eventName = 'menu-selected';

  constructor(menuItem: MenuItem) {
    super(MenuSelectedEvent.eventName, {
      detail: menuItem,
      bubbles: true,
      composed: true
    });
  }
}
