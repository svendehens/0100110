<template>
	<div>
		<input
			ref="picker"
			type="file"
			:accept="accept"
			class="hidden"
			:multiple="multiple"
			@change="change"
            :disabled="disabled"
		/>
		<button class="btn" :class="!disabled ? 'btn-primary btn-ghost' : 'cursor-not-allowed'" :disabled="disabled" type="button" @click="browse">
			<slot>Upload</slot>
		</button>
	</div>
</template>

<script>
export default {
	emits: ["uploadMedia"],
	props: {
		accept: {
			type: String,
			default: "image/*",
		},
		multiple: {
			type: Boolean,
			default: false,
		},
        mediaType: {
			type: String,
			default: null,
		},
        disabled: {
            type: Boolean,
            default: false
        },
        index: {
            type: Number,
            default: 0
        }
	},
	methods: {
		browse() {
			this.$refs.picker.click();
		},
		change(e) {
			this.$emit("uploadMedia", {files: e.target.files, mediaType: this.mediaType, index: this.index});
		},
	},
};
</script>
