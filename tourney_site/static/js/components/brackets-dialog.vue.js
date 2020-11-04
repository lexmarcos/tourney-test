const bracketDialog = Vue.component("BracketDialog", {
  template: /* html */`
    <v-dialog
      v-model="showBracket"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>Brackets</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="closeBracket"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="bracket" v-if="bracket">
          <div v-for="(round, round_index) in bracket" :key="round_index" class="round">
            <game-match 
              v-for="(match, index) in round"
              :match="match"
              :round="round_index"
              :game="index"
              :show-win-button="isTournamentStarted && isOwnerOfTournament"
              :key="'m'+round_index + index"
              @update-tournament="updateTournament"
              @can-finish="roundToFinish = $event"
            />
            <v-btn color="green" v-if="roundToFinish == round_index" dark @click="finishRound" absolute class="mt-3 finish-round-btn">FINISH ROUND !</v-btn>
          </div>
          <div v-if="winner" class="d-flex justify-center align-center flex-column ml-10">
            <div class="d-flex align-center justify-center mb-3">
              <v-icon color="orange" left x-large>mdi-trophy</v-icon><h1 class="orange--text">Winner!</h1>
            </div>
            <div>
              <h1 class="text-h2 font-weight-bold">{{winner}}</h1>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>`,

  props: ['bracket', 'showBracket', 'isOwnerOfTournament', "isTournamentStarted", "roundToFinish", 'winner'],
  methods:{
    closeBracket(){
      this.$emit("close-bracket")
    },
    updateTournament(){
      this.$emit("update-tournament")
    },
    finishRound() {
      payload = {
        id: this.$route.params.id,
        round: this.roundToFinish
      };
      axios.post("/api/tournament/round/finish", payload).then((result) => {
        this.updateTournament();
      });
    },
  }
});
