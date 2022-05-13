<script lang="ts">
import { defineComponent } from 'vue';
import { api } from 'src/api';

export default defineComponent({
  name: 'Home',
  components: {},
  methods: {
    async onClick() {
      // type UserData = {
      //   name: string[];
      // };
      // const res = (await api.accounts.query(`
      //     {
      //       me {
      //         name
      //       }
      //     }
      //   `)) as UserData;
      // console.log(res);
      const res = await api.accounts.mutation(`
          {
            signIn(input: 
            {"email": "example@gmail.com",
             "password": "temppassword"}) {
          }
        `);
      console.log(res);
    }
  }
});
</script>

<template lang="pug">
q-page
  h1 Home
  q-btn(@click="onClick") Click
</template>
