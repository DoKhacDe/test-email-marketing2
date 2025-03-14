import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// create the element "#tda-email-marketing"
const emailMarketing = document.createElement('div')
emailMarketing.id = 'tda-email-marketing'
document.body.appendChild(emailMarketing)


createApp(App).mount(emailMarketing)
