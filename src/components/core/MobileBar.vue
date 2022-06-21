<script lang="ts">
// import { useRouter } from 'vue-router';
import SearchBar from 'src/components/core/SearchBar.vue';

export default {
  components: { SearchBar },
  setup() {
    return {
      // onClickAccount: async () => {
      //   if (!isLoggedIn.value) await router.push({ name: 'login' });
      // }
    };
  }
};
</script>

<template lang="pug">
q-toolbar.row.q-py-sm.q-px-md.bg-grey-1
  q-btn.q-mr-md(flat, round, dense, :to='{ name: "home" }', active)
    q-icon.material-icons-outlined(name='chevron_left')
  .col.row.justify-center
    search-bar.toolbar-select.q-mr-md.lt-md(size='50')
</template>

<style scoped lang="sass">
.q-btn
  font-size: 20px
.toolbar-select
  flex-basis: 500px
  flex-grow: 0
  flex-shrink: 1
</style>
