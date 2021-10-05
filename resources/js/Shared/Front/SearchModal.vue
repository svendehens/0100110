<template>
	<modal
		:show="show"
		:max-width="maxWidth"
		:closeable="closeable"
		@close="close"
	>
		<div class="px-6 py-4 text-2xl font-sans antialiased">
			<div>
				<div class="flex flex-row flex-nowrap absolute top-5 right-5 uppercase">
					<div class="ml-auto cursor-pointer" @click="$emit('close')">
						close
					</div>
				</div>
			</div>

			<div class="mt-4">
				<div class="uppercase">
					<input
						v-model="search_form.search"
						type="text"
						placeholder="Search"
						class="w-full border-b-2 border-current bg-transparent text-4xl leading-none md:text-6xl font-serif italic"
					/>
				</div>
			</div>

            <!-- LIST -->
			<div class="py-5 relative" v-if="data">
				<article v-for="(event, index) in data.events" :key="index">
					<div
						class="
							p-5
							border-current
							grid grid-cols-1 md:grid-cols-6
							gap-2
							place-items-center -mb-px
                            text-lg
						"
                        :class="[event.type == 'event' ? 'border border-solid rounded-lg' : 'border-t border-dashed']"
					>
						<div class="h-28">
							<img
								class="max-w-full w-auto h-full object-contain object-left"
								width="300"
								height="300"
								:src="event.media.url"
								loading="lazy"
							/>
						</div>
						<div :class="{ 'text-gray-500 line-through': !event.upcoming }">{{ event.start }}</div>
						<div class="justify-self-center text-center text-xl font-serif">{{ event.name }}</div>
						<div class="justify-self-center text-center">{{ event.organizer_name }}</div>
                        <div class="capitalize">{{ event.type }}</div>
						<div class="w-full flex text-center">
							<inertia-link
								class="
									flex-grow
									border border-solid border-current
									rounded-lg
									px-8
									py-1
									hover:shadow-lg
                                    shadow-none
									transition-shadow
									duration-300
								"
								:href="route('front.events.show', event.slug)"
								@click="$emit('close')"
								>Details</inertia-link
							>
						</div>
					</div>
				</article>
                <article v-if="data.events && data.events.length == 0">
					<div
						class="
							p-5
							rounded-lg
							border-current
							grid grid-cols-1
							gap-2
							place-items-center -mb-px
                            border border-solid
                            h-28 justify-self-center text-center text-xl font-serif
						"
					>
                        <p>No Results</p>
					</div>
				</article>
			</div>
		</div>
	</modal>
</template>

<script>
import Modal from "./FullModal";
import { throttle } from "@/Shared/Function/throttle";

export default {
	emits: ["close"],

	components: {
		Modal,
	},

	props: {
		show: {
			default: false,
		},
		maxWidth: {
			default: "2xl",
		},
		closeable: {
			default: true,
		},
	},
	data() {
		return {
			search_form: this.$inertia.form({
				search: "",
			}),
			data: null
		};
	},
	watch: {
		search_form: {
			handler: throttle(function () {
				const pickBys = (object, predicate = (v) => v) =>
					Object.fromEntries(
						Object.entries(object).filter(([, v]) => predicate(v))
					);
				let query = pickBys(this.search_form);
				if (query.search && query.search.length >= 2) {
					this.search(query);
				} else if (!query.search) {
					this.data = null;
				}
			}, 250),
			deep: true,
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
		async search(query) {
			axios
				.post(this.route("front.api.events.search"), query)
				.then(({ data }) => {
					this.data = data;
				});
		},
	},
};
</script>
