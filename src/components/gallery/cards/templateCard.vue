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
  },
  computed: {
    badgeColour() {
      switch (this.card.tier) {
        case 'Silver':
          return 'grey';
        case 'Gold':
          return 'yellow-7';
        case 'Bronze':
          return 'orange-14';
        case 'Platinum':
          return 'grey-4';
        default:
          return 'grey';
      }
    }
  }
});
</script>

<template lang="pug">
q-card
  q-card-section
    .row
      .col
        .row
          .text-h6.heading {{ card.name }}
        .row
          .col-auto
            .q-mr-sm {{ card.mintprice }} &#8226;
          .col-auto
            .text-subtitle4 {{ card.yield }} yield
      .col-4
        q-badge.text-subtitle2.float-right.text(rounded, :color='badgeColour') {{ card.tier }}
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
.text
  margin-top: 15px
</style>
