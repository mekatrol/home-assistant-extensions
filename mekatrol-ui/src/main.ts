/***************************************************
 * Static assets
 ***************************************************/
import './assets/main.css';

/***************************************************
 * Export Vue web components
 ***************************************************/
import { defineCustomElement } from 'vue';
import MekatrolMainView from './components/mekatrol-main-view.ce.vue';
import MekatrolTimeDateCard from './components/mekatrol-time-date-card.ce.vue';
import MekatrolPanicSwitch from './components/mekatrol-panic-switch.ce.vue';
import MekatrolSvgIcon from './components/mekatrol-svg-icon.ce.vue';

const mekatrolMainViewElement = defineCustomElement(MekatrolMainView);
customElements.define('mekatrol-main-view', mekatrolMainViewElement);

const mekatrolTimeDateCardElement = defineCustomElement(MekatrolTimeDateCard);
customElements.define('mekatrol-time-date-card', mekatrolTimeDateCardElement);

const panicSwitchElement = defineCustomElement(MekatrolPanicSwitch);
customElements.define('mekatrol-panic-switch', panicSwitchElement);

const svgIconElement = defineCustomElement(MekatrolSvgIcon);
customElements.define('mekatrol-svg-icon', svgIconElement);

/***************************************************
 * Export Vue container HTML element
 ***************************************************/
export * from './home-assistant/VuePluginContainerHTMLElement';
