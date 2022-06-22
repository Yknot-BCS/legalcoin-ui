<script lang="ts">
import { onMounted, computed } from 'vue';
import Cards from 'src/components/gallery/cards/index.vue';
import { useStore } from 'src/store';
export default {
  components: { Cards },
  setup() {
    const store = useStore();
    const assets = computed(() => store.state.buy.assets);
    onMounted(async () => {
      await store.dispatch('buy/updateAll');
    });
    return {
      assets
    };
  }
};
</script>

<template lang="pug">
.row
  .col-12.col-md-6
    .landing-left
      h2.text-grey-9 Fund some of the most worthy Class Action Lawsuits with LegalCoin.
      p.landing-subheading Fiving you access to the justice you deserve. Play a role in bringing large conglomorates to justice by funding cases such as the diesel emissions scandal.
  .col-12.col-md-6.pgb
    .landing-right
      h4.q-ma-none.q-pl-lg.trending-title Trending
      .landing-right-card-container
        .main-asset.col-md-6.q-pa-lg(v-if='assets.length > 0')
          Cards.shadow-10(:data='assets[0]', type='asset')
</template>

<style lang="sass" scoped>
.pgb
  position: relative

@media (min-width: $breakpoint-sm-max)
  .landing-heading
    color: grey-10
  .landing-subheading
    font-family: "ralewayregular"
    font-size: 1.5rem
  .landing-left
    padding: 4rem
    text-align: center
    max-width: 45rem
    margin-left:2rem

  .landing-right
    padding: 5rem
  .landing-right-card-container
    max-width:40rem
  .trending-title
    font-weight: 200

  .pgb::before
    content:' '
    position: absolute
    z-index: -1
    top: 0rem
    left: -15rem
    right: 0rem
    bottom: 0rem
    background-image: url("~assets/polygons/polygon_home_trending_horizontal.svg")
    background-repeat: no-repeat
    background-size: cover
@media (max-width: $breakpoint-md-min)
  .q-pa-xl
    padding: 1rem
  .pgb::before
    content:' '
    position: absolute
    z-index: -1
    top: -3rem
    left: 0rem
    right: 0rem
    bottom: 0rem
    background-image: url("~assets/polygons/polygon_home_trending_vertical.svg")
    background-repeat: no-repeat
    background-size: cover
</style>
