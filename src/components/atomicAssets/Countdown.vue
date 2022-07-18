<script lang="ts">
import { ref, defineComponent } from 'vue';
import { date } from 'quasar';

export default defineComponent({
  name: 'Countdown',
  components: {},
  props: {
    // Epoch time in seconds
    endDate: {
      type: Date,
      required: true
    }
  },
  setup() {
    return {
      now: ref(Date.now()), //  Current time (seconds)
      diff: ref(0), // Time difference (seconds)
      interval: null // Interval ID
    };
  },
  computed: {
    displayDate() {
      return date.formatDate(this.endDate, 'd MMMM, YYYY [at] h:mma [GMT]Z');
    },
    seconds() {
      return Math.trunc(this.diff) % 60;
    },
    minutes() {
      return Math.trunc(this.diff / 60) % 60;
    },
    hours() {
      return Math.trunc(this.diff / 60 / 60) % 24;
    },
    days() {
      return Math.trunc(this.diff / 60 / 60 / 24);
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = Math.trunc(Date.now() / 1000);
    }, 1000); // Update the current time every second
  },
  watch: {
    now() {
      this.diff = this.endDate.getTime() / 1000 - this.now;
      if (this.diff < 0) {
        this.diff = 0;
        clearInterval(this.interval);
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
});
</script>

<template lang="pug">
.row
  | Auction ends {{ displayDate }}
.row.q-mt-sm.q-gutter-x-sm
  .col-2.column(v-if='days > 0')
    .col.text-bold {{ days }}
    .col Days
  .col-2.column(v-if='hours > 0 || days > 0')
    .col.text-bold {{ hours }}
    .col Hours
  .col-2.column(v-if='minutes > 0 || hours > 0 || days > 0')
    .col.text-bold {{ minutes }}
    .col Minutes
  .col-2.column
    .col.text-bold {{ seconds }}
    .col Seconds
</template>

<style lang="sass"></style>
