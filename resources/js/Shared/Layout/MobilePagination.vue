<template>
  <div class="mt-6 -mb-1 flex flex-wrap">
    <template v-for="(link, key) in links">
      <div v-if="link.url === null" :key="key" class="mr-1 mb-1 px-3 py-1 text-sm border rounded-b-md text-gray-300" :class="{ 'mr-auto': link.label === 'Next' }">{{ link.label }}</div>
      <Link v-else :key="key" class="mr-1 mb-1 px-3 py-1 text-sm border rounded-b-md hover:bg-white focus:border-indigo-500 focus:text-indigo-500" :class="{ 'bg-white': link.active, 'mr-auto': link.label === 'Next' }" :href="link.url">{{ link.label }}</Link>
   </template>
  </div>
</template>

<script>
export default {
  props: {
    links: Array,
  },
}
</script>
