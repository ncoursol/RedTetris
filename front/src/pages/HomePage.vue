<template>
  <div style="border: 1px solid #664078">
    <h1>Home</h1>
    <button @click="createRoom">Create a new game</button>
    <input type="text" v-model="inputValue" />
    <h2>Rooms Information :</h2>
    <div v-if="roomsInfo.length">
      <div v-for="(room, index) in roomsInfo" :key="index">
        <hr />
        <h3>Room: {{ room.roomName }}</h3>
        <ul>
          <li v-for="(player, playerIndex) in room.players" :key="playerIndex">
            Player {{ playerIndex }}{{ !playerIndex ? " (master)" : "" }}:
            {{ player }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useSocket } from "@/plugins/socket";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomePage",
  setup() {
    const roomsInfo = ref([]);
    const { socket } = useSocket();
    const router = useRouter();
    const roomName = ref('');

    socket.on("rooms-info", function (info) {
      roomsInfo.value = info;
      console.log("Received updated rooms info:", info);
    });

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

    return { roomsInfo, createRoom, inputValue: roomName, updateRoomName };
  },
});
</script>
