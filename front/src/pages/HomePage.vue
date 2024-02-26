<template>
    <div class="homePage" style="border: 1px solid #664078">
        <div class="mainTitle">
            <img src="mainTitle.gif" class="titleGif" />
        </div>
        <div class="createBox">
            <div class="card">
                <h1 style="margin-top: 0px">Create a new game</h1>
                <span style="width: 100%">Username</span>
                <input type="text" v-model="inputValue" />
                <span>Room name</span>
                <input type="text" v-model="inputValue" />
                <span>Create the JOIN design ?</span>
                <div class="createBtn" @click="createOrJoinRoom">
                    <div v-for="i in 3" :key="i"></div>
                    <span style="width: 47px; height: 50px"></span>
                    <h1 style="position: absolute">CREATE</h1>
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
                    <h3 style="margin: 0px">Room: {{ room.roomName }}</h3>
                    <ul>
                        <li
                            v-for="(player, playerIndex) in room.players"
                            :key="playerIndex"
                        >
                            Player {{ playerIndex
                            }}{{ !playerIndex ? " (master)" : "" }}:
                            {{ player }}
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else>
                <h3>No rooms available...</h3>
            </div>
        </div>
    </div>
</template>

<style scoped>
.createBtn {
    bottom: -3px;
    right: -3px;
    letter-spacing: 4px;
    width: 200px;
    height: 50px;
    border: 4px solid black;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    justify-content: center;
    align-items: center;
}
.createBtn div {
    width: 49px;
    height: 50px;
    border-right: 2px solid black;
}
.createBtn:hover {
    background-color: #00eeee;
}
.createBox {
    display: flex;
    margin-top: 4vw;
    flex-direction: column;
    align-items: center;
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
    text-align: center;
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
                "#ffff0070",
                "#ff00ff70",
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
