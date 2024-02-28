<template>
  <div style="border: 1px solid #664078">
    <h1>Home</h1>
    <button @click="createRoom">Create a new game</button>
    <input type="text" v-model="inputValue" />
    <div v-if="roomsInfo.length">
      <h2>Rooms Information :</h2>
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
import { useRouter } from "vue-router";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      roomsInfo: [],
    };
  },
  mounted() {
    const { socket } = useSocket();
    socket.on("rooms-info", this.handleRoomsInfo);
  },
  setup() {
    const router = useRouter();
    const roomName = ref('');
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
