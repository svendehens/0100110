<template>
    <Link :href="'/'" class="text-xl">
        0100110.net - {{ type && type == 'login' ? 'login' : 'register' }}
    </Link>
</template>

<script>
    import { defineComponent } from 'vue'
    import { Link } from '@inertiajs/inertia-vue3';

    export default defineComponent({
        components: {
            Link,
        },
        props: {
            type: String
        }
    })
</script>
