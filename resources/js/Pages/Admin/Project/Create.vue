<template>
  <div>
    <form-model
      :propData="form"
      @formSubmit="handleFormSubmit"
      :sending="sending"
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
    errors: [Object, String],
  },
  data() {
    return {
      sending: false,
      form: {
        name: null,
        content: null,
        author: null,
        status: true,
      },
    };
  },
  methods: {
    handleFormSubmit(data) {
      this.$inertia.post(this.route("admin.project.store"), data, {
        onStart: () => (this.sending = true),
        onFinish: () => (this.sending = false),
        onSuccess: () => {
          if (Object.keys(this.$page.props.errors).length === 0) {
            ElMessage({
                message: 'Post created successfully.',
                type: 'success',
            })
          }
        },
      });
    },
  },
};
</script>
