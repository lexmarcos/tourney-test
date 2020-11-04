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
            <game-match v-for="(match, index) in round" :match="match" :round="round_index" :game="index" :show-win-button="isTournamentStarted && isOwnerOfTournament" :key="'m'+round_index + index" @update-tournament="updateTournament"></game-match>
          </div>
        </div>
      </v-card>
    </v-dialog>`,

  props: ['bracket', 'showBracket', 'isOwnerOfTournament', "isTournamentStarted"],
  created(){
    console.log("Test ", this.isTournamentStarted)
  },
  methods:{
    closeBracket(){
      this.$emit("close-bracket")
    },
    updateTournament(){
      this.$emit("update-tournament")
    },
  }
});
