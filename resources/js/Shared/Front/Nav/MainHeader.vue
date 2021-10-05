<template>
	<header
		class="
			text-base
			font-sans
			md:text-xl
			px-4
			md:px-5
			pt-5
			md:py-5
			absolute
			md:relative
			top-0
			left-0
			w-full
			z-30
		"
	>
		<!-- Mobile -->
		<div
			class="flex flex-col justify-start md:hidden"
			:class="{ 'h-full': menuActive }"
		>
			<div class="z-30">
				<button
					class="uppercase text-xl p-0 border-0 z-50 md:z-auto"
					@click="mobileMenu"
				>
					{{ menuActive ? "Close" : "Menu" }}
				</button>

				<inertia-link
					:href="route('front.home')"
					class="h-full py-5 flex flex-auto justify-center"
				>
					<svg
						class="fill-current h-full w-1/2 m-auto"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 57.1 14"
						style="enable-background: new 0 0 57.1 14"
						xml:space="preserve"
					>
						<path
							d="M6.2,2.4C5.7,2.1,5.2,2,4.5,2H0.9V10h2.1V7.3h1.6c0.6,0,1.2-0.1,1.7-0.3c0.5-0.2,0.8-0.5,1-0.9c0.2-0.4,0.4-0.9,0.4-1.4
                        s-0.1-1-0.4-1.4C7,2.9,6.6,2.6,6.2,2.4z M5.2,5.5c-0.2,0.2-0.5,0.3-1,0.3H2.9V3.6h1.2c0.4,0,0.8,0.1,1,0.3C5.4,4,5.5,4.3,5.5,4.7
                        C5.5,5,5.4,5.3,5.2,5.5z M11,8.4h4.3V10H8.9V2h6.2v1.6H11v1.6h3.3v1.5H11V8.4z M22.5,6.3c0.5-0.4,0.8-1,0.8-1.8
                        c0-0.7-0.3-1.3-0.8-1.8C21.9,2.3,21.2,2,20.2,2h-3.8V10h2V7.1h1.2l1.7,2.9h2.3l-2.1-3.2C21.9,6.7,22.2,6.5,22.5,6.3z M18.5,3.6H20
                        c0.4,0,0.7,0.1,0.9,0.2c0.2,0.2,0.3,0.4,0.3,0.8c0,0.4-0.1,0.6-0.3,0.8c-0.2,0.2-0.5,0.2-0.9,0.2h-1.5V3.6z M24.7,2h6.2v1.6h-4.1
                        v1.7h3.3v1.6h-3.3v3h-2.1V2z M41.3,4.8c0.2,0.3,0.3,0.7,0.3,1.2v4h-2V6.4c0-0.4-0.1-0.7-0.2-0.8S39,5.4,38.7,5.4
                        c-0.2,0-0.4,0.1-0.5,0.1C38,5.6,37.9,5.8,37.8,6c-0.1,0.2-0.1,0.5-0.1,0.8V10h-2V6.4c0-0.4-0.1-0.7-0.2-0.8s-0.3-0.2-0.6-0.2
                        c-0.2,0-0.4,0-0.5,0.1C34.1,5.6,34,5.8,33.9,6c-0.1,0.2-0.1,0.5-0.1,0.8V10h-2V4h1.8l0.1,1.2c0.2-0.4,0.5-0.7,0.8-1
                        c0.3-0.2,0.8-0.3,1.2-0.3c0.4,0,0.8,0.1,1.2,0.3c0.3,0.2,0.6,0.5,0.7,0.9c0.1-0.3,0.3-0.5,0.5-0.7c0.2-0.2,0.4-0.3,0.7-0.4
                        c0.3-0.1,0.5-0.1,0.8-0.1c0.4,0,0.8,0.1,1.1,0.2C40.9,4.2,41.2,4.5,41.3,4.8z M47.2,8.4l0.2,1.3c-0.2,0.1-0.5,0.3-0.8,0.3
                        c-0.3,0.1-0.6,0.1-0.9,0.1c-0.5,0-0.9-0.1-1.2-0.2c-0.3-0.1-0.6-0.3-0.8-0.6c-0.2-0.3-0.3-0.7-0.3-1.1V5.4h-1V4h1V2.6l2-0.6V4h1.8
                        v1.5h-1.8v2.4c0,0.3,0.1,0.5,0.2,0.6c0.1,0.1,0.3,0.2,0.6,0.2c0.2,0,0.4,0,0.5-0.1C46.9,8.5,47.1,8.5,47.2,8.4z M53.6,8
                        c0,0.4-0.1,0.7-0.3,1.1s-0.5,0.6-0.9,0.7c-0.4,0.2-0.9,0.3-1.6,0.3c-0.6,0-1.2-0.1-1.7-0.3c-0.5-0.2-0.9-0.5-1.3-0.8l1-1.1
                        c0.2,0.3,0.5,0.5,0.8,0.6c0.3,0.2,0.7,0.3,1.1,0.3c0.2,0,0.5,0,0.6-0.1c0.2-0.1,0.2-0.2,0.2-0.3c0-0.1,0-0.2-0.1-0.3
                        s-0.2-0.1-0.5-0.2l-0.8-0.2c-0.8-0.2-1.3-0.4-1.6-0.7C48.2,6.7,48,6.3,48,5.8c0-0.3,0.1-0.6,0.3-0.9c0.2-0.3,0.5-0.5,0.9-0.7
                        s0.9-0.3,1.6-0.3c0.6,0,1.1,0.1,1.6,0.3c0.5,0.2,0.8,0.4,1.1,0.8l-1,1.1c-0.2-0.2-0.4-0.4-0.7-0.6c-0.3-0.1-0.6-0.2-0.9-0.2
                        c-0.2,0-0.4,0-0.5,0.1c-0.1,0-0.2,0.1-0.3,0.2S50,5.6,50,5.7c0,0.1,0,0.2,0.1,0.3c0.1,0.1,0.3,0.1,0.6,0.2l1.1,0.2
                        c0.6,0.1,1.1,0.3,1.3,0.6C53.4,7.2,53.6,7.6,53.6,8z"
						/>
					</svg>
				</inertia-link>

				<div class="absolute top-0 right-0 flex flex-nowrap">
					<div>
						<button @click="openSearch">
							<svg viewBox="0 0 32 32" class="w-5 m-5">
								<g fill="none" fill-rule="evenodd">
									<g
										transform="translate(-1427 -36)"
										stroke="currentColor"
										stroke-width="2"
									>
										<g transform="translate(1428 37)">
											<circle cx="18" cy="11" r="11"></circle>
											<line
												x1="9"
												x2=".34615"
												y1="20.346"
												y2="29"
												stroke-linecap="square"
											></line>
										</g>
									</g>
								</g>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div
				class="
					menu-modal
					transition
					duration-300
					w-auto
					bg-front-main
					flex flex-col
					text-xl text-center
					fixed
					bottom-0
					right-0
					left-0
					top-0
					pt-32
					sm:pt-24
					md:pt-0
				"
				:class="[
					menuActive
						? 'opacity-100 pointer-events-auto z-20'
						: 'opacity-0 pointer-events-none',
				]"
			>
				<nav class="mt-8">
					<ul class="flex flex-col px-5">
                        <li>
							<inertia-link @click="mobileMenu" :href="route('front.home')"
                                class="
                                    border border-solid border-current
                                    rounded-lg
                                    px-8
                                    py-4
                                    text-center text-base
                                    hover:shadow-lg
                                    transition-shadow
                                    duration-300
                                    w-full block
                                    -mb-px
                                "
								>Home</inertia-link
							>
						</li>
						<li>
							<inertia-link @click="mobileMenu" :href="route('front.announcements.index')"
                                class="
                                    border border-solid border-current
                                    rounded-lg
                                    px-8
                                    py-4
                                    text-center text-base
                                    hover:shadow-lg
                                    transition-shadow
                                    duration-300
                                    w-full block
                                    -mb-px
                                "
								>Announcements</inertia-link
							>
						</li>
						<li>
							<inertia-link @click="mobileMenu" :href="route('front.events.index')"
                                class="
                                    border border-solid border-current
                                    rounded-lg
                                    px-8
                                    py-4
                                    text-center text-base
                                    hover:shadow-lg
                                    transition-shadow
                                    duration-300
                                    w-full block -mb-px
                                "
								>Events</inertia-link
							>
						</li>
						<li>
							<inertia-link @click="mobileMenu" :href="route('front.tags.index')"
                                class="
                                    border border-solid border-current
                                    rounded-lg
                                    px-8
                                    py-4
                                    text-center text-base
                                    hover:shadow-lg
                                    transition-shadow
                                    duration-300
                                    w-full block -mb-px
                                "
								>Categories</inertia-link
							>
						</li>
						<li>
							<inertia-link @click="mobileMenu" :href="route('front.sections.about')"
                                class="
                                    border border-solid border-current
                                    rounded-lg
                                    px-8
                                    py-4
                                    text-center text-base
                                    hover:shadow-lg
                                    transition-shadow
                                    duration-300
                                    w-full block -mb-px
                                "
								>About</inertia-link
							>
						</li>
					</ul>
				</nav>

				<address class="hidden whitespace-pre-line font-serif not-italic mt-auto">
					15 Rue Haute<br />Saint-Erme-Outre-et-Ramecourt, 02820<br />France
					<br />
					<a href="mail:info@perfmts.net">info@perfmts.net</a>
				</address>
			</div>
		</div>

		<!-- TABLET / DESK -->
		<div class="hidden md:grid grid-cols-12 gap-10 h-36">
			<inertia-link
				class="col-start-1 col-end-3 row-start-1 row-end-1"
				:href="route('front.home')"
			>
				<svg
					class="fill-current w-auto h-full max-w-full"
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 51.2 8"
					style="enable-background: new 0 0 51.2 8"
					xml:space="preserve"
				>
					<path
						d="M3,0c0.6,0,1.1,0.1,1.5,0.3c0.4,0.2,0.7,0.5,1,0.9C5.7,1.5,5.8,2,5.8,2.5c0,0.5-0.1,1-0.3,1.3c-0.2,0.4-0.6,0.7-1,0.9
                                C4.1,4.9,3.6,5,3,5H1.3v3H0V0H3z M2.8,3.9c0.6,0,1-0.1,1.3-0.4c0.3-0.2,0.4-0.6,0.4-1c0-0.5-0.1-0.8-0.4-1C3.8,1.2,3.4,1.1,2.8,1.1
                                H1.3v2.8H2.8z M7.5,7.9V0h5.7v1.1H8.8v2.3h3.5v1.1H8.8v2.4h4.6v1.1H7.5z M18.4,0c0.8,0,1.5,0.2,2,0.6c0.5,0.4,0.8,1,0.8,1.7
                                c0,0.7-0.2,1.3-0.8,1.7c-0.5,0.4-1.2,0.6-2,0.6l-0.1,0.1h-1.8v3.2h-1.3V0H18.4z M18.3,3.7c0.5,0,0.9-0.1,1.2-0.3
                                c0.3-0.2,0.4-0.5,0.4-1c0-0.4-0.1-0.8-0.4-1c-0.3-0.2-0.6-0.3-1.2-0.3h-1.9v2.6H18.3z M19,3.9l2.6,4h-1.5l-2.2-3.5L19,3.9z
                                M28.9,1.1h-4.4v2.3H28v1.1h-3.5v3.4h-1.3V0h5.7V1.1z M30,7.9v-6h1.1l0.1,1c0.2-0.4,0.5-0.7,0.8-0.9c0.3-0.2,0.7-0.3,1.1-0.3
                                c0.4,0,0.8,0.1,1.2,0.3c0.4,0.2,0.6,0.5,0.8,0.9c0.1-0.3,0.3-0.5,0.5-0.7c0.2-0.2,0.5-0.3,0.7-0.4c0.3-0.1,0.5-0.1,0.8-0.1
                                c0.4,0,0.7,0.1,1.1,0.2s0.6,0.4,0.8,0.7s0.3,0.7,0.3,1.3v3.9h-1.3V4.2c0-0.5-0.1-0.8-0.3-1.1c-0.2-0.2-0.5-0.3-0.9-0.3
                                c-0.3,0-0.5,0.1-0.8,0.2s-0.4,0.3-0.6,0.6s-0.2,0.6-0.2,1v3.3H34V4.2c0-0.5-0.1-0.8-0.3-1.1c-0.2-0.2-0.5-0.3-0.9-0.3
                                c-0.2,0-0.5,0.1-0.7,0.2c-0.2,0.1-0.4,0.3-0.6,0.6s-0.2,0.6-0.2,1.1v3.2H30z M45.1,1.9v1h-4.5v-1H45.1z M43,0.2v6
                                c0,0.3,0.1,0.5,0.2,0.6C43.4,6.9,43.6,7,43.9,7c0.2,0,0.4,0,0.6-0.1c0.2-0.1,0.3-0.2,0.4-0.3l0.3,0.9c-0.2,0.2-0.4,0.3-0.7,0.4
                                S43.9,8,43.6,8C43.3,8,43,8,42.7,7.9c-0.3-0.1-0.5-0.3-0.7-0.5c-0.2-0.3-0.2-0.6-0.3-1V0.5L43,0.2z M48.6,8C48,8,47.5,7.9,47,7.7
                                s-0.9-0.6-1.2-1l0.9-0.8c0.2,0.3,0.4,0.6,0.8,0.8C47.8,6.9,48.2,7,48.7,7C49,7,49.3,7,49.5,6.8c0.2-0.1,0.3-0.3,0.3-0.5
                                c0-0.2-0.1-0.3-0.1-0.4c-0.1-0.1-0.3-0.2-0.6-0.3l-1.3-0.3c-0.6-0.1-1.1-0.3-1.4-0.6c-0.3-0.3-0.4-0.6-0.4-1.1
                                c0-0.3,0.1-0.6,0.3-0.9c0.2-0.3,0.5-0.5,0.8-0.7c0.4-0.2,0.8-0.3,1.3-0.3c0.6,0,1.1,0.1,1.5,0.3c0.4,0.2,0.7,0.5,1,0.9l-0.9,0.7
                                c-0.2-0.3-0.4-0.6-0.7-0.7c-0.3-0.2-0.6-0.2-0.9-0.2c-0.3,0-0.5,0-0.7,0.1s-0.3,0.2-0.4,0.3c-0.1,0.1-0.1,0.2-0.1,0.4
                                c0,0.2,0.1,0.3,0.2,0.4c0.1,0.1,0.3,0.2,0.6,0.3l1.4,0.3c0.6,0.1,1,0.3,1.2,0.6c0.2,0.3,0.4,0.6,0.4,1s-0.1,0.7-0.3,1
                                c-0.2,0.3-0.5,0.5-0.9,0.7C49.6,8,49.2,8,48.6,8z"
					/>
				</svg>
			</inertia-link>

			<nav class="col-start-4 col-end-8 row-start-1 row-end-1 relative">
				<ul
					class="
						menu
						flex flex-col flex-wrap
						items-start
						justify-center
						absolute
						top-0
						left-0
						h-full
					"
				>
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
					col-start-8 col-end-12
					row-start-1 row-end-1
                    max-w-sm
					flex flex-col
					justify-center
					items-start
					text-base
				"
			>
				<h2 class="text-xl uppercase mb-2 flex items-center">
					<span>Newsletter</span>
					<span class="text-base font-bold" v-if="subscribeMessage"
						>&nbsp;-&nbsp;{{ subscribeMessage }}</span
					>
					<span
						class="text-xs font-normal normal-case text-red-500"
						v-if="errors.email"
						>&nbsp;-&nbsp;{{ errors.email }}</span
					>
				</h2>
				<div class="flex flex-row items-start flex-nowrap w-full">
					<form
						id="newsletter"
						@submit.prevent="handleSubscribeSubmit"
						method="post"
						class="w-full flex-auto"
					>
						<div
							v-if="honeypot.enabled"
							:name="honeypot.nameFieldName"
							style="display: none"
						>
							<input
								type="text"
								v-model="newsletter_form[honeypot.nameFieldName]"
								:name="honeypot.nameFieldName"
								:id="honeypot.nameFieldName"
							/>
							<input
								type="text"
								v-model="newsletter_form[honeypot.validFromFieldName]"
								:name="honeypot.validFromFieldName"
							/>
						</div>
						<input
							tabindex="12"
							placeholder="Stay tuned for future announcements"
							aria-invalid="false"
							type="email"
							required
							v-model="newsletter_form.email"
							class="w-full border-b-2 border-current bg-transparent mb-2"
						/>
					</form>
					<button
						form="newsletter"
						class="block flex-auto"
						type="submit"
						aria-label="submit"
					>
						<svg viewBox="0 0 20 16" class="h-5 w-5">
							<g fill-rule="evenodd">
								<g transform="translate(-1392 -36)" fill-rule="nonzero">
									<g transform="translate(1390 32)">
										<path
											d="m20 4h-16c-1.1 0-1.99 0.9-1.99 2l-0.01 12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"
										></path>
									</g>
								</g>
							</g>
						</svg>
					</button>
				</div>
			</div>

			<div
				class="
					col-start-11 col-end-13
					row-start-1 row-end-1
					flex
					justify-end
					h-auto
				"
			>
				<div>
					<button @click="openSearch">
						<svg viewBox="0 0 32 32" class="w-7">
							<g fill="none" fill-rule="evenodd">
								<g
									transform="translate(-1427 -36)"
									stroke="currentColor"
									stroke-width="2"
								>
									<g transform="translate(1428 37)">
										<circle cx="18" cy="11" r="11"></circle>
										<line
											x1="9"
											x2=".34615"
											y1="20.346"
											y2="29"
											stroke-linecap="square"
										></line>
									</g>
								</g>
							</g>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>

	<search-modal :show="searchActive" @close="searchActive = false" />
