const socket = io();

Vue.createApp({
  data() {
    return {
      oauth: `https://discord.com/oauth2/authorize?client_id=816363576218091600&redirect_uri=${encodeURIComponent(
        location.origin + "/"
      )}&response_type=code&scope=guilds%20identify`,
    };
  },
}).mount("body");
