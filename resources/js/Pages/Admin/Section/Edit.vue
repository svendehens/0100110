<template>
  <div>
    <form-model
      :propData="section"
      @formSubmit="handleFormSubmit"
      :sending="sending"
      :alltags="alltags"
      :errors="errors"
    ></form-model>
  </div>
</template>

<script>
import AppLayout from "@/Layouts/AppLayout";
import FormModel from "./FormModel";
import { ElMessage } from 'element-plus'

export default {
  layout: AppLayout,

  components: {
    FormModel,
    ElMessage
  },

  props: {
    section: Object,
    alltags: Array,
    errors: [Object, String],
  },

  data() {
    return {
      sending: false,
    };
  },
  methods: {
    handleFormSubmit(data) {
      this.$inertia.put(this.route("admin.section.update", this.section.id), data, {
        onStart: () => (this.sending = true),
        onFinish: () => (this.sending = false),
        onSuccess: () => {
          if (Object.keys(this.$page.props.errors).length === 0) {
            ElMessage({
                message: 'Section updated successfully.',
                type: 'success',
            })
          }
        },
      });
    },
  },
};
</script>
