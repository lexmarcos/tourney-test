const home = Vue.component("Home", {
  template: /* html */`
    <v-container>
      <template v-if="showLogin">
        <v-row justify="center">
          <v-col cols="12">
            <h1>
              <span class="font-weight-light">Welcome to</span> Tourney Site.
            </h1>
          </v-col>
          <v-col cols="12">
            <login-form @is-authenticated="showLogin = $event"/>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <h1>
          Logged in as {{user}}
        </h1>
      </template>
    </v-container>`,

  data() {
    return {
      user: '',
      showLogin: true,
    };
  },

  created() {
    this.loadUser();
    this.showLogin = !this.$root.check_auth();
  },
  methods: {
    loadUser() {
      axios.get("/users").then(result => {
        
      });
    }
  },
});
