
const tournaments = Vue.component("Tournaments", {
  template: /* html */`
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="7">
          <v-card class="pa-5" elevation="0">
            <v-card-title class="mb-5">
              <h1>Tournaments</h1>
            </v-card-title>
            <v-card-text class="px-4">
              <h1 class="mb-3 font-weight-medium">Your Tournaments</h1>
              <v-list flat>
                <v-list-item
                  v-for="(tournament, i) in yourTournaments"
                  :key="i"
                >
                  <v-list-item-content>
                    <router-link :to="'/tournament/' + tournament._id">
                      <v-list-item-title v-text="tournament.name"></v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <h1 class="mt-8 mb-3 font-weight-medium">Other tournaments</h1>
              <v-list flat>
                <v-list-item
                  v-for="(tournament, i) in tournaments"
                  :key="i"
                >
                  <v-list-item-content>
                    <router-link :to="'/tournament/' + tournament._id">
                      <v-list-item-title v-text="tournament.name"></v-list-item-title>
                    </router-link>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="10" md="7" class="d-flex justify-end">
          <v-dialog v-model="dialog" persistent max-width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Create Tournament
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                New Tournament
              </v-card-title>
              <v-card-text>
                <v-text-field label="Tournament Name" v-model="tournamentName"/>
                <v-text-field label="Game" v-model="game"/>
                <v-dialog ref="dialog" v-model="datesModal" :return-value.sync="dates" persistent width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dates"
                      label="Dates"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="dates" range>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="datesModal = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(dates)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-textarea label="Description" v-model="description"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="dialog = false">
                  Cancel
                </v-btn>
                <v-btn dark color="success" @click="submitTournament">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>`,

  data() {
    return {
      tournamentName: "",
      game: "",
      dates: null,
      dialog: false,
      description: "",
      yourTournaments: [],
      tournaments: [],
      datesModal: false,
    };
  },

  created() {
    this.loadTournaments();
    this.loadYourTournaments();
  },

  methods: {
    loadTournaments() {
      axios.get("/api/tournaments").then(result => {
        this.tournaments = result.data.tournaments;
      }).catch((error) => {
        return Bus.$emit('flash-message', message = {text: error.message, type: 'error'});
      });
    },
    loadYourTournaments() {
      axios.get("/api/tournaments/user").then(result => {
        console.log(result)
        this.yourTournaments = result.data.tournaments;
      }).catch((error) => {
        return Bus.$emit('flash-message', message = {text: error.message, type: 'error'});
      });
    },
    submitTournament() {
      payload = {
        name: this.tournamentName,
        game: this.game,
        daterange: this.dates,
        description: this.description,
      }
      axios.post("/api/tournaments/new", payload).then(result => {
        this.loadTournaments()
        console.log(result.data)
        if(!result.data.success){
          return this.$root.sendFlash(result.data.message, result.data.success);
        }
        this.dialog = false;
        return this.$root.sendFlash(result.data.message, result.data.success);
      })
    }
  },
});
