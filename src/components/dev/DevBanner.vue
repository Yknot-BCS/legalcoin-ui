<script lang="ts">
import { useStore } from 'src/store';
import { onMounted, computed, ref } from 'vue';
import UalLoginHandler from 'src/components/ual/UalLoginHandler.vue';

export default {
  setup() {
    const store = useStore();
    const useLocalSigner = ref(false);
    onMounted(() => {
      useLocalSigner.value = localStorage.getItem('useLocalSigner') == 'true';
      store.commit('account/setUseLocalSigner', useLocalSigner.value);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function setUseLocalSigner(value: boolean, event: Event) {
      localStorage.setItem('useLocalSigner', value ? 'true' : 'false');
      store.commit('account/setUseLocalSigner', value);
    }
    return {
      useLocalSigner,
      setUseLocalSigner,
      DEVELOPMENT: computed(
        () => process.env.DEVELOPMENT?.toLowerCase() === 'true'
      )
    };
  },
  components: { UalLoginHandler }
};
</script>

<template lang="pug">
q-header.q-py-sm(elevated) <!-- Remove .q-pb-sm when dev banner removed -->
  q-toolbar.dev-banner.text-secondary 
    .q-mr-sm Development
    UalLoginHandler
    q-checkbox(
      v-model='useLocalSigner',
      size='xs',
      @update:model-value='setUseLocalSigner'
    ) Use Anchor
</template>

<style lang="sass" scoped>
.dev-banner
  background: $primary
  min-height: 0.2rem
  justify-content: center
</style>
