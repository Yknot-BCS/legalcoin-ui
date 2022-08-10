<script lang="ts">
import RegisterForm from './RegisterForm.vue';

import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    RegisterForm
  },
  setup() {
    return {};
  }
});
</script>

<template lang="pug">
//Desktop
q-card.row.col.animated.fadeInDown.justify-center.triangle(
  v-if='$q.screen.gt.sm'
)
  .col-4.self-center(style='z-index: 1')
    img.text-center.q-mr-xl.q-mb-xl(
      src='~assets/legalcoin-full.png',
      style='width: 18rem'
    )
  RegisterForm
//Mobile
RegisterForm(v-else)
</template>

<style lang="sass" scoped></style>
