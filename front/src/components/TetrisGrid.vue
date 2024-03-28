<template>
  <div class="tetris-grid" ref="tetrisGrid">
    <div v-for="row in grid" :key="row" class="tetris-row">
      <div v-for="col in row" :key="col" class="tetris-cell"
        :style="{ width: cellSize + 'px', height: cellSize + 'px', backgroundColor: col }">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, computed, reactive, watchEffect } from 'vue';

export default defineComponent({
  name: "TetrisGrid",
  setup() {
    const tetrisGrid = ref(null);

    const gridSize = reactive({
      width: 0,
      height: 0
    });

    const updateSize = () => {
      if (tetrisGrid.value) {
        gridSize.width = tetrisGrid.value.offsetWidth;
        gridSize.height = tetrisGrid.value.offsetHeight;
      }
    };
    let resizeObserver;
    onMounted(() => {
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(tetrisGrid.value);
      }
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    const cellSize = computed(() => {
      return gridSize.height > 0 ? gridSize.height / 20 : 0;
    });

    watchEffect(() => {
      updateSize();
    });

    const grid = computed(() => {
      let gridArray = [];
      for (let i = 0; i < 20; i++) {
        let row = [];
        for (let j = 0; j < 10; j++) {
          row.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        gridArray.push(row);
      }
      return gridArray;
    });

    return {
      cellSize,
      grid,
      tetrisGrid
    };
  },
});
</script>


<style scoped>
.tetris-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid #ff0000;
  box-sizing: border-box;
  height: 100%;
}

.tetris-row {
  display: flex;
}

.tetris-cell {
  border: 1px solid #0000ff;
  box-sizing: border-box;

}
</style>
