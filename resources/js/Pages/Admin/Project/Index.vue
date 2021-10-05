<template>
	<box-layout>
		<template #header>
			<search-filter
				:filter="false"
				v-model="form.search"
				class="w-full max-w-sm mr-4"
				@reset="reset"
			></search-filter>
			<div class="ml-auto flex items-center">
				<secondary-button class="hidden sm:block">
					<Link :href="route('admin.project.create')">
						<span>New</span>
						<span class="hidden md:inline"> Post</span>
					</Link>
				</secondary-button>
			</div>
		</template>

		<div class="w-full flex flex-col">
			<div
				class="
					w-full
					flex flex-row
					px-2
					md:px-4
					py-2
					md:py-4
					text-left
					font-bold
					text-default
					transition
					duration-100
				"
				:class="
					form.search || form.page ? 'bg-purple-200' : 'bg-main'
				"
			>
				<div class="w-6/12 md:w-7/12 md:space-x-3 flex flex-col md:flex-row">
					<div class="md:w-8/12 truncate md:pl-2">Title</div>
					<div class="md:w-2/12 truncate"></div>
					<div class="hidden sm:block md:w-2/12 truncate"></div>
				</div>
				<div class="w-3/12 text-center"></div>
				<div class="w-3/12 md:w-2/12 text-center">Draft Link</div>
			</div>
			<div
				v-for="(project, index) in projects"
				:key="index"
				class="
					w-full
					flex flex-row
					items-center
					px-2
					md:px-4
					py-2
					md:py-4
					text-default
				"
				:style="project.status ? '' : 'background: var(--color-bg-warning)'"
			>
				<div
					class="
						w-6/12
						md:w-7/12
						md:space-x-3
						flex flex-col
						md:flex-row
						items-start
						md:items-center
					"
				>
					<div class="w-full md:w-8/12 truncate flex items-center">
						<Link
							class="
								text-default
								truncate
								font-bold
								sm:font-normal
								sm:hover:text-blue-500
								transition-colors
								duration-150
								ease-out
							"
							:href="route('admin.project.edit', project.id)"
							>{{ project.name }}</Link
						>
					</div>

					<div class="w-full md:w-2/12 truncate">

                    </div>
					<div class="hidden sm:block md:w-2/12 truncate">

					</div>
				</div>
				<div class="w-3/12 text-center truncate">

				</div>
				<div class="w-3/12 md:w-2/12 text-center capitalize">
                    <a :href="project.draft_link" target="_blank">Link</a>
				</div>
			</div>
		</div>
		<template #bottom>
			<pagination :links="projects.links" />

			<div class="flex flex-row ml-auto pr-4 items-center">
				<div v-if="projects.links && projects.links[1]">
					{{ projects.links[1].from }}-{{ projects.links[1].to }} /
					{{ projects.links[1].total }}
				</div>
			</div>
		</template>
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
		BoxLayout
	},
	layout: AppLayout,
	props: {
		projects: Object,
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
						"admin.project.index",
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
