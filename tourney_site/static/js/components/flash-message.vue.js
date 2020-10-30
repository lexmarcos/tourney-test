const flashMessage = Vue.component("FlashMessage", {
  template: /* html */`
      <v-snackbar
        v-if="message"
        :timeout="-1"
        :value="true"
        absolute
        right
        :color="message.type"
        bottom
        elevation="15"
      >
        {{message.text}}
        <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="closeSnackbar"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
      </v-snackbar>`,

  data(){
    return{
      message: null,
    }
  },
  created() {
    let timer;
    Bus.$on('flash-message', (message) => {
      clearTimeout(timer);
      this.message = message;

      timer = setTimeout(() => {
        this.message = null;
      }, 5000);
    });
  },
  methods: {
    closeSnackbar(){
      this.message = null
    }
  },
});
