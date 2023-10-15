<script lang="ts">
export default {
  name: "DiscordEmbed",
};
</script>

<template>
  <div
    class="w-full pt-2 pb-4 pl-3 pr-4 text-white border-l-4 rounded border-l-blurple bg-embed h-fit"
  >
    <template v-if="$slots.title">
      <slot name="title" />
    </template>
    <div v-if="$slots.content" class="bg-tertiary p-1 rounded mt-[6px]">
      <slot name="content" />
    </div>
    <div class="flex flex-wrap justify-between">
      <slot name="fields" />
    </div>
  </div>
</template>
