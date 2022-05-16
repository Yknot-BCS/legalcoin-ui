<script lang="ts">
import { api } from 'src/api';
import { SignInResponse } from 'src/types';
import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();
    return {
      onClick: async () => {
        try {
          type ResponseType = { signIn: SignInResponse };
          const res = (await api.accounts.mutation(`
          {
            signIn(input: { 
              email: "jpbeukes01@gmail.com", 
              password: "smile123" 
            }) {
              token
              sessionLength
            }
          }
        `)) as ResponseType;
          $q.notify({
            type: 'positive',
            message: 'Logged in'
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: (error as Error).message
          });
        }
      }
    };
  }
};
</script>

<template lang="pug">
q-page
  h1 Home
  q-btn(@click="onClick") Click
</template>
