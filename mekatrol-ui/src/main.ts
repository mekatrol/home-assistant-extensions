/***************************************************
 * Export Vue web components
 ***************************************************/
import { defineCustomElement } from 'vue';
import MainView from './components/main-view.ce.vue';

const element = defineCustomElement(MainView);
customElements.define('main-view', element);

/***************************************************
 * Export Vue container HTML element
 ***************************************************/
export * from './home-assistant/VuePluginContainerHTMLElement';
