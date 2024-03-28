<template>
    <div class="gamePage">
        <div v-if="isCurrentMaster">
            <Button
                buttonText="Start Game"
                actionType="start"
                @action="setState"
            />
            <Button
                buttonText="Stop Game"
                actionType="stop"
                @action="setState"
            />
            <Button
                buttonText="Pause game"
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
            <div class="myGrid">
                <TetrisGrid :isMainGrid="true" />
            </div>
			<div class="opponentsGrid">
				<div v-for="(player, index) in roomsInfo.players" :key="index" class="opponentsGrid-ctn">
					<TetrisGrid v-if="player.username !== player_name" :isMainGrid="false" />
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
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";
import { useSocket } from "@/plugins/socket";
import Button from "../components/Button.vue";

export default defineComponent({
    props: ["room", "player_name"],
    name: "GamePage",
    components: {
        Button,
        TetrisGrid,
    },
    setup(props) {
        const { socket } = useSocket();
        const roomsInfo = ref([]);
        const isCurrentMaster = ref(false);

        const handleRoomsInfo = (rooms) => {
            roomsInfo.value = rooms;
            //console.log(roomsInfo.value);
			isCurrentMaster.value = rooms.players[Object.keys(rooms.players)[0]].playerId === socket.id;
        };

        const handleBeforeUnload = () => {
            socket.emit("leave-room");
        };

        const setState = (actionType) => {
            socket.emit("room-state", props.room, actionType);
        };

        onMounted(() => {
            socket.on("rooms-info", handleRoomsInfo);
            socket.emit("get-rooms", props.room);
        });

        onUnmounted(() => {
            socket.off("rooms-info", handleRoomsInfo);
            handleBeforeUnload();
        });

        return {
            roomsInfo,
            setState,
            isCurrentMaster,
        };
    },
});
</script>
