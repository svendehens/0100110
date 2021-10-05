<template>
    <Link :href="href" :class="classes">
        <slot></slot>
    </Link>
</template>

<script>
    export default {
        props: ['href', 'active'],

        computed: {
            classes() {
                return this.active
                            ? 'inline-flex items-center px-6 -my-px pt-1 border-b-2 border-active text-sm font-medium leading-5 text-active focus:outline-none focus:border-active transition duration-200 ease-in-out'
                            : 'inline-flex items-center px-6 my-px pt-1 border-b-1 border-transparent text-sm font-medium leading-5 text-inactive hover:bg-navhover hover:text-navhover focus:outline-none transition duration-200 ease-in-out'
            }
        }
    }
</script>
