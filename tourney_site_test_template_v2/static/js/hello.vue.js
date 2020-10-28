const helloComp = Vue.component("HelloComp", {
  template: /* html */`
    <v-container>{{message}}</v-container>`,

  data() {
    return {
      message: '',
    };
  },

  created() {
    this.load_message();
  },

  methods: {
    load_message() {
      axios.get("/hello").then(result => {
        this.message = result.data.message;
      });
    }
  },
});
