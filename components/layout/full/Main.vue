<template>
	<!------Header-------->
	<v-app-bar elevation="0" height="70" color="#ADBBDA">
		<div class="d-flex align-center justify-space-between w-100">
			<div>
				<!-- <v-btn class="ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
					<Menu2Icon size="20" stroke-width="1.5" />
				</v-btn> -->
			</div>
			<div>
        <!-- Notification -->
				<!-- <LayoutFullVerticalHeaderNotificationDD /> -->
				<!-- User Profile -->
				<!-- <LayoutFullVerticalHeaderProfileDD /> -->
			</div>
		</div>
	</v-app-bar>
	<!------Footer-------->
	<v-footer :app="true" :absolute="true" color="#ADBBDA">
		<LayoutFullFooter/>
	</v-footer>
</template>

<script setup>
// Data
const sDrawer = ref(true)
</script>