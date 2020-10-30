
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
              <v-list flat>
                <v-list-item
                  v-for="(tournament, i) in tournaments"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="tournament.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="10" md="7" class="d-flex justify-end">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
              >
              Create Tournament
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                New Tournament
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Tournament Name"
                  v-model="tournamentName"
                />
                <v-text-field
                  label="Game"
                  v-model="game"
                />
                <v-dialog
                  ref="dialog"
                  v-model="datesModal"
                  :return-value.sync="dates"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dates"
                      label="Dates"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dates"
                    range
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="datesModal = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(dates)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                <v-textarea
                  label="Description"
                  v-model="description"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="grey darken-1"
                  text
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  dark
                  color="success"
                  @click="submitTournament()"
                >
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
      tournaments: [],
      datesModal: false,
    };
  },

  created() {
    this.loadTournaments();
  },

  methods: {
    loadTournaments() {
      axios.get("/v/tournaments").then(result => {
        this.tournaments = result.data.tournaments;
      });
    },
    submitTournament() {
      payload = {
        name: this.tournamentName,
        game: this.game,
        daterange: this.dates,
        description: this.description,
      }
      axios.post("/v/tournaments/new", payload).then(result => {
        this.loadTournaments()
        this.dialog = false;
      });
    }
  },
});
