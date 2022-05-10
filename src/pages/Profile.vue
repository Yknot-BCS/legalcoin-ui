<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Profile',
  components: {},
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
</template>
