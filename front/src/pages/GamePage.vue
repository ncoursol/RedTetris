<template>
  <div style="border: 1px solid #ffd500">
    <h1>Room: {{ room }}</h1>
    <h2>Player ID: {{ player_name }}</h2>
    <TetrisGrid />
  </div>
</template>

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
    const roomInfo = ref([]);
    const { socket } = useSocket();

    socket.on("room-info", function (info) {
      roomInfo.value = info;
      console.log("Current room players info:", info);
    });

    return { roomInfo };
  },
});
</script>
