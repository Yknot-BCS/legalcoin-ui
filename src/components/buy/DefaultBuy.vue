<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'src/store';
import GalleryView from 'src/components/gallery/GalleryView.vue';

export default defineComponent({
  name: 'DeafaultBuy',
  components: { GalleryView },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    const collections = computed(() => store.state.buy.collections);
    const templates = computed(() => store.state.buy.templates);
    const filter = computed(() => store.state.buy.filter);
    const accountData = computed(() => store.state.buy.accountData);
    const assetPage = computed(() => store.state.buy.assetPaging);
    const templatePage = computed(() => store.state.buy.templatePaging);
    const collectionPage = computed(() => store.state.buy.collectionPaging);
    var ok = ref<boolean>(true);
    const assetPages = computed((): number =>
      Math.ceil(
        accountData.value.assets / (store.state.buy.assetFilter.limit as number)
      )
    );
    const templatePages = computed((): number =>
      Math.ceil(
        accountData.value.templates /
          (store.state.buy.templateFilter.limit as number)
      )
    );
    const collectionPages = computed((): number =>
      Math.ceil(accountData.value.collections / 48)
    );
    const sections = computed(() => {
      return [
        {
          name: 'Assets',
          data: assets.value,
          results: accountData.value.assets,
          type: 'asset',
          page: assetPage.value,
          pages: assetPages.value
        },
        {
          name: 'Collections',
          data: collections.value,
          results: accountData.value.collections,
          type: 'collection',
          page: collectionPage.value,
          pages: collectionPages.value
        },
        {
          name: 'Templates',
          data: templates.value,
          results: accountData.value.templates,
          type: 'template',
          page: templatePage.value,
          pages: templatePages.value
        }
      ];
    });

    function changePaging(value: string, name: string) {
      console.log(value, name);
      void store.dispatch('buy/update' + name + 'Paging', value);
    }

    function changeFilter(value: string) {
      void store.dispatch('buy/updateFilter', value);
    }

    return {
      assets,
      collections,
      templates,
      filter,
      accountData,
      changeFilter,
      sections,
      changePaging,
      ok
    };
  }
});
</script>

<template lang="pug">
.row.q-px-md.q-py-lg()
  .col-12
    .row
      .col-12.q-pt-md
        .q-px-md.text-h6.text-grey-8.text-weight-bold.text-center Primary Retail Portal
  .col-12
    div(v-if="ok") toggled content
  .col-12(v-for="section in sections")
    .row(v-if="filter === 'All' || filter === section.name")

      .col-12.q-pt-lg.q-px-sm
        .row
          .col-6.px
            .q-px-md.text-h6.text-grey-8 {{section.name}}
          .col-6
            q-btn.q-px-md.float-right.text-grey-8(@click="changeFilter(section.name)" label="view all" flat v-if="filter === 'All'")
            .text-subtitle1.q-px-md.float-right.text-grey-8(v-if="filter === section.name") {{section.results + ' results'}}

      .col-12.q-px-sm
        GalleryView(:data="section.data" :type="section.type")
        
      .col-12 
        .row.justify-center
          q-pagination(
            v-if="filter === section.name"
            v-model="section.page"
            :max="section.pages"
            input
            @update:model-value ="(e: string) => {changePaging( e ,section.name)}"
          )
</template>
