<script setup lang="ts">
import { TextFieldTypes } from "@/types/common/index";
import Button from "@/components/common/Button.vue";
import { computed, ref } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  height: {
    type: Number,
    default: 32
  },
  placeholder: {
    type: String,
    default: ""
  },
  options: {
    type: Array<TextFieldTypes.TextFieldOption>,
    default: []
  },
  isValueResettable: {
    type: Boolean,
    default: false
  },
  resetBtnName: {
    type: String,
    default: ""
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: "change", value: string): void;
  (e: "blur", value: string): void;
  (e: "input", value: string): void;
  (e: "update:value", value: string): void;
}>();

const searchString = ref("");
const isFocusing = ref(false);

const onChange = (e: Event): void => {
  emit("change", (e?.target as HTMLInputElement).value || "");
};

const onBlur = (e: Event): void => {
  emit("blur", (e?.target as HTMLInputElement).value || "");

  setTimeout(() => {
    isFocusing.value = false;
  }, 150);
};

const onInput = (e: Event): void => {
  emit("input", (e?.target as HTMLInputElement).value || "");
};

const filteredOptions = computed(() => {
  return props.options.filter((o) =>
    o.name?.toLowerCase().includes(searchString.value.toLowerCase())
  );
});

const handleChooseOption = (name: string) => {
  emit("update:value", name);

  searchString.value = name;
};

const handleResetValue = () => {
  emit("update:value", "");

  searchString.value = "";
};
</script>

<template>
  <div class="text-field-wrapper">
    <input
      v-model="searchString"
      type="text"
      class="text-field"
      :placeholder="placeholder"
      :style="[
        `font-size: calc(${height}px / 2)`,
        searchString ? 'border: 1px solid #ff597b' : '',
        `height: ${height}px`
      ]"
      :disabled="isLoading"
      @change="onChange"
      @blur="onBlur"
      @input="onInput"
      @focus="isFocusing = true"
    />

    <Button
      :name="resetBtnName"
      class="reset-btn"
      :height="height"
      v-if="isValueResettable"
      :isLoading="isLoading"
      @click="handleResetValue"
    />

    <div
      class="options"
      :style="`top: calc(${height}px + 4px)`"
      v-if="isFocusing"
    >
      <div
        class="option"
        :style="[`height: ${height}px`, `font-size: calc(${height}px / 2)`]"
        v-for="(option, i) in filteredOptions"
        :key="i + 'option' + option.name"
        @click="handleChooseOption(option.name)"
        v-if="filteredOptions.length > 0"
      >
        {{ option.name }}
      </div>
      <div
        class="empty flex-center"
        :style="[`height: ${height}px`, `font-size: calc(${height}px / 1.5)`]"
        v-else
      >
        No users found !
      </div>
    </div>

    <input type="hidden" :value="value" />
  </div>
</template>

<style lang="scss" scoped>
.text-field-wrapper {
  position: relative;
  width: 100%;
}

.text-field {
  width: 100%;
  height: 100%;
  border: 1px solid $grey;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  color: $secondary;

  &:focus {
    outline: none;
    border: 1px solid $primary !important;
  }

  &:hover {
    border: 1px solid $tertiary;
  }

  &::placeholder {
    color: $secondary;
  }
}

.reset-btn {
  margin-top: 10px;
}

.options {
  position: absolute;
  width: 100%;
  max-height: 200px;
  border-radius: 4px;
  box-shadow: 0 4px 6px 0 rgb(32 33 36 / 28%);
  overflow-y: auto;
  z-index: 1;
}

.option {
  display: flex;
  align-items: center;
  padding: 0 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: $secondary;
  background-color: $white;
  transition: background-color 0.3s;

  &:not(:last-child) {
    border-bottom: 1px solid $grey;
  }

  &:hover {
    cursor: pointer;
    background-color: $grey;
  }
}

.empty {
  color: $secondary;
  background-color: $white;
}
</style>
