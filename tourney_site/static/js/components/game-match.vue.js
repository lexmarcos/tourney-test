const gameMatch = Vue.component("GameMatch", {
  template: /* html */`
    <div>
      <v-card width="250" :class="['my-3 d-flex justify-center flex-column']">
        <div :class="['py-2 pa-1 px-3 d-flex align-center', verifyPlayer1Win]">
          <span>{{match.player_1.name}}</span>
          <v-spacer></v-spacer>
          <div v-if="!verifyPlayer1Name" >
            <span class="font-weight-medium">{{match.player_1.score}}</span>
            <v-btn v-if="showWinButton && verifyPlayer1Win === ''" x-small color="green" dark class="ml-2" @click="makePlayerWinner('player_1')">win</v-btn>
          </div>
        </div>
        <v-divider></v-divider>
        <div :class="['py-2 pa-1 px-3 d-flex align-center', verifyPlayer2Win]">
          <span>{{match.player_2.name}}</span>
          <v-spacer></v-spacer>
          <div v-if="!verifyPlayer2Name">
            <span class="font-weight-medium">{{match.player_2.score}}</span>
            <v-btn v-if="showWinButton && verifyPlayer2Win === ''" x-small color="green" dark class="ml-2" @click="makePlayerWinner('player_2')">win</v-btn>
          </div>
        </div>
      </v-card>
    </div>`,

  props: ['match', 'showWinButton', 'round', 'game'],
  computed: {
    verifyPlayer1Name(){
      return this.match.player_1.name === 'BYE' || this.match.player_1.name.includes('Winner of M')
    },
    verifyPlayer2Name(){
      return this.match.player_2.name === 'BYE' || this.match.player_2.name.includes('Winner of M')
    },
    verifyPlayer1Win(){
      if (this.match.player_1.hasOwnProperty("winner")) {
        if(this.match.player_1.winner){
          return "winner"
        }
        return "loser"
      }
      return ""
    },
    verifyPlayer2Win(){
      if (this.match.player_2.hasOwnProperty("winner")) {
        if(this.match.player_2.winner){
          return "winner"
        }
        return "loser"
      }
      return ""
    }
  },
  methods: {
    makePlayerWinner(player){
      payload = {
        id: this.$route.params.id,
        round: this.round,
        game: this.game,
        player: player
      }
      axios.post("/api/tournament/player/win", payload).then((result) => {
        if(result.data.is_able_to_finish){
          this.$emit('can-finish', this.round)
        }
        this.$emit('update-tournament')
      });
    }
  }
});
