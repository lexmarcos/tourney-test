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
        <div class="d-flex justify-center align-start ml-10 mt-5">
          <div v-for="(round, round_index) in bracket" :key="round_index">
            <game-match v-for="(match, index) in round" :match="match" :round="round_index" :key="'m'+round_index + index"></game-match>
          </div>
        </div>
      </v-card>
    </v-dialog>`,

  props: ['bracket', 'showBracket'],
  created(){
    console.log(this.bracket)
  },
  methods:{
    closeBracket(){
      this.$emit("close-bracket")
    },
  }
});
