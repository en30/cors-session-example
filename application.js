import "@babel/polyfill";
import axios from 'axios';

const backendBase = 'http://localhost:4000';
const backendCallback = `${backendBase}/callback`;
const client = axios.create({
  baseURL: backendBase,
  withCredentials: true
})

const vm = new Vue({
  data: {
    user: null
  },
  created: async function() {
    const res = await client.get(`${backendBase}/session`);
    this.user = res.data.user;
  },
  methods: {
    signIn() {
      location.href = `${backendBase}/auth`;
    },
    async signOut() {
      await client.delete(`${backendBase}/session`);
      this.user = null;
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  vm.$mount('#app');
})
