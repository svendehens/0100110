<template>
	<div>
		<form-model
			:propData="project"
			@formSubmit="handleFormSubmit"
			:sending="sending"
			:errors="errors"
		></form-model>
	</div>
</template>

<script>
import AppLayout from "@/Layouts/AppLayout";
import FormModel from "./FormModel";
import { ElMessage } from "element-plus";

export default {
	layout: AppLayout,

	components: {
		FormModel,
		ElMessage,
	},

	props: {
		project: Object,
		errors: [Object, String],
	},

	data() {
		return {
			sending: false,
		};
	},
	methods: {
		handleFormSubmit(data) {
			this.$inertia.put(
				this.route("admin.project.update", this.project.id),
				data,
				{
					onStart: () => (this.sending = true),
					onFinish: () => (this.sending = false),
					onSuccess: () => {
						if (Object.keys(this.$page.props.errors).length === 0) {
							ElMessage({
								message: "Post updated successfully.",
								type: "success",
							});
						}
					},
				}
			);
		},
	},
};
</script>
