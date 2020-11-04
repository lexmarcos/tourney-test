const gameMatch = Vue.component("GameMatch", {
  template: /* html */`
    <v-card width="200" :class="['ma-3 d-flex justify-center flex-column', roundClass]">
      <div class="my-2 pa-1 px-3 d-flex align-center">
        <span>{{match.player_1.name}}</span>
        <v-spacer></v-spacer>
        <span v-if="!verifyPlayer1Name" class="font-weight-medium">{{match.player_1.score}}</span>
      </div>
      <v-divider></v-divider>
      <div class="my-2 pa-1 px-3 d-flex align-center">
        <span>{{match.player_2.name}}</span>
        <v-spacer></v-spacer>
        <span v-if="!verifyPlayer2Name" class="font-weight-medium">{{match.player_2.score}}</span>
      </div>
    </v-card>`,

  props: ['match', 'round'],
  computed: {
    verifyPlayer1Name(){
      return this.match.player_1.name === 'BYE' || this.match.player_1.name.includes('Winner of M')
    },
    verifyPlayer2Name(){
      return this.match.player_2.name === 'BYE' || this.match.player_2.name.includes('Winner of M')
    },
    roundClass(){
      return 'round-' + this.round
    }
  }
});
