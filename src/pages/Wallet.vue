<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Wallet',
  components: {}
});
</script>

<template lang="pug">
q-page
    q-card( class="my-card")
      q-card-section
        q-card-section-title
          | My Balance
      q-card-section
        | x LEGAL
      q-card-section
        | x NFTS
      q-card-section
        | Options
        q-btn(
                color="primary"
                label="BUY LEGAL TOKENS"
                @click="$router.push({name: 'buytokens', params: {status: 'checkout'}})"
                )
            



</template>
