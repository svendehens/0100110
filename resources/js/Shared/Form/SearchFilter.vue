<template>
	<div class="flex items-center w-full h-10 max-w-md mr-4">
		<div class="flex w-full h-full bg-box shadow rounded">
			<dropdown
				v-if="filter"
				class="w-14 sm:w-28 cursor-pointer rounded-l border-r hover:bg-main transition duration-100 focus:border-white focus:shadow-outline focus:z-10"
				align="left"
			>
				<template #trigger>
					<button class="flex items-center">
						<div class="flex items-baseline px-4 md:px-6">
							<span class="text-nav hidden md:inline">Filter</span>
							<svg
								class="w-2 h-2 fill-gray-700 md:ml-2"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 961.243 599.998"
							>
								<path
									d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z"
								/>
							</svg>
						</div>
					</button>
				</template>

				<template #content>
					<slot></slot>
				</template>
			</dropdown>

			<input
				autocomplete="off"
				type="text"
				name="search"
				placeholder="Search…"
				class="relative bg-box w-full px-6 py-3 rounded-r border-t border-b border-r border-transparent focus:outline-none focus:border-gray-200 transition duration-200 ease-in-out"
				:class="{ 'border-l rounded-l': !filter }"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
                ref="input"
			/>
		</div>
		<button
			@click="$emit('reset')"
			type="button"
			class="ml-3 text-sm hover:text-navhover text-inactive transition duration-200 ease-in-out"
		>
			Reset
		</button>
	</div>
</template>

<script>
import Dropdown from "@/Shared/Nav/Dropdown";
import DropdownLink from "@/Shared/Nav/DropdownLink";

export default {
	emits: ["reset", "update:modelValue"],
	components: {
		Dropdown,
		DropdownLink,
	},
	props: {
		modelValue: String,
		filter: {
			type: Boolean,
			default: false,
		},
	},
    methods: {
        reset() {
            this.$emit('reset')
        }
    }
};
</script>
