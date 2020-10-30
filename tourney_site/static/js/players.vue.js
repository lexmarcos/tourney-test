const players = Vue.component("Players", {
    template: /* html */`
      <v-container>
      <v-row justify="center">
        <v-col cols="6">
            <v-card class="pa-5" elevation="0">
                <v-card-title class="mb-5">
                  <h1>Players</h1>
                </v-card-title>
                <v-card-text>
                <v-list flat v-if="players">
                  <v-list-item
                    v-for="(player, i) in players"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="player"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
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
        axios.get("/api/players").then(result => {
          this.players = result.data.players;
          
        })
      },
    },
  });
  