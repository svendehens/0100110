<template>
	<div>
		<div class="w-full flex flex-col md:flex-row items-center">
			<label
				v-if="label"
				class="block text-gray-500 text-sm select-none w-full md:text-right md:pr-3 md:w-2/12"
				:for="id"
				>{{ label }}</label
			>
			<div class="w-full" :class="{ 'md:w-10/12': label }">
				<div class="s-form-input">
					<input
						:id="id"
						ref="input"
						v-bind="$attrs"
						class="s-input__inner"
						:placeholder="placeholder"
						:class="{ error: error }"
						:type="type"
						:list="list"
						autocomplete="off"
						:value="modelValue"
				        @input="$emit('update:modelValue', $event.target.value)"
					/>
					<datalist v-if="datalist" :id="list">
						<option v-for="option in datalist" :key="option" :value="option" />
					</datalist>
				</div>
			</div>
		</div>
        <div v-if="error" class="flex flex-col md:flex-row items-center">
            <div v-if="label" class="w-full md:text-right md:pr-3 md:w-2/12"></div>
            <div class="form-error w-full" :class="{ 'md:w-10/12': label }">{{ error }}</div>
        </div>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
    emits: ["update:modelValue"],
	props: {
		id: {
			type: String,
			default() {
				// return `text-input-${this._uid}`;
                return `text-input`;
			},
		},
		type: {
			type: String,
			default: "text",
		},
		modelValue: [String, Number],
		label: String,
		error: [Array, String, Boolean],
		placeholder: String,
		"validate-status": String,
		help: String,
		datalist: Array,
		list: String,
		prepend: Boolean,
		append: Boolean,
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		},
		select() {
			this.$refs.input.select();
		},
		setSelectionRange(start, end) {
			this.$refs.input.setSelectionRange(start, end);
		},
	},
};
</script>

<style lang="css">
.s-input__inner:hover {
	border-color: #c0c4cc;
}

.s-input__inner:focus {
	border-color: #409eff;
}
.error {
	border-color: #ff4059 !important;
}
</style>
