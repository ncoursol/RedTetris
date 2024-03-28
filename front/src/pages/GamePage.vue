<template>
	<div class="gamePage">
		<div v-if="isCurrentMaster">
			<Button
				buttonText="Start Game"
				actionType="playing"
				@action="setState"
			/>
			<Button
				buttonText="Waiting for player"
				actionType="waiting"
				@action="setState"
			/>
			<Button
				buttonText="pause the game"
				actionType="pause"
				@action="setState"
			/>
		</div>

		<h1>Room: {{ room }}</h1>
		<h2>Player ID: {{ player_name }}</h2>
		<div v-for="(player, index) in roomsInfo.players" :key="index">
			<hr />
			<h3>
				Players:
				{{ player.username ? player.username : player.playerId }}
			</h3>
		</div>
		<div class="grid-ctn">
			<!-- My grid -->
			<div class="myGrid">
				<TetrisGrid :isMainGrid="true" />
			</div>
			<!-- opponents' grids, between 1 and 9 -->
			<div class="opponentsGrid">
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
				<div class="opponentsGrid-ctn">
					<TetrisGrid :isMainGrid="false" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.gamePage {
	background-color: white;
	color: black;
}

.grid-ctn {
	display: flex;
	justify-content: center;
	margin-top: 20px;
	gap: 20px;
	height: 70vh;
}

.myGrid {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	max-width: 50%;
}

.opponentsGrid-ctn {
	height: 270px;
}

.opponentsGrid {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	/* justify-content: space-around; */
	max-width: 50%;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 5px;
}
</style>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import TetrisGrid from '../components/TetrisGrid.vue';
import { useSocket } from '@/plugins/socket';
import Button from '../components/Button.vue';

export default defineComponent({
	props: ['room', 'player_name'],
	name: 'GamePage',
	components: {
		Button,
		TetrisGrid
	},
	setup(props) {
		const { socket } = useSocket();
		const roomsInfo = ref([]);
		const isCurrentMaster = ref(false);

		const handleRoomsInfo = (rooms) => {
			roomsInfo.value = rooms;
			//console.log(roomsInfo.value);
			isCurrentMaster.value = rooms.players[0].playerId === socket.id;
		};

		const handleBeforeUnload = () => {
			socket.emit('leave-room');
		};

		const setState = (actionType) => {
			console.log(actionType); // Juste pour vérifier que l'action est bien reçue
			socket.emit('room-state', props.room, actionType);
		};

		onMounted(() => {
			socket.on('rooms-info', handleRoomsInfo);
			socket.emit('get-rooms', props.room);
			window.addEventListener('beforeunload', handleBeforeUnload);
		});

		onUnmounted(() => {
			socket.off('rooms-info', handleRoomsInfo);
			handleBeforeUnload();
			window.removeEventListener('beforeunload', handleBeforeUnload);
		});

		return {
			roomsInfo,
			setState,
			isCurrentMaster
		};
	}
});
</script>
