<template>
    <div class="homePage">
        <div class="mainTitle">
            <img src="mainTitle.gif" class="titleGif" />
        </div>
        <div class="createBox">
            <div class="card" style="display: flex; flex-direction: column">
                <h1 style="margin: 0px; text-align: center">
                    Create a new game
                </h1>
                <h3 style="width: 100%">Username</h3>
                <input type="text" v-model="inputValue" />
                <h3>Room name</h3>
                <input type="text" v-model="inputValue" />
                <div class="createBtn" @click="createOrJoinRoom">
                    <h1>CREATE</h1>
                </div>
            </div>
        </div>
        <div class="joinBox">
            <h1>Join Game</h1>
            <hr />
            <div v-if="roomsInfo.length" class="cardsList">
                <div
                    v-for="(room, index) in roomsInfo"
                    :key="index"
                    class="card"
                    :style="{
                        backgroundColor: colors[index % colors.length],
                    }"
                >
                    <span>
                        <h1 style="margin: 0px">{{ room.roomName }}</h1>
                    </span>
                    <h2 style="margin-bottom: 5px; margin-top: 15">
                        {{ room.players.length }}p
                    </h2>
                    <div class="playerList">
                        <div
                            v-for="(player, playerIndex) in room.players"
                            :key="playerIndex"
                        >
                            <div style="font-size: 20px; font-weight: bold">
                                P{{ playerIndex + 1 }}
                            </div>
                            <div style="margin-left: 5px">{{ player }}</div>
                        </div>
                    </div>
                    <div class="createBtn" @click="createOrJoinRoom">
                        <h1>JOIN</h1>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3>No rooms available...</h3>
            </div>
        </div>
    </div>
</template>

<style scoped>
.playerList {
    margin: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: auto;
    max-height: 120px;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
}
.createBtn {
    bottom: -3px;
    right: -3px;
    letter-spacing: 4px;
    border: 4px solid black;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    justify-content: center;
    align-items: center;
}
.createBtn h1 {
    margin: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.createBtn:hover {
    background-color: black;
    color: white;
}
.createBox {
    display: flex;
    margin-top: 4vw;
    flex-direction: column;
    align-items: center;
}
.createBox input {
    width: 97%;
    height: 30px;
    font-size: 20px;
}
.joinBox {
    margin-left: 30px;
    margin-right: 30px;
}
.cardsList {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.card {
    position: relative;
    margin: 10px;
    padding: 10px;
    border: 4px solid black;
    width: 300px;
    height: 300px;
    box-shadow: 5px 5px 5px #888888;
}
.homePage {
    background-color: white;
    color: black;
}
.mainTitle {
    justify-content: center;
    display: flex;
}
.titleGif {
    min-width: 310px;
    max-width: 1200px;
    width: 80%;
}
@media (max-width: 770px) {
    .titleGif {
        width: 100%;
    }
}
</style>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
    name: "HomePage",
    data() {
        return {
            colors: [
                "#ff000070",
                "#00ff0070",
                "#0000ff70",
                "#ffa50070",
                "#aa00ff70",
                "#00ffff70",
                "#ff990070",
            ],
            roomsInfo: [],
        };
    },
    mounted() {
        const { socket } = useSocket();
        socket.on("rooms-info", this.handleRoomsInfo);
    },
    setup() {
        const router = useRouter();
        const roomName = ref("");
        const { socket } = useSocket();

        function createRoom() {
            if (roomName.value !== "") {
                socket.emit("join-room", roomName.value);
                goToRoom();
            }
        }
        const goToRoom = () => {
            const gameRoute = `${roomName.value}[${socket.id}]`;
            router.push(gameRoute);
        };

        const updateRoomName = (event) => {
            roomName.value = event.target.value;
        };
        return { createRoom, inputValue: roomName, updateRoomName };
    },
    methods: {
        handleRoomsInfo(rooms) {
            this.roomsInfo = rooms;
            //console.log(this.roomsInfo);
        },
    },
    beforeUnmount() {
        const { socket } = useSocket();
        socket.off("rooms-info", this.handleRoomsInfo);
    },
});
</script>
