<template>
	<div class="h-screen">
		<div class="h-full pt-20 md:pt-24 max-w-7xl mx-auto sm:px-6 lg:px-6">
			<div class="h-full">
				<div
					class="h-11/12 overflow-scroll bg-box shadow-md sm:rounded-lg px-2 pb-2 md:px-4 md:pb-4 relative"
				>
					<div
						class="sticky top-0 sm:p-4 flex items-center h-20 bg-box text-default w-full"
						style="z-index: 1"
					>
						<slot name="header"></slot>
					</div>
					<slot></slot>
				</div>
				<div class="h-1/12 ml-3 sm:ml-0 flex flex-wrap items-center">
					<slot name="bottom"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
}
</script>
