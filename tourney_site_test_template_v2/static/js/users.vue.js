const usersComp = Vue.component("UsersComp", {
    template: /* html */`
      <v-container>
      <v-row>
        <v-col cols="6">
            <v-card>
                <v-card-title>Users</v-card-title>
                <v-card-text>
                    <v-data-table
                    :headers="headers"
                    :items="users"
                    dense>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card>
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Create new user</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="n_username" prepend-icon="mdi-account" label="username" required></v-text-field>
                    <v-text-field v-model="n_password" prepend-icon="mdi-lock" label="password" type="password" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="newUserRequest()" color="primary">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        </v-row>
      </v-container>`,
  
    data() {
      return {
        headers: [
            {text: "User", value: "username"},
            ],
        users: [],
        n_username: "",
        n_password: "",
        message: "",
      };
    },
  
    created() {
      this.load_users();
    },
  
    methods: {
      load_users() {
        axios.get("/users").then(result => {
            this.users = result.data.users;
        });
      },
      newUserRequest(){
        axios.post("/users", {body: {"n_username": this.n_username, "n_password": this.n_password}}).then(result => {
            this.message = result.data.message;
            this.n_username = "";
            this.n_password = "";
            this.load_users();
        });            
      }
    },
  });
  