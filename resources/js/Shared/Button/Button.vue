<template>
    <button :type="type" :disabled="loading" class="btn btn-primary" :class="justify">
        <div v-if="loading" class="btn-spinner mr-2" />
        <slot/>
    </button>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'submit',
            },
            justify: {
                type: String,
                default: 'flex items-center justify-center',
            },
            loading: Boolean
        }
    }
</script>
