<script>
import { OpenInNew } from 'mdue'

export default {
  name: 'DiscordButton',
  components: { OpenInNew },
  data() {
    return {
      supportedStyles: ['primary', 'secondary', 'success', 'danger', 'link'],
      style: null
    }
  },
  mounted() {
    this.style = Object.keys(this.$attrs).find(attr => this.supportedStyles.includes(attr.toLowerCase())) || 'secondary';
  },
  computed: {
    styleClass: function () {
      return {
        '!bg-blurple': this.style === 'primary',
        '!bg-secondary': this.style === 'secondary',
        '!bg-success': this.style === 'success',
        '!bg-danger': this.style === 'danger',
        '!bg-secondary': this.style === 'link',
        'bg-secondary': true
      }
    }
  }
}
</script>

<template>
  <button v-bind:class="styleClass"
    class="font-bold text-white my-[4px] mr-[8px] px-[16px] py-[2px] rounded-[3px] w-auto h-8">
    <div class="whitespace-nowrap text-ellipsis overflow-hidden flex items-center justify-center text-center">
      <slot></slot>
      <OpenInNew v-if="style === 'link'" class="ml-[8px]"></OpenInNew>
    </div>
  </button>
</template>

<style>
</style>