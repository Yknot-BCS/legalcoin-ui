<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { ILightSchema } from 'atomicassets/build/API/Explorer/Objects';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineComponent({
  name: 'DetailsTable',
  props: {
    data: {
      type: Object as PropType<{
        [key: string]: any;
      }>,
      required: true
    },
    schema: {
      type: Object as PropType<ILightSchema>,
      required: true
    }
  },
  components: {},
  setup(props) {
    const columns = [
      {
        name: 'desc',
        required: true,
        label: 'Field',
        align: 'left',
        field: 'name',
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

    const data = computed(() => props.data);
    const schema = computed(() => props.schema);

    let parseRows = (data: { [key: string]: any }) => {
      let rows = [];
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          rows.push({
            name: key,
            value: data[key] as string
          });
        }
      }
      return rows;
    };

    const rows = computed(() => parseRows(data.value));

    // Sort according to original schema order
    let sortingArr = schema.value.format.map((n) => n.name);
    const arrayMap = rows.value.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.name]: currentValue
      }),
      {}
    );
    const sortedRows = sortingArr.map(
      (name) => arrayMap[name as keyof typeof arrayMap]
    );

    return { columns, rows: sortedRows };
  }
});
</script>

<template lang="pug">
.q-pa-md
  q-table.deatails-table(
    :rows='rows',
    row-key='name',
    hide-header,
    hide-bottom,
    :pagination='{ rowsPerPage: 20 }',
    flat,
    bordered
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
