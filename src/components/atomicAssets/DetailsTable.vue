<script lang="ts">
import { defineComponent } from 'vue';
/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineComponent({
  name: 'DetailsTable',
  components: {},
  setup() {
    const columns = [
      {
        name: 'desc',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: (row: { name: string }) => row.name,
        format: (val: string) => `${val}`,
        sortable: true
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'value',
        sortable: true,
        style: 'padding-left:30px'
      }
    ];

    const rows = [
      {
        name: 'Issuer',
        value: 'Legal Coin'
      },
      {
        name: 'Case',
        value: 'Volkswagen Gas'
      },
      {
        name: 'Batch #',
        value: '#2'
      },
      {
        name: 'Bond Class',
        value: 'Gold'
      },
      {
        name: 'Yield',
        value: '15%'
      },
      {
        name: 'ID',
        value: '1099531506400'
      },
      {
        name: 'Price',
        value: 'GBP 500'
      },
      {
        name: 'Maturity Date',
        value: '24 April 2024'
      },
      {
        name: 'Days to maturity',
        value: 200
      },
      {
        name: 'Artwork',
        value: 'Only the best'
      }
    ];
    return { columns, rows };
  }
});
</script>

<template lang="pug">
.q-pa-md
  q-table(
    :rows="rows"
    :columns="columns"
    row-key="name"
    hide-header
    hide-bottom
    class="deatails-table"
    :pagination= {rowsPerPage:10}
  )
</template>

<style lang="sass">
.deatails-table
  max-width: 100%
  text-align: left

  thead tr:first-child th:first-child
    background-color: #fff
    width: 70%
    text-align: left !important

  td:first-child
    background-color: #f0f0f0
    width: 30%
</style>
