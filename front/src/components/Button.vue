<template>
	<button class="actionBtn" @click="emitAction">
		>
		<slot>{{ buttonText }}</slot>
	</button>
</template>

<script>
export default {
	name: 'ActionButton',
	props: {
		buttonText: String,
		actionType: String
	},
	methods: {
		emitAction() {
			this.$emit('action', this.actionType);
		}
	}
};
</script>

<style scoped>
.actionBtn {
	border: 4px solid black;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10px 20px;
	/* Adjusted padding */
	letter-spacing: 4px;
	background-color: transparent;
	/* Ensure the button is transparent by default */
	color: inherit;
	/* Inherit the text color */
	transition: background-color 0.3s, color 0.3s;
	/* Smooth transition for hover effect */
}

.actionBtn:hover {
	background-color: black;
	color: white;
}
</style>
