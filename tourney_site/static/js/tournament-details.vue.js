const tournamentDetails = Vue.component("TournamentDetails", {
  template: /* html */ `
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="py-10 px-3 rounded-xl" v-if="tournament">
          <bracket-dialog :bracket="tournament.brackets" :show-bracket="showBracket" @close-bracket="showBracket = false"></bracket-dialog>
            <v-card-title class="d-flex">
              <div>
                <div><h1 class="mb-1">{{tournament.name}}</h1></div>
                <div><span class="text-overline black--text"><v-icon color="black" class="mr-1">mdi-calendar</v-icon>{{tournament.dates[0]}} - {{tournament.dates[1]}}</span></div>
              </div>
              <v-spacer></v-spacer>
              <v-btn color="primary" v-if="user !== tournament.creator && checkIfPlayerIsSignedUp" @click="signUpToTournament">Sign Up</v-btn>
            </v-card-title>
            <v-card-text>
              <div class="mb-1"><h2>Info <v-icon>mdi-information-outline</v-icon></h2></div>
              <v-divider class="mb-4"></v-divider>
              <v-btn color="primary" class="my-4" v-if="user === tournament.creator && checkIfPlayerIsSignedUp && !tournament.brackets" @click="placePlayers" :loading="loadingCreateBracket">Place Players</v-btn>
              <v-btn color="deep-purple darken-1" dark v-else-if="tournament.brackets" @click="showBracket = true">Show Bracket</v-btn>
              <info-tournament title="Creator" :info="tournament.creator"/>
              <info-tournament title="Game" :info="tournament.game"/>
              <info-tournament title="Type" :info="tournament.type"/>
              <info-tournament title="Location" :info="tournament.location"/>
              <div class="my-4">
                <div class="text-body-1 font-weight-medium">Directors:</div>
                <div class="grey--text" v-for="director in tournament.directors" :key="director"> {{director}} |</div>
              </div>
              <div class="my-4">
                <div class="text-body-1 font-weight-medium">Description:</div>
                <div class="grey--text">{{tournament.description}}</div>
              </div>
            </v-card-text>
            <v-row class="pl-3">
              <v-col cols="12" md="6" class="d-flex justify-center">
                <v-list dense>
                  <v-subheader>PLAYERS <v-icon right>mdi-account</v-icon></v-subheader>
                  <v-list-item-group
                    color="primary"
                  >
                    <v-list-item
                      v-for="(player, i) in tournament.players_joined"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="player"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-center">
                <v-list dense>
                  <v-subheader>WATCHERS <v-icon right>mdi-eye</v-icon></v-subheader>
                  <v-list-item-group
                    color="primary"
                  >
                    <v-list-item
                      v-for="(watcher, i) in tournament.watchers"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="watcher"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-center">
                <v-list dense>
                  <v-subheader>PLAYERS INTERESTED <v-icon right>mdi-account-search</v-icon></v-subheader>
                  <v-list-item-group
                    color="primary"
                  >
                    <v-list-item
                      v-for="(interested, i) in tournament.players_interested"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="interested"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-center">
                <v-list dense>
                  <v-subheader>ASSISTANT DIRECTORS <v-icon right>mdi-shield-account</v-icon></v-subheader>
                  <v-list-item-group
                    color="primary"
                  >
                    <v-list-item
                      v-for="(assistent, i) in tournament.assistant_directors"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-text="assistent"></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>`,

  data() {
    return {
      tournament: null,
      user: null,
      showBracket: false,
      loadingCreateBracket: false,
    };
  },

  created() {
    this.loadTournament();
    this.loadUser();
  },
  computed: {
    checkIfPlayerIsSignedUp() {
      return !this.tournament.players_joined.includes(this.user);
    },
  },
  methods: {
    loadTournament() {
      id = this.$route.params.id;
      axios
        .get("/api/tournament/" + id)
        .then((result) => {
          this.tournament = result.data.tournament;
        })
        .catch((error) => {
          return Bus.$emit(
            "flash-message",
            (message = { text: error.message, type: "error" })
          );
        });
    },
    signUpToTournament() {
      payload = {
        id: this.$route.params.id,
      };
      axios.post("/api/tournament/signup", payload).then((result) => {
        this.loadTournament();
      });
    },
    loadUser() {
      axios.get("/api/logged_user").then((result) => {
        this.user = result.data.username;
      });
    },
    placePlayers() {
      this.loadingCreateBracket = true;
      payload = {
        id: this.$route.params.id,
      };
      axios.post("/api/tournament/start", payload).then((result) => {
        this.loadTournament();
        loadingCreateBracket = false;
        this.showBracket = true;
      });
    },
  },
});
