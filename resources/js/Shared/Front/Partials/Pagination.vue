<template>
	<div class="ml-3 sm:ml-0 flex flex-wrap items-center text-lg">
		<template v-for="(link, key) in links" :key="key">
			<div
				v-if="link.url === null"
				class="mr-2 mb-1 px-2.5 py-1 text-gray-500"
				:class="{
					'mr-auto': link.label === 'Next',

				}"
			>
				{{ link.label }}
			</div>
			<Link
				v-else
				class="transition-colors duration-200 ease-in-out mr-2 mb-1 px-2.5 py-1 hover:underline"
				:class="{
					'border-blue-400 text-blue-400 underline': link.active,
					'mr-auto': link.label === 'Next',
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
	}
};
</script>
