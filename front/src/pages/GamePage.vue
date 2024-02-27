<template>
  <div class="gamePage">
    <h1>Room: {{ room }}</h1>
    <h2>Player ID: {{ player_name }}</h2>
    <div v-for="(room, index) in roomsInfo" :key="index">
      <hr />
      <h3>Players: {{ room }}</h3>
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
import { defineComponent } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
  props: ["room", "player_name"],
  name: "GamePage",
  components: {
    TetrisGrid,
  },
  data() {
    return {
      roomsInfo: [],
    };
  },
  mounted() {
    const { socket } = useSocket();
    socket.on("room-info", this.handleRoomInfo);
  },
  methods: {
    handleRoomInfo(rooms) {
      this.roomsInfo = rooms;
      //console.log(this.roomsInfo);
    },
  },
  beforeUnmount() {
    const { socket } = useSocket();
    socket.off("room-info", this.handleRoomInfo);
  },
});
</script>
