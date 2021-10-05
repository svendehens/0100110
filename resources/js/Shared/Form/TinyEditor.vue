<template>
  <editor
    v-model="content"
    v-on:onChange="this.update"
    api-key="kp16jdsoidh30xk5dbu7f335zfyci8nt73gvc1qp7p2gqwmt"
    :init="{
        height: height,
        menubar: menubar,
        skin: handleSkin(),
        content_css: handleContentCss(),
        paste_as_text: true,
        relative_urls : false,
        default_link_target: '_blank',
        content_style: 'body { font-family: Arial; -webkit-font-smoothing: antialiased;letter-spacing: 0.025em; }',
        plugins: [
            'link',
            'code',
            'table paste'
        ],
        toolbar:
            'undo redo | formatselect | bold italic forecolor backcolor | \
            alignleft aligncenter alignright alignjustify | \
            outdent indent | removeformat'
    }"
  />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
    emits: ["input"],
    props: {
        height: {
            type: [Number, String],
            default: 700
        },
        menubar: {
            default: true
        }
    },
    components: {
        Editor
    },
    data() {
        return {
                content: this.$attrs.value
            }
    },
    methods: {
        handleSkin(){
            return document.documentElement.classList.contains('theme-dark') ? 'oxide-dark' : 'oxide';
        },
        handleContentCss(){
            return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'default';
        },
        update() {
            this.$emit('input', this.content);
        }
    }
}
</script>
