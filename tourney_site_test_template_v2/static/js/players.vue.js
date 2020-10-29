const players = Vue.component("Players", {
    template: /* html */`
      <v-container>
      <v-row justify="center">
        <v-col cols="6">
            <v-card class="pa-5" elevation="3">
                <v-card-title class="mb-5">
                  <h1>Players</h1>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                    :headers="headers"
                    :items="players"
                    dense>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
        </v-row>
      </v-container>`,
  
    data() {
      return {
        headers: [
            {text: "Player", value: "username"},
            ],
        players: [],
      };
    },
  
    created() {
      this.loadPlayers();
    },
  
    methods: {
      loadPlayers() {
        axios.get("/players").then(result => {
            this.players = result.data.players;
        });
      },
    },
  });
  