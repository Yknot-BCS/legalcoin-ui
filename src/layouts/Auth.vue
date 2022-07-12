<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Auth'
});
</script>

<template lang="pug">
.bg.img
.container
  img.polygon.tr.animated.fadeInRight.slower(src='~assets/polygons/pg1.svg')
  img.polygon.tr.animated.fadeInRight.slow(src='~assets/polygons/pg2.svg')
  img.polygon.tr(src='~assets/polygons/pg3.svg')
  img.polygon.br.animated.fadeInLeft.slow(src='~assets/polygons/pg4.svg')
  img.polygon.br.animated.fadeInLeft.slower(src='~assets/polygons/pg5.svg')
  img.polygon.br(src='~assets/polygons/pg6.svg')

  q-layout.row.content-center(view='hHh lpR fFf')
    router-link.cursor-pointer(to='/')
    .col.content-center
      q-page-container
        router-view
</template>

<style lang="sass" scoped>
.logo-wrapper
  margin-top: 5vh
  margin-bottom: 2vh
  .logo
    width: clamp(15rem, 60vw, 25rem)

.container
  position: absolute
  width: 100%
  overflow: hidden

.bg.img
  position: absolute
  z-index: -2
  top: 0px
  left: 0px
  width: 100%
  height: 100%
  background-image: url("~assets/polygons/bg.svg")
  background-repeat: repeat-xy
  opacity: 0.4

.polygon
  position: absolute
  z-index: -1
  &.tr
    right: 0rem
    top: 0rem
  &.br
    left: 0rem
    bottom: 0rem
</style>
