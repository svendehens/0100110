<template>
	<div>
		<!-- Primary Navigation Menu -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:text-gray-200">
			<div class="flex justify-between h-16">
				<div class="flex">
					<!-- Logo -->
					<div
						class="hidden flex-shrink-0 sm:flex items-center cursor-pointer font-bold"
						id="theme-btn"
					>
                        0100110.net
					</div>

					<!-- Navigation Links -->
					<div class="flex sm:ml-8">
						<jet-nav-link
							:href="route('admin.project.index')"
							:active="route().current('admin.project.*') || this.$page.currentRouteName == 'admin.project.index'"
						>
							Posts
						</jet-nav-link>

                        <jet-nav-link
							:href="route('admin.section.index')"
							:active="route().current('admin.section.*') || this.$page.currentRouteName == 'admin.section.index'"
						>
							Sections
						</jet-nav-link>

						<div
							class="hidden sm:flex items-center my-px hover:bg-navhover transition duration-200 ease-in-out"
						>
							<jet-dropdown align="left" width="48">
								<template #trigger>
									<button
										class="inline-flex cursor-pointer hover:text-navhover transition duration-200 ease-in-out h-full w-full items-center px-6 pt-1 border-b-1 border-transparent text-sm font-medium leading-5 text-inactive focus:outline-none"
									>
										<div class="flex items-baseline">
											<span class="text-nav hidden md:inline">More</span>
											<svg
												class="w-2 h-2 fill-gray-700 md:ml-2"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 961.243 599.998"
											>
												<path
													d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z"
												/>
											</svg>
										</div>
									</button>
								</template>

								<template #content>
									<div
										class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer hover:text-white hover:rounded-md hover:bg-primary"
										id="theme-btn"
									>
										Swap Theme
									</div>
								</template>
							</jet-dropdown>
						</div>
					</div>
				</div>

				<!-- Settings Dropdown -->
				<div class="hidden sm:flex sm:items-center sm:ml-6">
					<div class="ml-3 relative">
						<jet-dropdown align="right" width="48">
							<template #trigger>
								<button
									v-if="$page.props.jetstream.managesProfilePhotos"
									class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
								>
									<img
										class="h-8 w-8 rounded-full object-cover"
										:src="$page.props.user.profile_photo_url"
										:alt="$page.props.user.name"
									/>
								</button>

								<button
									v-else
									class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
								>
									<div>{{ $page.props.user.name }}</div>

									<div class="ml-1">
										<svg
											class="fill-current h-4 w-4"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								</button>
							</template>

							<template #content>
								<!-- Account Management -->
								<div class="block px-4 py-2 text-xs text-gray-400">
									Manage Account
								</div>

								<jet-dropdown-link :href="route('profile.show')">
									Profile
								</jet-dropdown-link>

								<div class="border-t border-gray-100"></div>

								<!-- Authentication -->
								<form @submit.prevent="logout">
									<jet-dropdown-link as="button"> Logout </jet-dropdown-link>
								</form>
							</template>
						</jet-dropdown>
					</div>
				</div>

				<!-- Hamburger -->
				<div class="-mr-2 flex items-center sm:hidden">
					<button
						@click="showingNavigationDropdown = !showingNavigationDropdown"
						class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
					>
						<svg
							class="h-6 w-6"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								:class="{
									hidden: showingNavigationDropdown,
									'inline-flex': !showingNavigationDropdown,
								}"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
							<path
								:class="{
									hidden: !showingNavigationDropdown,
									'inline-flex': showingNavigationDropdown,
								}"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Responsive Navigation Menu -->
		<div
			:class="{
				block: showingNavigationDropdown,
				hidden: !showingNavigationDropdown,
			}"
			class="sm:hidden"
		>
			<!-- Responsive Settings Options -->
			<div
				class="bg-nav pt-4 pb-1 border-t border-b shadow-md border-gray-200 mt-3 space-y-1"
			>
				<jet-responsive-nav-link :href="route('admin.section.index')">
					Sections
				</jet-responsive-nav-link>
				<div
					class="block px-4 py-2 text-sm leading-5 text-base font-medium text-gray-700 transition duration-150 ease-in-out cursor-pointer hover:text-white hover:rounded-md hover:bg-primary"
					id="theme-btn"
				>
					Swap Theme
				</div>

				<div class="mt-3 space-y-1">
					<jet-responsive-nav-link
						:href="route('profile.show')"
						:active="route().current('profile.show')"
					>
						Profile
					</jet-responsive-nav-link>

					<!-- Authentication -->
					<form method="POST" @submit.prevent="logout">
						<jet-responsive-nav-link as="button">
							Logout
						</jet-responsive-nav-link>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import JetApplicationMark from "@/Shared/Layout/ApplicationMark";
import JetDropdown from "@/Shared/Nav/Dropdown";
import JetDropdownLink from "@/Shared/Nav/DropdownLink";
import JetNavLink from "@/Shared/Nav/NavLink";
import JetResponsiveNavLink from "@/Shared/Nav/ResponsiveNavLink";

export default {
	components: {
		JetApplicationMark,
		JetDropdown,
		JetDropdownLink,
		JetNavLink,
		JetResponsiveNavLink,
	},

	data() {
		return {
			showingNavigationDropdown: false,
		};
	},

	methods: {
		logout() {
			axios.post(route("logout")).then((response) => {
				window.location = "/";
			});
		},
	},
};
</script>
