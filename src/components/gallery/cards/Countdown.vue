<script lang="ts">
import { ref, defineComponent } from 'vue';

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
.row.q-col-gutter-x-sm
  .col-12.column(v-if='days > 0') {{ days }} days left
  .col-12.column(v-else-if='hours > 0 && days <= 0') {{ hours }} hours left
  .col-12.column(v-else-if='minutes > 0 && hours <= 0 && days <= 0') {{ minutes }} minutes left
  .col-12.column(v-else) Expired
</template>

<style lang="sass"></style>
