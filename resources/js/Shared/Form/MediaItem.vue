<template>
	<div>
		<div class="relative my-3" :style="{ maxWidth: maxWidth, height: height }">
			<img
				:src="element.full_url"
				alt=""
				ref="media"
				class="object-cover rounded-md list-group-item max-h-full"
				:style="[
					element.type == 'SVG' ? 'width: fit-content' : '',
					{ maxWidth: maxWidth },
				]"
				@load="mediaLoaded"
			/>
			<span
				v-if="element.loading"
				class="
					absolute
					rounded-md
					flex flex-row flex-wrap
					items-center
					justify-center
					space-x-4
					w-full
					h-full
					top-0
					left-0
					text-center text-white
				"
				style="background-color: rgba(0, 0, 0, 0.5)"
				>loading...</span
			>
			<span
				v-if="!element.loading && controls"
				class="
					hover:opacity-100
					absolute
					rounded-md
					flex flex-row flex-wrap
					items-center
					justify-center
					space-x-4
					w-full
					h-full
					top-0
					left-0
					cursor-move
					text-center text-white
					opacity-0
				"
				style="background-color: rgba(0, 0, 0, 0.5); transition: opacity 0.3s"
			>
				<span
					class="inline-block cursor-pointer hover:text-red-200 py-2"
					@click="removeMedia(index, element)"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Remove Item</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						></path>
					</svg>
				</span>
				<span
					class="inline-block cursor-pointer hover:text-red-200 py-2"
					@click="handleDownload(element)"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Download Item</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						></path>
					</svg>
				</span>
				<span
					class="inline-block cursor-pointer hover:text-red-200 py-2"
					@click="handleEdit(index, element)"
					v-if="editeable"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Edit File Info</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</span>
			</span>
		</div>
	</div>
</template>

<script>
import JetDialogModal from "@/Jetstream/DialogModal";
import TextInput from "@/Shared/Form/TextInput";
import PrimaryButton from "@/Shared/Button/Button";
import SecondaryButton from "@/Shared/Button/SecondaryButton";

export default {
	emits: ["removeMedia", "updateOrder", "mediaLoaded"],
	components: {
		JetDialogModal,
		TextInput,
		PrimaryButton,
		SecondaryButton,
	},
	props: {
		element: {
			type: Object,
		},
		index: {
			type: Number,
		},
		maxWidth: {
			type: String,
			default: "17rem",
		},
		height: {
			type: String,
			default: "auto",
		},
		controls: {
			type: Boolean,
			default: true,
		},
		mediaType: {
			type: String,
			default: null,
		},
		editeable: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			//
		};
	},
	methods: {
		handleDownload(item) {
			const link = document.createElement("a");
			link.href = item.full_url;
			link.download = item.name;
			document.body.appendChild(link);
			link.click();
		},
		removeMedia(index, item) {
			let check = confirm("You sure you want to delete this?");
			if (check) {
				this.$emit("removeMedia", {
					index: index,
					item: item,
					mediaType: this.mediaType,
				});
			}
			return false;
		},
        handleEdit(index, element)
        {
            alert(element.full_url)
        }
	},
};
</script>
