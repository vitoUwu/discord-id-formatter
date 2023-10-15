<script lang="ts">
import { Download } from 'lucide-vue-next'

export default {
  name: "DiscordButton",
  components: { Download },
  data() {
    return {
      supportedStyles: ["primary", "secondary", "success", "danger", "link"],
      style: "",
    };
  },
  mounted() {
    this.style =
      Object.keys(this.$attrs).find((attr) =>
        this.supportedStyles.includes(attr.toLowerCase()),
      ) ?? "secondary";
  },
  computed: {
    styleClass: function () {
      switch (this.style) {
        case "primary":
          return "bg-blurple hover:bg-blurple-hover disabled:bg-blurple-disabled";
        case "success":
          return "bg-success hover:bg-success-hover disabled:bg-success-disabled";
        case "danger":
          return "bg-danger hover:bg-danger-hover disabled:bg-danger-disabled";
        default:
          return "bg-secondary hover:bg-secondary-hover disabled:bg-secondary-disabled";
      }
    },
  },
};
</script>

<template>
  <button
    v-bind:class="styleClass"
    class="pop font-bold text-white flex items-center justify-center gap-2 px-4 py-[2px] rounded h-8 disabled:text-opacity-50 disabled:cursor-not-allowed"
  >
    <!-- <div
      class="flex items-center justify-center gap-8 overflow-hidden text-center whitespace-nowrap text-ellipsis"
    > -->
      <slot></slot>
      <template v-if="style==='link'">
        <Download :size="18" />
      </template>
    <!-- </div> -->
  </button>
</template>
