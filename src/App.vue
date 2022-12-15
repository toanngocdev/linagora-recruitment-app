<script setup lang="ts">
import TextField from "@/components/common/TextField.vue";
import { onMounted, ref, watch } from "vue";
import { debounce } from "./helpers/helpers";
import { ProductServices, UserServices } from "./services";
import { TextFieldTypes } from "./types/common";
import Table from "@/components/common/Table.vue";
import { UserTypes } from "./types";

onMounted(async () => {
  await fetchUsers();
});

const inputOptions = ref<TextFieldTypes.TextFieldOption[]>([]);
const selectedUser = ref<string>("");
const headers = ref<string[]>([
  "Id",
  "Name",
  "Price",
  "Size",
  "Total Purchased"
]);
const datas = ref<{ [key: string]: number | string }[]>([]);
const isLoading = ref<boolean>(false);

const fetchUsers = async (): Promise<UserTypes.User[]> => {
  isLoading.value = true;
  const users = await UserServices.getUsers();
  isLoading.value = false;

  if (users) {
    const mappedData = users.map((u) => {
      return {
        name: u.username,
        value: u.email
      };
    });

    inputOptions.value = mappedData;

    return users;
  }

  return [];
};

watch(selectedUser, () => {
  if (selectedUser.value) {
    debounce(async () => {
      isLoading.value = true;
      const topFiveProducts = await ProductServices.getTopFiveProducts(
        selectedUser.value
      );
      isLoading.value = false;

      datas.value = topFiveProducts
        .map((p) => {
          return {
            id: p.productId,
            name: p.product?.face || "",
            price: p.product?.price || 0,
            size: p.product?.size || 0,
            totalPurchased: p.totalPurchases
          };
        })
        .slice(0, 5);
    });
  }
});
</script>

<template>
  <div class="header">
    <h2 class="title">Daw Purchases Master</h2>
  </div>

  <div class="body flex-center">
    <div class="search-input">
      <TextField
        v-model:value="selectedUser"
        :options="inputOptions"
        placeholder="Search for some users..."
        :isValueResettable="true"
        resetBtnName="Reset value"
        :isLoading="isLoading"
      />
    </div>

    <div v-if="selectedUser">
      <div class="top-purchases">
        User <span class="selected-user">{{ selectedUser }}</span> top 5
        purchases:
      </div>

      <div>
        <Table :headers="headers" :datas="datas" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: $primary;
}

.title {
  color: $white;
}

.body {
  flex-direction: column;
}

.search-input {
  width: 500px;
  margin: 10px 0;
}

.top-purchases {
  margin-bottom: 10px;
}

.selected-user {
  color: $primary;
  font-weight: 700;
}
</style>
