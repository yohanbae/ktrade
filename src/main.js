import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import firebase from "firebase/app";
import Vuex from 'vuex'
import store from "./Store";
import "firebase/auth";
import "firebase/firestore";
require('dotenv').config()

Vue.config.productionTip = false
Vue.use(Vuex)

let firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
  measurementId: process.env.VUE_APP_MEASUREMENTID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)


new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
