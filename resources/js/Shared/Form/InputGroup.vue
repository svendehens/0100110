<template>
  <div>
    <div class="w-full flex flex-col md:flex-row items-center">
      <label v-if="label" class="block text-gray-500 text-sm select-none w-full md:text-right md:pr-3 md:w-2/12" :for="id">{{ label }}</label>
      
      <div class="w-full md:w-10/12">
        <div class="s-form-input">

            <slot name="prepend"></slot>
            
            <input :id="id" ref="input" 
                v-bind="$attrs" 
                class="s-input__inner" 
                :placeholder="placeholder" 
                :class="{ error: error }" 
                :type="type" 
                :value="value"
                :list="list"
                autocomplete="off"
                @input="$emit('input', $event.target.value)"
            >
            <datalist v-if="datalist" :id="list">
                <option v-for="option in datalist" :key="option" :value="option"/>
            </datalist>

          <slot name="append"></slot>

        </div>
        
      </div>
    </div>
    <div v-if="error" class="form-error md:ml-20">{{ error[0] }}</div>

    <!-- <div class="s-form-textarea">
      <textarea :id="id" ref="textarea" 
        v-bind="$attrs" 
        class="s-textarea__inner" 
        :placeholder="placeholder" 
        :class="{ error: error }" 
        :type="type" 
        :value="value" 
        @input="$emit('input', $event.target.value)"
      >
      </textarea>
    </div> -->
    
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default() {
        return `text-input-${this._uid}`
      },
    },
    type: {
      type: String,
      default: 'text',
    },
    value: [String, Number],
    label: String,
    error: Array,
    placeholder: String,
    "validate-status": String,
    help: String,
    datalist: Array,
    list: String
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    select() {
      this.$refs.input.select()
    },
    setSelectionRange(start, end) {
      this.$refs.input.setSelectionRange(start, end)
    },
  },
}
</script>

<style lang="css">

.s-input__inner:hover
{
  border-color: #C0C4CC;
}

.s-input__inner:focus
{
  border-color: #409EFF;
} 
.error{
  border-color: #ff4059!important;
}
</style>