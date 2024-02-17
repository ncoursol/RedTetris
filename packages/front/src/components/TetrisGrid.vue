<template>
  <div class="tetris-grid">
    <div v-for="row in grid" :key="row" class="tetris-row">
      <div
        v-for="col in row"
        :key="col"
        class="tetris-cell"
        :style="{ background: col }"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TetrisGrid",
  computed: {
    // tmp random grid
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
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ff0000;
  width: fit-content;
}

.tetris-row {
  display: flex;
}

.tetris-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #0000ff;
}
</style>
