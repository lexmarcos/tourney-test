
const infoTournament = Vue.component("InfoTournament", {
  template: /* html */`
    <div class="my-4">
      <span class="text-body-1 font-weight-medium">{{title}}: </span>
      <span class="grey--text">{{info}}</span>
    </div>`,

  props: ['title', 'info']
});
