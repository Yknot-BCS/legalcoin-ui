<script lang="ts">
import { defineComponent } from 'vue';
import { api } from 'src/api';
import { SignInResponse } from 'src/types';

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
      try {
        const res = (await api.accounts.mutation(`
          {
            signIn(input: { 
              email: "jpbeukes01@gmail.com", 
              password: "smile123" 
            })
          }
        `)) as SignInResponse;
        console.log(res);
      } catch (error) {
        console.log((error as Error).message);
      }
    }
  }
});
</script>

<template lang="pug">
q-page
  h1 Home
  q-btn(@click="onClick") Click
</template>
