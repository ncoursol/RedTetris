<template>
  <div class="tetris-grid" :class="{ 'main-grid': isMainGrid, 'opponent-grid': !isMainGrid }">
    <div v-for="(row, rowIndex) in grid" :key="`row-${rowIndex}`" class="tetris-row">
      <div v-for="(color, colIndex) in row" :key="`col-${rowIndex}-${colIndex}`" class="tetris-cell"
        :style="{ backgroundColor: color }"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
// import { io } from "socket.io-client";

export default defineComponent({
  name: "TetrisGrid",
  props: {
    isMainGrid: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    grid() {
      let grid = [];
      for (let i = 0; i < 20; i++) {
        let row = [];
        for (let j = 0; j < 10; j++) {
          row.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        grid.push(row);
      }
      return grid;
    },
  },
});
</script>

<style scoped>
.tetris-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-height: 100%;
  /* Empêche la grille de dépasser du conteneur parent */
  overflow: hidden;
}

.tetris-row {
  display: flex;
  flex-grow: 1;
  width: 100%;
}

.tetris-cell {
  background-color: #ccc;
  flex: 1;
  position: relative;
}

.tetris-cell::before {
  content: "";
  display: block;
  padding-top: 100%;
}
</style>
