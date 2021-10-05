<template>
	<box-layout>
		<template #header>
			<search-filter
				:filter="false"
				v-model="form.search"
				class="w-full max-w-sm mr-4"
				@reset="reset"
			>
			</search-filter>
		</template>

		<div class="w-full flex flex-col">
			<div
				class="w-full flex flex-row px-2 md:px-4 py-2 md:py-4 text-left font-bold text-default transition duration-100"
				:class="form.search ? 'bg-purple-200' : 'bg-main'"
			>
				<div class="w-4/12">
                    Name
				</div>
				<div class="w-7/12 truncate">Info</div>
			</div>
			<div
				v-for="(section, index) in sections"
				:key="index"
				class="w-full flex flex-row items-center px-2 md:px-4 py-2 md:py-4 text-default"
			>
				<div
					class="w-4/12 truncate"
				>
						<Link
							class="text-default truncate capitalize font-bold sm:font-normal sm:hover:text-blue-500 transition-colors duration-150 ease-out"
							:href="route('admin.section.edit', section.id)"
							>{{ section.name }}</Link
						>
				</div>
				<div class="w-7/12 truncate">
                    {{ section.info }}
				</div>
			</div>
		</div>
	</box-layout>
</template>

<script>
import AppLayout from "@/Layouts/AppLayout";
import BoxLayout from "@/Layouts/BoxLayout";
import SecondaryButton from "@/Shared/Button/SecondaryButton";
import Pagination from "@/Shared/Layout/Pagination";
import SearchFilter from "@/Shared/Form/SearchFilter";
import { throttle } from "@/Shared/Function/throttle";
import { mapValues } from "@/Shared/Function/mapValues";

export default {
	components: {
		Pagination,
		SearchFilter,
		SecondaryButton,
		BoxLayout,
	},
	layout: AppLayout,
	props: {
		sections: Object,
		filters: Object,
	},

	data() {
		return {
			form: {
				search: this.filters.search,
				page: null,
			},
		};
	},
	watch: {
		form: {
			handler: throttle(function () {
				const pickBys = (object, predicate = (v) => v) =>
					Object.fromEntries(
						Object.entries(object).filter(([, v]) => predicate(v))
					);
				let query = pickBys(this.form);
				this.$inertia.get(
					this.route(
						"admin.section.index",
						Object.keys(query).length ? query : { remember: "forget" }
					),
					{},
					{ preserveState: true }
				);
			}, 150),
			deep: true,
		},
	},
	methods: {
		reset() {
			this.form = mapValues(this.form, () => null);
		},
	},
};
</script>

<style>
</style>
