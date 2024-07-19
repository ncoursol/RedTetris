<template>
    <div class="homePage">
        <div class="mainTitle">
            <img src="mainTitle.gif" class="titleGif" />
        </div>
        <div class="createBox">
            <div class="card" style="display: flex; flex-direction: column">
                <h1 style="margin: 0px; text-align: center; font-size: 29px; font-weight: initial;">
                    Create a new game
                </h1>
                <h3 style="width: 100%">Username</h3>

                <input type="text" v-model="username" />
                <h3>Room name</h3>
                <input type="text" v-model="roomName" />
                <div class="createBtn" @click="joinRoom(roomName, username, 'create')">
                    <h1>CREATE</h1>
                </div>
            </div>
            <div v-if="errorMsg" class="errorBox">
                {{ errorMsg }}
            </div>
        </div>
        <div>
            <div class="joinBox">
                <h1>Join Game</h1>
                <hr />
                <div v-if="roomsInfo" style="margin-bottom: 10px">
                    <h3>Username</h3>
                    <input type="text" style="max-width: 290px" v-model="usernameJoin" />
                </div>
            </div>
            <div v-if="roomsInfo" class="cardsList">
                <div v-for="(room, roomName, index) in roomsInfo" :key="index" class="card" :style="{
                    backgroundColor: colors[index % colors.length],
                }">
                    <span>
                        <h1 class="overflowHandler">{{ roomName }}</h1>
                    </span>
                    <h2 style="margin-bottom: 5px; margin-top: 10px">
                        {{ Object.keys(room.players).length }} player{{
                            Object.keys(room.players).length > 1 ? "s" : ""
                        }}
                    </h2>
                    <div class="playerList">
                        <div v-for="(player, playerId, playerIndex) in room.players" :key="playerIndex" class="playerLine">
                            <div style="
                                    font-size: 20px;
                                    font-weight: bold;
                                    margin-right: 15px;
                                ">
                                P{{ playerIndex + 1 }}
                            </div>
                            <div class="overflowHandler" style="font-size: x-large;">
                                {{
                                    player.username
                                    ? player.username
                                    : playerId
                                }}
                            </div>
                        </div>
                    </div>
                    <div v-if="room.state === 'stop'"
                        class="createBtn"
                        @click="joinRoom(roomName, usernameJoin, 'join')">
                        <h1>JOIN</h1>
                    </div>
                    <div v-else>
                        <h3 class="inGameMsg">Game in progress...</h3>
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

.inGameMsg {
    position: absolute;
    font-size: x-large;
    bottom: 10px;
    font-style: italic;
    margin: 0px;
}

.playerLine {
    display: flex;
    align-items: center;
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

.errorBox {
    padding: 10px;
    margin: 10px;
    width: 292px;
    border: 4px solid rgb(255, 0, 0);
    color: rgb(255, 0, 0);
    font-size: large;
    font-weight: bold;
    text-align: center;
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
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
    name: "HomePage",
    setup() {
        const { socket } = useSocket();
        const roomsInfo = ref([]);
        const errorMsg = ref("");
        const roomName = ref("");
        const username = ref("");
        const usernameJoin = ref("");
        const router = useRouter();

        const colors = [
            "#ff000070",
            "#00ff0070",
            "#0000ff70",
            "#ffff0070",
            "#aa00ff70",
            "#00ffff70",
            "#ffa50070",
        ];

        const joinRoom = (roomName, username, type) => {
            socket.emit("join-room", roomName, username, type, (error) => {
                if (error === "") {
                    const gameRoute = `${roomName}/${username}`;
                    router.push(gameRoute);
                } else {
                    errorMsg.value = error;
                }
            });
        };

        const handleRoomsInfo = (rooms) => {
            roomsInfo.value = rooms;
            //console.log(roomsInfo.value);
        };

        onMounted(() => {
            socket.on("rooms-info", handleRoomsInfo);
            socket.emit("get-rooms", "");
        });


        onUnmounted(() => {
            socket.off("rooms-info", handleRoomsInfo);
        });

        return {
            colors,
            roomsInfo,
            errorMsg,
            roomName,
            username,
            usernameJoin,
            joinRoom,
        };
    },
});
</script>
