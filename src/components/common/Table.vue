<script setup lang="ts">
defineProps({
  headers: {
    type: Array<string>,
    default: ""
  },
  datas: {
    type: Array<{ [key: string]: number | string }>
  }
});

const formattedProperty = (property: string) => {
  const formattedProp = property.replace(/\s/g, "");

  return formattedProp.charAt(0).toLowerCase() + formattedProp.slice(1);
};
</script>

<template>
  <table>
    <tr>
      <th v-for="(header, i) in headers" :key="i + 'header' + header">
        {{ header }}
      </th>
    </tr>
    <tr v-for="(data, i) in datas" :key="i + 'data' + data">
      <td v-for="h in headers">
        {{ data[formattedProperty(h)] }}
      </td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

td,
th {
  border: 1px solid $grey;
  padding: 8px;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: $primary;
  color: white;
}
</style>
