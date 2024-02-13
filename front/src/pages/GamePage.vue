<template>
  <div style="border: 1px solid #ffd500">
    <h1>Room: {{ roomId }}</h1>
    <h2>Player ID: {{ player_name }}</h2>
    <TetrisGrid />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TetrisGrid from "../components/TetrisGrid.vue";

export default defineComponent({
  props: ['room', 'player_name'],
  name: "GamePage",
  components: {
    TetrisGrid,
  },
});
</script>
