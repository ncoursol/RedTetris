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
                <div class="row">
                    <div class="col">
                        <PlayerLabel :player_name="player_name" />
                        <div class="grid">
                            <TetrisGrid :grid="myGrid" />
                        </div>
                    </div>
                    <PieceStack :stack="gameStack" />
                </div>
            </div>
            <div class="opponentsGrid" ref="opponentsArea">
                <div
                    v-for="(player_grid, index) in opponentsGrids"
                    :key="index"
                    class="opponentsGrid-ctn"
                >
                    <div class="row">
                        <div class="col">
                            <PlayerLabel :player_name="index" />
                            <div class="grid">
                                <TetrisGrid :grid="player_grid" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-game {
    display: flex;
    flex-direction: column;
}
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
    gap: 10px;
    margin-bottom: 10px;
}

.myGrid {
    flex: 1;
    position: relative;
    font-size: 30px;
    letter-spacing: 5px;
}

.col {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #c7c7c7;
    border-radius: 10px;
    border: 2px black solid;
}

.row {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.grid {
    display: flex;
    position: relative;
    flex: 1;
    margin-bottom: 22px;
}

.opponentsGrid-ctn {
    flex: 1;
    position: relative;
    font-size: 15px;
    letter-spacing: 2px;
}

.opponentsGrid {
    flex: 1;
    display: grid;
    grid-gap: 5px;
    margin-right: 5px;
}
</style>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";
import PlayerLabel from "../components/PlayerLabel.vue";
import PieceStack from "../components/PieceStack.vue";
import { useSocket } from "@/plugins/socket";
import Button from "../components/Button.vue";
import router from "@/routes/router";

export default defineComponent({
    props: ["room", "player_name"],
    name: "GamePage",
    components: {
        Button,
        TetrisGrid,
        PlayerLabel,
        PieceStack,
    },
    setup(props) {
        const { socket } = useSocket();
        const roomsInfo = ref([]);
        const isCurrentMaster = ref(false);
        const opponents = ref([]);

        const opponentsGrids = ref([]);
        const myGrid = ref([]);

        const opponentsArea = ref(null);
        const width = ref(0);
        const height = ref(0);
        
        const computeRowsAndColumns = () => {
            const numberOfRow = Math.ceil((height.value / (width.value * 2)) * Math.sqrt(opponents.value.length));
            const numberOfColumns = Math.ceil(opponents.value.length / numberOfRow);

            const opponentContainer = document.querySelector(".opponentsGrid");
            opponentContainer.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
            opponentContainer.style.gridTemplateRows = `repeat(${numberOfRow}, 1fr)`;

            console.log("rows", numberOfRow);
            console.log("columns", numberOfColumns);
        };

        const handleRoomsInfo = (rooms) => {
            roomsInfo.value = rooms;
            //console.log(roomsInfo.value);

            isCurrentMaster.value =
                rooms.players[Object.keys(rooms.players)[0]].playerId ===
                socket.id;

            opponents.value = Object.values(rooms.players).filter(
                (player) => player.playerId !== socket.id
            );

            computeRowsAndColumns();

            if (rooms.state !== "playing") {
                opponentsGrids.value = {};
                for (let i = 0; i < opponents.value.length; i++) {
                    opponentsGrids.value[opponents.value[i].username] = [];
                }
            }
        };

        const handleGridsInfo = (grids) => {
            console.log(grids);

            myGrid.value = grids[socket.id];

            opponentsGrids.value = grids.filter(
                (grid) => grid.playerId !== socket.id
            );
            console.log("grids", opponentsGrids.value);
        };

        const handleKeyDown = (e) => {
            if (e.key === "ArrowDown") {
                socket.emit("move", props.room, "down");
            } else if (e.key === "ArrowLeft") {
                socket.emit("move", props.room, "left");
            } else if (e.key === "ArrowRight") {
                socket.emit("move", props.room, "right");
            } else if (e.key === "ArrowUp") {
                socket.emit("move", props.room, "up");
            } else if (e.key === " ") {
                socket.emit("move", props.room, "space");
            }
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
            socket.on("grids", handleGridsInfo);
            socket.emit("get-rooms", props.room);

            window.addEventListener("keydown", handleKeyDown);

            width.value = opponentsArea.value.offsetWidth;
            height.value = opponentsArea.value.offsetHeight;
        });

        onUnmounted(() => {
            socket.off("rooms-info", handleRoomsInfo);
            socket.off("grids", handleGridsInfo);
            handleBeforeUnload();
            window.removeEventListener("keydown", handleKeyDown);
        });

        onresize = () => {
            width.value = opponentsArea.value.offsetWidth;
            height.value = opponentsArea.value.offsetHeight;
            computeRowsAndColumns();
        };

        return {
            roomsInfo,
            setState,
            handleBeforeUnload,
            isCurrentMaster,
            opponentsGrids,
            myGrid,
            opponentsArea
        };
    },
});
</script>
