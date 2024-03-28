<template>
    <div class="gamePage">
        <div v-if="isCurrentMaster">
            <button @click="setState('start')">Start Game</button>
            <button @click="setState('stop')">Stop Game</button>
            <button @click="setState('pause')">Pause Game</button>
        </div>
        {{ roomsInfo.state }}
        <h1>Room: {{ room }}</h1>
        <h2>Player ID: {{ player_name }}</h2>
        <div v-for="(player, index) in roomsInfo.players" :key="index">
            <hr />
            <h3>
                Players:
                {{ player.username ? player.username : player.playerId }}
            </h3>
        </div>
        <TetrisGrid />
    </div>
</template>

<style scoped>
.gamePage {
    background-color: white;
    color: black;
}
</style>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
    props: ["room", "player_name"],
    name: "GamePage",
    components: {
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

        const setState = (state) => {
            socket.emit("room-state", props.room, state);
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
