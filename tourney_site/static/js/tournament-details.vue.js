
const tournamentDetails = Vue.component("TournamentDetails", {
  template: /* html */`
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="py-10 px-3 rounded-xl">
            <v-card-title class="d-block">
              <div><h1 class="mb-1">{{tournament.name}}</h1></div>
              <div><span class="text-overline black--text"><v-icon color="black" class="mr-1">mdi-calendar</v-icon>{{tournament.dates[0]}} - {{tournament.dates[1]}}</span></div>
            </v-card-title>
            <v-card-text>
              <div class="mb-1"><h2>Info <v-icon>mdi-information-outline</v-icon></h2></div>
              <v-divider class="mb-4"></v-divider>
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
    };
  },

  created() {
    this.loadTournament();
  },

  methods: {
    loadTournament() {
      id = this.$route.params.id;
      axios.get("/api/tournament/"+id).then(result => {
        this.tournament = result.data.tournament
        console.log(this.tournament)
      }).catch((error) => {
        return Bus.$emit('flash-message', message = {text: error.message, type: 'error'});
      });
    },
  },
});
