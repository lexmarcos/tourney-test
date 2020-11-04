const rankingDialog = Vue.component("RankingDialog", {
  template: /* html */`
    <v-dialog
      v-model="showRanking"
      hide-overlay
      max-width="350"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-toolbar-title>Ranking</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          <v-btn
            icon
            dark
            @click="closeRanking"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <div class="mb-4">
            <div class="ma-1"><h3>1°</h3></div>
            <v-divider></v-divider>
            <div><span>{{winner}}</span></div>
          </div>
          <div v-for="position, index in reverseRanking" class="mb-4">
            <div class="ma-1"><h3>{{index + 2}}°</h3></div>
            <v-divider></v-divider>
            <div v-for="player in position" class="ma-1"><span>{{player}}</span></div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>`,

  props: ['showRanking', 'ranking', 'winner'],
  computed:{
    reverseRanking(){
      return this.ranking.reverse();
    }
  },
  methods:{
    closeRanking(){
      this.$emit("close-ranking")
    },
  }
});
