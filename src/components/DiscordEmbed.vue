<script>
export default {
  name: 'DiscordEmbed',
  props: {
    title: {
      type: String,
      required: true,
      validator(value) {
        return value.length <= 256
      },
      default() {
        return 'No Title'
      },
    }
  }
}
</script>

<template>
  <div class="pt-2 pr-4 pb-4 pl-3 text-white border-l-blurple border-l-4 bg-embed max-w-[50%] rounded-[4px] h-fit">
    <strong>{{ $props.title }}</strong>
    <div v-if="$slots.content" class="bg-tertiary p-1 rounded-[4px] mt-[6px]">
      <slot name="content"></slot>
    </div>
    <div class="flex flex-wrap justify-between">
      <slot name="fields"></slot>
    </div>
  </div>
</template>