<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import LinkCryptoAccount from 'src/components/auth/LinkCryptoAccount.vue';

export default defineComponent({
  name: 'Profile',
  components: { LinkCryptoAccount },
  setup() {
    const route = useRoute();
    const profileId = computed(() => route.params.profile);
    return { profileId };
  }
});
</script>

<template lang="pug">
q-page
  h1 Profile {{profileId}}
  link-crypto-account
</template>
