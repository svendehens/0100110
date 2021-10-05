<template>
	<div class="bg-main">
		<nav class="bg-nav border-b border-gray-200 h-16 z-10 fixed w-full">
			<main-nav />
		</nav>

		<main class="font-sans">
			<slot></slot>
		</main>

		<!-- Modal Portal -->
		<!-- <portal-target name="modal" multiple> </portal-target> -->
	</div>
</template>

<script>
import MainNav from "@/Shared/Nav/MainNav";
import themeSwitch from "@/Shared/Function/themeSwitch";

export default {
	components: {
		MainNav,
	},
	mounted() {
		themeSwitch();
	},
};
</script>
