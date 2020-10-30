const home = Vue.component("Home", {
  template: /* html */`
    <v-container>
      <h1 class="text-h2 mb-5">
        Tourney Site
      </h1>
      <h1>
        <span class="font-weight-light">Welcome to</span> Tourney Site.
      </h1>
      <template v-if="showLogin">
        <v-row justify="center">
          <v-col cols="12">
            <login-form @is-authenticated="showLogin = loadUser()"/>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12">
            <h1>
              Logged in as {{user}}
            </h1>
            <v-btn class="mt-5" color="primary" href="/logout">Logout</v-btn>
          </v-col>
        </v-row>
      </template>
    </v-container>`,

  data() {
    return {
      user: '',
      showLogin: false,
    };
  },

  created() {
    this.$root.check_auth().then(result =>{
      if(result){
        this.loadUser()
      }
      this.showLogin = !result
    });
  },
  methods: {
    loadUser() {
      axios.get("/api/logged_user").then(result => {
        this.user = result.data.username;
      });
    }
  },
});
