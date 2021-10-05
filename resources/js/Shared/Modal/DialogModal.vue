<template>
    <modal :show="show" :max-width="maxWidth" :closeable="closeable" @close="close">
        
            <div class="relative h-full overflow-scroll">
                <div class="sticky bg-main h-14 top-0 py-4 px-6 text-lg w-full z-30">
                    <slot name="title"></slot>
                </div>
                <div class="bg-box">
                    <div class="py-4 px-6">
                        <slot name="content"></slot>
                    </div>
                </div>
                <div class="fixed bg-main bottom-0 h-10 w-full px-6 py-4 text-right">
                    <slot name="footer"></slot>
                </div>
            </div>
            
            <!-- <div class="relative">
                
            </div> -->
    </modal>
</template>

<script>
    import Modal from './Modal'

    export default {
        components: {
            Modal,
        },

        props: {
            show: {
                default: false
            },
            maxWidth: {
                default: '2xl'
            },
            closeable: {
                default: true
            },
        },

        methods: {
            close() {
                this.$emit('close')
            },
        }
    }
</script>
