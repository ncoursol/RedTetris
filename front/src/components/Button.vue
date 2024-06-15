<template>
	<button class="actionBtn" @click="emitAction" @keydown.space.prevent>
		>
		<slot>{{ buttonText }}</slot>
	</button>
</template>

<style scoped>
.actionBtn {
	border: 4px solid black;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10px 20px;
	letter-spacing: 4px;
	background-color: transparent;
	color: inherit;
	transition: background-color 0.3s, color 0.3s;
}

.actionBtn:hover {
	background-color: black;
	color: white;
}
</style>

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
