<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'src/store';
import { QSelect } from 'quasar';

const stringOptions = ['Buy', 'Gallery', 'People'];

export default defineComponent({
  setup() {
    const store = useStore();
    const options = computed(() => store.state.general.options);
    const filteredOptions = ref(stringOptions);
    const showSearchPopup = ref<QSelect | null>(null);

    onMounted(() => {
      void store.dispatch('general/updateOptions');
      void store.dispatch('general/getCollectionsList');
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
      },

      showSearchPopup,
      onSearchClick() {
        showSearchPopup.value?.showPopup();
      }
    };
  }
});
</script>

<template lang="pug">
.div
  //- Mobile
  q-btn(
    flat,
    round,
    dense,
    icon='search',
    v-if='$q.screen.lt.sm',
    @click='onSearchClick()',
    size='lg'
  )

  //- Desktop
  q-select.toolbar-select(
    ref='showSearchPopup',
    dense,
    outlined,
    use-input,
    label='Search...',
    v-model='searchText',
    :options='options',
    @filter='filterFn',
    v-show='$q.screen.gt.xs'
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
          q-item-label.text-weight-medium.q-pl-lg(v-html='scope.opt.label')
</template>

<style scoped lang="sass">
.toolbar-select.q-field--focused
  border-radius: 10px
  .q-field__append
    display: none
</style>
