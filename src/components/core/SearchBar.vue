<script lang="ts">
import { ref } from 'vue';

const stringOptions = ['Buy', 'Gallery', 'People'];

export default {
  setup() {
    const filteredOptions = ref(stringOptions);

    return {
      searchText: ref(''),
      stringOptions,
      filteredOptions,

      filterFn(val: string, update: (arg0: () => void) => void) {
        if (val === '') {
          update(() => {
            filteredOptions.value = stringOptions;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          filteredOptions.value = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      }
    };
  }
};
</script>

<template lang="pug">
q-select.toolbar-select(
  ref='search',
  dense,
  outlined,
  label='Search items, collections and people...',
  v-model='searchText',
  :options='filteredOptions',
  @filter='filterFn'
)
  template(v-slot:append)
    q-icon.text-weight-bold(name='search', size='18px')

  template(v-slot:no-option)
    q-item
      q-item-section
        .text-center
          q-spinner-pie(color='primary', size='24px')

  //- template(v-slot:option='scope')
  //-   q-item(v-bind='scope.itemProps')
  //-     q-item-section(side)
  //-       q-icon(name='collections_bookmark')
  //-     q-item-section
  //-       q-item-label(v-html='scope.opt.label')
  //-     q-item-section(side :class="{ 'default-type': !scope.opt.type }")
  //-       q-btn.bg-grey-1.q-px-sm(outline dense no-caps text-color='blue-grey-5' size='12px')
  //-       div {{ scope.opt.type || 'Jump to' }}
  //-         q-icon(name='subdirectory_arrow_left' size='14px')
</template>

<style scoped lang="sass">
.toolbar-select.q-field--focused
  border-radius: 10px
  .q-field__append
    display: none
</style>
