const loginForm = Vue.component("LoginForm", {
  template: /* html */`
  <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                  <v-toolbar color="primary" dark flat>
                      <v-toolbar-title>Login</v-toolbar-title>
                  </v-toolbar>
                  <v-card-text>
                      <v-text-field v-model="username" prepend-icon="mdi-account" label="username" required></v-text-field>
                      <v-text-field v-model="password" prepend-icon="mdi-lock" label="password" type="password" required @keyup.enter.native="loginRequest()"></v-text-field>
                      <v-alert type="error" v-show="error">{{ message }}</v-alert>
                  </v-card-text>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="loginRequest()" color="primary">Login</v-btn>
                  </v-card-actions>
              </v-card>
          </v-col>
      </v-row>
  </v-container>`,

  data() {
    return {
      username: "",
      password: "",
      message: String,
      error: false,
    };
  },

  methods: {
    loginRequest(){
      axios.post("/login", {body: {'username': this.username, 'password': this.password}}).then(result => {
        this.message = result.data.message;
        if(this.message == "authenticated"){
          this.$emit('is-authenticated', this.$root.check_auth());
        }else{
          this.sendMessage(result.data.message, 'error');
        }
      });
    },
    sendMessage(text, type){
      Bus.$emit('flash-message', message = {text: text, type: type});
    }
  },
});
