import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
import store from './store/index';
import socketPlugin from './plugins/socket';

const app = createApp(App);

app.use(socketPlugin, { url: 'http://localhost:3000' });
app.use(router, store);
app.mount('#app');