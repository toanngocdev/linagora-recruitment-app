/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TextField from "@/components/common/TextField.vue";
import Button from "@/components/common/Button.vue";

describe("TextField Component Tests", () => {
  it("should text field reset value", async () => {
    const wrapper = mount(TextField, {
      propsData: {
        height: 32,
        isValueResettable: true
      }
    });

    const input = wrapper.find("input");
    const button = wrapper.findComponent(Button);
    const inputValue = (input.element as HTMLInputElement).value;

    await input.setValue("some value");
    await button.trigger("click");

    expect(inputValue).toBe("");
  });

  it("should text field emit events", async () => {
    const wrapper = mount(TextField);
    wrapper.vm.$emit("change", "change emit data");
    wrapper.vm.$emit("blur", "blur emit data");
    wrapper.vm.$emit("input", "input emit data");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.emitted().blur).toBeTruthy();
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("should button emit events", async () => {
    const wrapper = mount(Button);
    wrapper.vm.$emit("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().click).toBeTruthy();
  });

  it("should button loading", () => {
    const wrapper = mount(Button, {
      propsData: {
        isLoading: true
      }
    });
    const loadingSpan = wrapper.find("#unit-test");

    expect(loadingSpan.text()).toBe("Loading...");
  });
});
