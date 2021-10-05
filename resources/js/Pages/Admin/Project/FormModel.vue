<template>
	<form
		@submit.prevent="handleSubmit"
		class="
			h-full
			pt-20
			md:pt-24
			max-w-7xl
			flex flex-col flex-no-wrap
			space-y-4
			mx-auto
			sm:px-6
			lg:px-6
		"
	>
		<div
			class="
				flex flex-col
				md:flex-row
				space-y-4
				lg:space-y-0
				flex-wrap
				lg:space-x-4
				items-start
			"
		>
			<div
				class="
					w-full
					md:w-auto
					md:flex-1
					bg-box
					shadow-md
					sm:rounded-lg
					p-2
					md:p-4
				"
			>
				<div class="pb-12 flex flex-col space-y-5">
					<h1 class="font-bold text-xl" v-if="form.id">
						<span class="text-xl">Edit </span><span>'{{ form.name }}'</span>
					</h1>
					<h1 class="font-bold text-xl" v-else>
						<span class="text-xl">New Post</span>
					</h1>

					<text-input
						v-model="form.name"
						:error="errors.name"
						class="w-full"
						placeholder="Title"
						label="Title"
						id="form-title"
					/>
					<div class="flex flex-col md:flex-row items-start w-full">
						<label
							class="
								block
								text-gray-500 text-sm
								select-none
								w-full
								md:text-right
								md:pr-3
								md:w-2/12
							"
							>Content</label
						>
						<div class="flex flex-col w-full md:w-10/12">
							<tiny-editor v-model="form.content" height="600" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex-none w-full lg:w-96 flex flex-col space-y-4">
				<div class="max-h-96 bg-box shadow-md sm:rounded-lg p-2 md:p-4">
					<div class="py-4 flex flex-col space-y-4">
						<text-input
							v-model="form.author"
							class="w-full"
							label="Author"
							placeholder="Author"
							id="form-author"
						/>
					</div>
				</div>
			</div>
		</div>

		<div
			class="
				sticky
				bottom-0
				bg-box
				shadow-md
				sm:rounded-lg
				z-30
				py-5
				px-3
				md:px-6
				flex
				justify-start
				items-center
				max-w-full
			"
			style="margin-bottom: 1rem"
		>
			<primary-button
				class="w-1/3 md:ml-1/12"
				:loading="sending"
				:class="{ 'opacity-25': sending }"
			>
				{{ propData.id ? "Update" : "Save" }}
			</primary-button>

			<div
				class="
					pl-6
					transition-color
					duration-200
					ease-in-out
					text-red-500
					hover:text-red-700
				"
				v-if="propData.id"
			>
				<el-popover placement="right" v-model:visible="visible">
					<div>
						<p style="word-break: break-word">
							Are you sure you want to delete this?
						</p>
						<div
							style="text-align: right; margin: 0"
							class="text-right m-0 pt-4"
						>
							<span @click="visible = false" class="cursor-pointer mr-3"
								>No</span
							>
							<danger-button class="btn-sm" @click="destroy()"
								>Yes</danger-button
							>
						</div>
					</div>
					<template #reference>
						<span
							@click="visible = true"
							class="ml-3 text-red-400 cursor-pointer"
							>Delete item</span
						>
					</template>
				</el-popover>
			</div>

			<div class="ml-auto">
				<el-switch
					v-model="form.status"
					active-text="Publish"
					active-color="#13ce66"
					inactive-text="Draft"
					inactive-color="#ff4949"
				>
				</el-switch>
			</div>
		</div>
	</form>
</template>

<script>
import AppLayout from "@/Layouts/AppLayout";
import TextInput from "@/Shared/Form/TextInput";
import TinyEditor from "@/Shared/Form/TinyEditor";
import PrimaryButton from "@/Shared/Button/Button";
import SecondaryButton from "@/Shared/Button/SecondaryButton";
import DangerButton from "@/Shared/Button/DangerButton";

export default {
	layout: AppLayout,
	emits: ["formSubmit"],
	components: {
		TextInput,
		TinyEditor,
		PrimaryButton,
		SecondaryButton,
		DangerButton,
	},
	props: {
		errors: [Object, String],
		propData: Object,
		sending: Boolean,
	},
	data() {
		return {
			visible: false,
			dragging: false,
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
