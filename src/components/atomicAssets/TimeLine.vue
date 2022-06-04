<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { date } from 'quasar';

export default defineComponent({
  name: 'Timeline',
  components: {},
  props: {
    startDate: {
      type: Date,
      required: true
    },
    maturityDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    }
  },
  setup(props) {
    const start = computed(() => props.startDate);
    const maturity = computed(() => props.maturityDate);
    const expiry = computed(() => props.expiryDate);
    const progress = computed((): number => {
      const startTimestamp = new Date(start.value).getTime();
      const maturityTimestamp = new Date(maturity.value).getTime();
      const expiryTimestamp = new Date(expiry.value).getTime();
      const now = new Date().getTime();
      if (now < maturityTimestamp && now > startTimestamp) {
        return (
          ((now - startTimestamp) / (maturityTimestamp - startTimestamp)) * 2
        );
      } else if (now > maturityTimestamp && now < expiryTimestamp) {
        return (
          ((now - maturityTimestamp) / (expiryTimestamp - maturityTimestamp)) *
            2 +
          2
        );
      } else if (now > expiryTimestamp) {
        return 4;
      } else {
        return 0;
      }
    });
    const model = ref({
      min: 0,
      max: progress.value
    });
    return {
      start,
      maturity,
      expiry,
      model,
      fnMarkerLabel: (val: number) =>
        val < 2 ? `${50 * val}%` : `${200 - 50 * val}%`
    };
  },
  computed: {
    startDateDisplay() {
      return date.formatDate(this.startDate, 'DD MMM YYYY');
    },
    maturityDateDisplay() {
      return date.formatDate(this.maturityDate, 'DD MMM YYYY');
    },
    expiryDateDisplay() {
      return date.formatDate(this.expiryDate, 'DD MMM YYYY');
    }
  }
});
</script>

<template lang="pug">
.row.q-px-lg
  .col-12.q-pb-xl
    q-range.q-px-lg.q-mt-md(
      v-model='model',
      color='primary',
      left-thumb-color='transparent',
      thumb-color='primary',
      markers,
      marker-labels,
      :step='1',
      :min='0',
      :max='4',
      readonly
    )
      template(v-slot:marker-label-group='{ markerMap }')
        div(
          v-for='val in [1, 3]',
          :key='val',
          :class='markerMap[val].classes',
          :style='markerMap[val].style'
        ) {{ fnMarkerLabel(val) }}
        .row.fit.items-center(
          v-for='val in [0, 2, 4]',
          :key='val',
          :class='markerMap[val].classes',
          :style='markerMap[val].style'
        )
          .col-12.text-center {{ fnMarkerLabel(val) }}
          .col-12.text-center(v-if='val == 0') Start
          .col-12.text-center(v-else-if='val == 2') Maturity
          .col-12.text-center(v-else-if='val == 4') Expiry

          .col-12.text-center(v-if='val == 0') {{ startDateDisplay }}
          .col-12.text-center(v-else-if='val == 2') {{ maturityDateDisplay }}
          .col-12.text-center(v-else-if='val == 4') {{ expiryDateDisplay }}
</template>

<style lang="sass" scoped></style>
