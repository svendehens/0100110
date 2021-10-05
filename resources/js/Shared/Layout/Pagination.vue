<template>
	<div class="ml-3 sm:ml-0 flex flex-wrap items-center">
		<template v-for="(link, key) in links" :key="key">
			<div
				v-if="link.url === null"
				class="mr-2 mb-1 px-2.5 py-1 text-sm border dark:border-cool-gray-400 bg-box rounded text-gray-400"
				:class="{
					'mr-auto': link.label === 'Next',
					hidden: !(link.label === 'previous' || link.label === 'next'),
				}"
			>
				{{ link.label }}
			</div>
			<Link
				v-else
				class="transition-colors duration-200 ease-in-out mr-2 mb-1 px-2.5 py-1 text-sm bg-box text-primary rounded border dark:border-cool-blue-400 hover:border-blue-500 hover:text-blue-500"
				:class="{
					'border-blue-400 text-blue-400': link.active,
					'mr-auto': link.label === 'Next',
					hidden: !(link.label === 'previous' || link.label === 'next'),
				}"
				:href="link.url"
				>{{ link.label }}</Link
			>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		links: Array,
	},
};
</script>
