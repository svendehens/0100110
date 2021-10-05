<template>
	<form
		@submit.prevent="handleSubmit"
		class="h-full pt-20 md:pt-24 max-w-7xl flex flex-col flex-no-wrap space-y-4 mx-auto sm:px-6 lg:px-6"
	>
		<div
			class="flex flex-col md:flex-row space-y-4 lg:space-y-0 flex-wrap lg:space-x-4 items-start"
		>
			<div
				class="w-full md:w-auto md:flex-1 bg-box shadow-md sm:rounded-lg p-2 md:p-4"
			>
				<div class="pb-12 flex flex-col space-y-5">
					<h1 class="font-bold text-xl" v-if="form.id">
						<span class="text-xl">Edit </span
						><span class="capitalize">'{{ form.name }}'</span>
					</h1>
					<div class="flex flex-col md:flex-row items-start w-full">
						<div class="flex flex-col w-full md:w-10/12">
							<tiny-editor v-model="form.content" height="600" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			class="sticky bottom-0 bg-box shadow-md sm:rounded-lg z-30 py-5 px-3 md:px-6 flex justify-start items-center max-w-full"
			style="margin-bottom: 1rem"
		>
			<primary-button
				class="w-1/3 md:ml-1/12"
				:loading="sending"
				:class="{ 'opacity-25': sending }"
			>
				{{ propData.id ? 'Update' : 'Save' }}
			</primary-button>
		</div>
	</form>
</template>

<script>
import AppLayout from "@/Layouts/AppLayout";
import TextInput from "@/Shared/Form/TextInput";
import TinyEditor from "@/Shared/Form/TinyEditor";
import PrimaryButton from "@/Shared/Button/Button";

export default {
	layout: AppLayout,
	emits: ["formSubmit"],
	components: {
		TextInput,
		TinyEditor,
        PrimaryButton,
	},
	props: {
		errors: [Object, String],
		propData: Object,
		sending: Boolean,
	},
	data() {
		return {
			form: {},
		};
	},
	beforeMount() {
		this.form = this.propData;
	},
	methods: {
		handleSubmit() {
			this.$emit("formSubmit", this.form);
		},
	},
};
</script>
