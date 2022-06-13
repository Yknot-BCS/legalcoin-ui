<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'src/store';

const stringOptions = ['Buy', 'Gallery', 'People'];

export default {
  setup() {
    const store = useStore();
    const options = computed(() => store.state.general.options);
    const filteredOptions = ref(stringOptions);
    onMounted(() => {
      void store.dispatch('general/updateOptions');
    });

    return {
      searchText: ref(''),
      stringOptions,
      filteredOptions,
      options,

      filterFn(val: string, update: (arg0: () => void) => void) {
        console.log(val);
        void store.dispatch('general/updateSearch', val.toLowerCase());
        update(() => {
          void store.dispatch('general/updateSearch', val.toLowerCase());
        });
      }
    };
  }
};
</script>

<template lang="pug">
//- Mobile
//- q-btn(flat, round, dense, icon='search', v-if='$q.screen.lt.md')

//- Desktop
q-select.toolbar-select(
  ref='search',
  dense,
  outlined,
  use-input,
  size='100',
  label='Search...',
  v-model='searchText',
  :options='options',
  @filter='filterFn'
)
  template(v-slot:append)
    q-icon.text-weight-bold(name='search', size='18px')

  template(v-slot:no-option)
    q-item
      q-item-section
        .text-center
          q-spinner-pie(color='primary', size='24px')

  template(v-slot:option='scope')
    q-item(
      v-if='scope.opt.groupLabel',
      v-bind='scope.itemProps',
      v-on='scope.itemEvents',
      :disable='true'
    )
      q-item-label(header) {{ scope.opt.label }}
    q-item(
      v-else,
      v-bind='scope.itemProps',
      v-on='scope.itemEvents',
      :to='"/asset/" + scope.opt.id'
    )
      q-item-section
        q-item-label(v-html='scope.opt.label')
</template>

<style scoped lang="sass">
.toolbar-select.q-field--focused
  border-radius: 10px
  .q-field__append
    display: none
</style>
