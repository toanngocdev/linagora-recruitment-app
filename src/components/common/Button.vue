<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 24
  },
  type: {
    type: String,
    default: "primary" // "primary" or "secondary"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const buttonWidth = computed((): string => {
  if (props.width) return `${props.width}px`;

  return "100%";
});

const onClick = (): void => {
  emit("click");
};
</script>

<template>
  <button
    :class="[
      'button flex-center',
      `button__${type}${disabled ? '--disabled' : ''}`
    ]"
    :style="`width: ${buttonWidth}; height: ${height}px; font-size: calc(${height}px / 2)`"
    @click="onClick"
  >
    <span v-if="isLoading" id="unit-test"> Loading... </span>
    <span v-else>
      {{ name }}
    </span>
  </button>
</template>

<style lang="scss" scoped>
.button {
  border: none;
  border-radius: 4px;
  opacity: 1;
  transition: opacity 0.3s;
  padding: 0 10px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);

  &__primary {
    background-color: $primary;
    color: $white;

    &--disabled {
      background-color: $dark-grey !important;
      pointer-events: none;
      opacity: 0.5;

      &:hover {
        cursor: default !important;
        opacity: 0.5 !important;
      }
    }
  }

  &__secondary {
    background-color: $white;
    color: $primary;
    border: 1px solid $primary;

    &--disabled {
      border: 1px solid $dark-grey !important;
      color: $dark-grey !important;
      opacity: 0.5;

      &:hover {
        cursor: default !important;
        opacity: 0.5 !important;
      }
    }
  }

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}
</style>
