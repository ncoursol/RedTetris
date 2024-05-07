<template>
    <div class="gamePage">
        <div class="grid-ctn">
            <div :class="{ menuSmall: showMenu }" style="max-width: 30%">
                <div class="buttons-list" :class="{ 'Button :deep(actionBtn)': showMenu }">
                    <div class="overlayBtn" @click="showMenu = !showMenu" :style="{ transform: `rotate(${showMenu ? 0 : 180}deg)` }">
                        >
                    </div>
                    <p
                        class="room_title overflowHandler"
                        :class="{ hidden: showMenu }"
                    >
                        {{ room }}
                    </p>
                    <div
                        v-if="isCurrentMaster"
                        class="buttons-master"
                    >
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
                <div class="player-list" :class="{ hidden: showMenu }">
                    <div
                        v-for="(player, index) in roomsInfo.players"
                        :key="index"
                        class="player"
                    >
                        <p class="overflowHandler">{{ player.username }}</p>
                    </div>
                </div>
            </div>
            <div class="myGrid">
                <div class="col">
                    <PlayerLabel
                        :player_name="player_name"
                        class="overflowhandler"
                    />
                    <div class="grid">
                        <TetrisGrid :grid="myGrid" />
                    </div>
                </div>
            </div>
            <div class="opponentsGrid" ref="opponentsArea">
                <div
                    v-for="(player_grid, index) in opponentsGrids"
                    :key="index"
                    class="opponentsGrid-ctn"
                >
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

.menuSmall {
    width: 54px;
}

.hidden {
    display: none;
}

.Button :deep(.actionBtn) {
    letter-spacing: 0px;
}

.letter-spacing {
    letter-spacing: 0px;
}

.room_title {
    font-size: 15px;
    font-weight: 100;
    font-family: Druk;
    letter-spacing: 2px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #2b2b2b;
    flex: 0 1 auto;
}

.overflowHandler {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.overlayBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    width: 45px;
    height: 50px;
    background-color: #f2f2f2;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bolder;
    font-family: Druk;
    letter-spacing: 5px;
    color: #2b2b2b;
    cursor: pointer;
    border: 2px solid #2b2b2b;
}

.overlayBtn:hover {
    background-color: black;
    color: white;
}

.buttons-master {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.buttons-list {
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
    margin: 10px;
}

.myGrid {
    flex: 1;
    position: relative;
    font-size: 15px;
    letter-spacing: 2px;
}

.col {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #c7c7c7;
    border-radius: 10px;
    border: 2px black solid;
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

        const showMenu = ref(false);

        const computeRowsAndColumns = () => {
            const numberOfRow = Math.ceil(
                (height.value / (width.value * 2)) *
                    Math.sqrt(opponents.value.length)
            );
            const numberOfColumns = Math.ceil(
                opponents.value.length / numberOfRow
            );

            const opponentContainer =
                document.querySelector(".opponentsGrid");
            opponentContainer.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;
            opponentContainer.style.gridTemplateRows = `repeat(${numberOfRow}, 1fr)`;
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
            const myIndex = Object.keys(roomsInfo.value.players).findIndex(
                (player) => player === socket.id
            );

            myGrid.value = grids[myIndex];
            delete grids[myIndex];
            
            opponentsGrids.value = grids;
            console.log(myGrid.value);
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
            opponentsArea,
            showMenu,
        };
    },
});
</script>
