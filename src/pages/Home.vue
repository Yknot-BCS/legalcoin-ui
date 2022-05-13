<script lang="ts">
import { defineComponent } from 'vue';
import { api } from 'src/api';

export default defineComponent({
  name: 'Home',
  components: {},
  methods: {
    async onClick() {
      type UserData = {
        name: string[];
      };
      const res = (await api.accounts.query(`
          {
            users {
              name
            }
          }
        `)) as UserData;
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
