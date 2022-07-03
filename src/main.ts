import { createApp } from 'vue';
import App from '@/App.vue';
import VueFormInput from '@/index';

const app = createApp(App);
app.use(VueFormInput);
app.mount('#app');