</template>

<script>
import SearchModal from "@/Shared/Front/SearchModal";

export default {
	components: {
		SearchModal,
	},
	props: {
		honeypot: Object,
		errors: [Object, String],
	},

	data() {
		return {
			menuActive: false,
			searchActive: false,
			newsletter_form: this.$inertia.form({
				[this.honeypot.nameFieldName]: "",
				[this.honeypot.validFromFieldName]: this.honeypot.encryptedValidFrom,
				email: "",
			}),
			subscribeMessage: null,
		};
	},
	mounted() {
		//
	},
	methods: {
		mobileMenu() {
			this.menuActive = !this.menuActive;
			this.menuActive
				? document.documentElement.classList.add("overflow-hidden")
				: document.documentElement.classList.remove("overflow-hidden");
		},
		openSearch() {
			this.searchActive = !this.searchActive;
		},
		handleSubscribeSubmit() {
			this.$inertia.post(
				this.route("front.newsletter.subscribe"),
				this.newsletter_form,
				{
					onSuccess: () => {
						if (this.$page.props.flash.success) {
							this.subscribeMessage = this.$page.props.flash.success;
							this.newsletter_form.reset("email");
						} else if (this.$page.props.flash.error) {
							console.log(this.$page.props.flash.error);
						}
					},
				}
			);
			setTimeout(() => (this.subscribeMessage = null), 6000);
		},
	},
};
</script>
