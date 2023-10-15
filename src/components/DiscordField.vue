<script lang="ts">
interface IData {
  style: string[];
  supportedStyles: string[];
}

export default {
  name: "DiscordField",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    const data: IData = {
      supportedStyles: ["codeblock", "inline"],
      style: [],
    };

    return data;
  },
  mounted() {
    this.style =
      Object.keys(this.$attrs).filter((attr) =>
        this.supportedStyles.includes(attr.toLowerCase()),
      ) ?? [];
  },
  computed: {
    valueClass: function () {
      return {
        "bg-tertiary rounded-[4px] mt-[6px]": this.style.includes("codeblock"),
      };
    },
    fieldClass: function () {
      return {
        "!w-[49%]": this.style.includes("inline"),
      };
    },
  },
};
</script>

<template>
  <div class="mt-2 w-full" v-bind:class="fieldClass">
    <strong>{{ name }}</strong>
    <div class="p-1" v-bind:class="valueClass">
      <slot></slot>
    </div>
  </div>
</template>
