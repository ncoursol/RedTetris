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

                <input type="text" v-model="username" />
                <h3>Room name</h3>
                <input type="text" v-model="roomName" />
                <div class="createBtn" @click="joinRoom(roomName, username)">
                    <h1>CREATE</h1>
                </div>
            </div>
        </div>
        <div>
            <div class="joinBox">
            <h1>Join Game</h1>
            <hr/>
            <div v-if="roomsInfo.length" style="margin-bottom: 10px;">
                <h3>Username</h3>
                <input
                    type="text"
                    style="max-width: 290px"
                    v-model="usernameJoin"
                />
            </div>
            </div>
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
                        <h1 class="overflowHandler">{{ room.roomName }}</h1>
                    </span>
                    <h2 style="margin-bottom: 5px; margin-top: 10px">
                        {{ room.players.length }} player{{ room.players.length > 1 ? "s" : "" }}
                    </h2>
                    <div class="playerList">
                        <div
                            v-for="(player, playerIndex) in room.players"
                            :key="playerIndex"
                            class="playerLine"
                        >
                            <div style="font-size: 20px; font-weight: bold; margin-right: 8px;">
                                P{{ playerIndex + 1 }}
                            </div>
                            <div class="overflowHandler">
                                {{
                                    player.username
                                        ? player.username
                                        : player.playerId
                                }}
                            </div>
                        </div>
                    </div>
                    <div
                        class="createBtn"
                        @click="joinRoom(room.roomName, usernameJoin)"
                    >
                        <h1>JOIN</h1>
                    </div>
                </div>
            </div>
            <div v-else class="joinBox">
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
    overflow-x: auto;
    max-height: 120px;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    scrollbar-color: black rgba(255, 255, 255, 0);
}
.playerLine {
    display: flex;
    align-items: center;
    margin: 5px;
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
    padding-top: 4vw;
    flex-direction: column;
    align-items: center;
}

input {
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
.overflowHandler {
    margin: 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.card {
    position: relative;
    margin: 10px;
    padding: 10px;
    border: 4px solid black;
    width: 292px;
    height: 292px;
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
@media (max-width: 550px) {
    .mainTitle {
        display: none;
    }
    .joinBox {
        margin-left: 14px;
        margin-right: 14px;
    }
    .card {
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>

<script>
import { defineComponent } from "vue";
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
                "#aa00ff70",
                "#00ffff70",
                "#ffa50070",
            ],
            roomsInfo: [],
            roomName: "",
            username: "",
            usernameJoin: "",
        };
    },
    mounted() {
        const { socket } = useSocket();
        socket.emit("get-rooms");
        socket.on("rooms-info", this.handleRoomsInfo);
    },
    setup() {
        const router = useRouter();
        const { socket } = useSocket();

        const joinRoom = (roomName, username) => {
            if (roomName !== "") {
                socket.emit("join-room", roomName, username);
                goToRoom(roomName);
            }
        };

        const goToRoom = (roomName) => {
            const gameRoute = `${roomName}[${socket.id}]`;
            router.push(gameRoute);
        };

        return { joinRoom };
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
