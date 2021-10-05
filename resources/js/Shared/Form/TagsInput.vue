<template>
	<el-select
		v-model="value"
		@change="handleChange"
		value-key="name"
		class="w-full"
		:multiple="multiple"
		:clearable="clearable"
		filterable
		:allow-create="allowCreate"
		:default-first-option="defaultFirstOption"
		:placeholder="placeholder"
	>
		<el-option
			v-for="item in options"
			:key="item.name"
			:label="item.name"
			:value="item.name"
		>
		</el-option>
	</el-select>
</template>

<script>
export default {
	emits: ["update:modelValue"],
	// props: ["modelValue"],
	props: {
		modelValue: [String, Array, Object],
		multiple: {
			type: Boolean,
			default: true,
		},
		allowCreate: {
			type: Boolean,
			default: true,
		},
		clearable: {
			type: Boolean,
			default: true,
		},
		placeholder: {
			type: String,
			default: "Choose tags for this.",
		},
		defaultFirstOption: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			tags: this.modelValue,
			options: null,
			value: [],
		};
	},
	beforeMount() {
		this.options = this.$attrs.options;

		if (this.tags && this.tags.length > 0 && this.multiple) {
			this.tags.forEach((tag) => {
                this.value.push(tag.name);
			});
		} else if (this.tags && !this.multiple) {
			this.value = this.tags.name;
		}
	},
	methods: {
		handleChange(val) {
			let resultArr = [];

			if (this.multiple) {
				for (let i = 0; i < val.length; i++) {

					let item = this.options.find((item) => item.name == val[i]);

					if (item) {
						resultArr.push({
							id: item.id,
							name: item.name,
						});
					} else {
						resultArr.push({
							id: null,
							name: val[i],
							type: "newtag",
						});
						this.options.push({
                            id: val[i],
							name: val[i],
							type: "newtag",
						});
					}

				}
			}

			if (!this.multiple) {
				resultArr = this.options.find((ele) => {
					return val === ele.name;
				});
			}

			this.$emit("update:modelValue", resultArr);
		},
	},
};
</script>

<style lang="css">
.el-input__inner {
	background-color: var(--color-bg-box);
	color: var(--color-text-default);
}

.el-select .el-select__tags .el-tag {
	box-sizing: border-box;
	border-color: transparent;
	margin: 2px 0 2px 6px;
	color: #409eff;
	background-color: #ecf5ff;
}

.el-select .el-select__tags .el-tag {
	background-color: #ecf5ff;
	right: -7px;
	top: 0;
	color: #409eff;
}

.el-select .el-select__tags .el-tag .el-icon-close {
	background-color: #ecf5ff;
	right: -7px;
	top: 0;
	color: #409eff;
}

.el-select .el-select__tags .el-tag .el-icon-close:hover {
	background-color: #daecfd;
}
</style>
