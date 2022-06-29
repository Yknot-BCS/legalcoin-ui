<script lang="ts">
import { defineComponent } from 'vue';
import { date } from 'quasar';

export default defineComponent({
  name: 'TxCard',
  components: {},
  props: {
    action: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  computed: {
    displayDate(): string {
      return date.formatDate(this.date, 'MMM DD, YYYY, hh:mm A');
    }
  },
  setup() {
    return {};
  }
});
</script>

<template lang="pug">
q-card-section.row
  .col-1
    q-icon(name='fa-solid fa-credit-card')
  .col-7
    .col.text-bold.text-txcard
      | {{ action }}
    .col
      .col.text-txcard
        | {{ description }}
      .col.text-txcard
        | {{ displayDate }}
  .col-4.text-bold.text-txcard
    | {{ amount }} LEGAL
q-separator
</template>

<style lang="sass">
.text-txcard
  font-family: Arial
  font-size: 0.88rem
</style>
