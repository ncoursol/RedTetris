<template>
  <div class="gamePage">
    <h1>Room: {{ room }}</h1>
    <h2>Player ID: {{ player_name }}</h2>
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
import { defineComponent, ref } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
  props: ["room", "player_name"],
  name: "GamePage",
  components: {
    TetrisGrid,
  },
  setup() {
    const roomsInfo = ref([]);
    const { socket } = useSocket();

    socket.on("rooms_info", function (info) {
      roomsInfo.value = info;
      console.log("Received updated rooms info:", info);
    });

    return { roomsInfo };
  },
});
</script>
