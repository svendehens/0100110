<template>
	<footer>
		<section-border />
		<div
			class="
				grid
				gap-4
				grid-cols-1
				md:grid-cols-12
				md:text-xl
				font-sans
				border-b
				md:border-b-0
				border-t
				md:border-t-0
				border-dashed border-current
				py-5
				md:py-0
				mt-5
				md:mt-0
			"
		>
			<address
				class="whitespace-pre-line font-serif not-italic md:col-start-1 md:col-end-4"
			>
				15 Rue Haute<br />Saint-Erme-Outre-et-Ramecourt, 02820<br />France
				<br />
				<a href="mail:info@perfmts.net">info@perfmts.net</a>
			</address>
			<nav
				role="navigation"
				class="md:col-start-4 md:col-end-6"
			>
				<ul>
					<li>
						<inertia-link :href="route('front.announcements.index')"
							>Announcements</inertia-link
						>
					</li>
					<li>
						<inertia-link :href="route('front.events.index')"
							>Events</inertia-link
						>
					</li>
					<li>
						<inertia-link :href="route('front.tags.index')"
							>Categories</inertia-link
						>
					</li>
					<li>
						<inertia-link :href="route('front.sections.about')"
							>About</inertia-link
						>
					</li>
				</ul>
			</nav>
			<div
				class="
					md:col-start-6 md:col-end-10
                    max-w-sm
					flex flex-col
					justify-center
					items-start
					text-base
				"
			>
				<h2 class="text-lg md:text-xl font-serif italic flex items-center">
					PERFmts, channel for performance and performing arts
				</h2>
			</div>
            <div
				class="
					md:col-start-10 md:col-end-13
                    max-w-sm
					flex flex-col
					justify-center
					items-start
					text-base
				"
			>
                <h2 class="text-lg md:text-xl font-serif flex items-center">
					<inertia-link
                        :href="route('front.announcementservice.index')"
                        class="hover:underline"
                    >
                        Request announcement &rarr;
                    </inertia-link>
				</h2>
			</div>
		</div>

		<section-border />

		<div class="pt-5 md:pt-0 pb-6">
			<span class="text-xs"
				>© 2021
				<inertia-link :href="route('front.home')" rel="home"
					>PERFmts</inertia-link
				>. Site by Sven Dehens</span
			>
		</div>
	</footer>
</template>

<script>
import SectionBorder from "@/Shared/Front/SectionBorder";

export default {
	components: {
		SectionBorder,
	}
};
</script>

<style>
</style>
