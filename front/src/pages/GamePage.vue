<template>
    <div class="gamePage">
        <p class="room_title">{{ room }}</p>
        <div class="grid-ctn">
            <div>
                <div class="buttons-list">
                    <div v-if="isCurrentMaster" class="buttons-master">
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
                    <Button
                        buttonText="Leave Room"
                        @action="handleBeforeUnload"
                    />
                </div>
                <div class="player-list">
                    <div
                        v-for="(player, index) in roomsInfo.players"
                        :key="index"
                        class="player"
                    >
                        <p>{{ player.username }}</p>
                    </div>
                </div>
            </div>
            <div class="myGrid">
                <TetrisGrid :isMainGrid="true" />
            </div>
            <div class="opponentsGrid">
                <div
                    v-for="(player, index) in roomsInfo.players"
                    :key="index"
                    class="opponentsGrid-ctn"
                >
                    <TetrisGrid
                        v-if="player.username !== player_name"
                        :isMainGrid="false"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 20px;
}
.room_title {
    font-size: 25px;
    font-weight: 100;
    font-family: Druk;
    letter-spacing: 5px;
    margin: 20px;
    color: #2b2b2b;
    flex: 0 1 auto;
}

.buttons-master {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.buttons-list {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.gamePage {
    background-color: white;
    color: black;
    display: flex;
    flex-flow: column;
    height: 100%;
}

.grid-ctn {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
}

.myGrid {
    flex: 1;
    position: relative;
}

.opponentsGrid-ctn {
    height: 270px;
    position: relative;
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
import router from "@/routes/router";

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
            isCurrentMaster.value =
                rooms.players[Object.keys(rooms.players)[0]].playerId ===
                socket.id;
        };

        const handleBeforeUnload = () => {
            socket.emit("leave-room");
            router.push("/");
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
            handleBeforeUnload,
            isCurrentMaster,
        };
    },
});
</script>
