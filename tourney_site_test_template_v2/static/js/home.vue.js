const home = Vue.component("Home", {
  template: /* html */`
    <v-container>
      <h1>
        Logged in as {{user}}
      </h1>
    </v-container>`,

  data() {
    return {
      user: '',
    };
  },

  created() {
    this.loadUser();
  },

  methods: {
    loadUser() {
      axios.get("/users").then(result => {
        
      });
    }
  },
});
