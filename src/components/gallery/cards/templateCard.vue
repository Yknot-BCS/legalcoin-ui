<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { GalleryCard } from 'src/types';

export default defineComponent({
  name: 'TemplateCard',
  components: {},
  props: {
    data: {
      type: Object as PropType<GalleryCard>,
      required: true
    }
  },
  setup(props) {
    const card = computed(() => props.data);
    return { card };
  }
});
</script>

<template lang="pug">
q-card
  q-card-section
    q-badge.text-subtitle2.float-right(
      rounded,
      color='primary',
      label=' Silver'
    )
    .row
      .text-h6.heading {{ card.name }}
    .row
      .col-2.column
        .text {{ card.mintprice }}
      .col-2.column
        .text-subtitle4 {{ card.yield }} yield
  q-separator(inset)
  router-link(
    :to='{ name: "template", params: { collection_name: card.collection, template_id: card.id } }'
  )
    q-img.asset-img(:src='card.imageUrl')
</template>

<style lang="sass" scoped>
.asset-img
  width: 100%
  height: 500px
  max-height: 400px
.column
  width: 100px
.heading
  font-weight: bold
</style>
