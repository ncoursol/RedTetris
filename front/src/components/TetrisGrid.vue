<!-- <template>
    <div class="tetris-grid">
        <div
            v-for="(cell, index) in grid"
            :key="index"
            class="tetris-cell"
            :style="{ backgroundColor: cell }"
        ></div>
    </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
    name: "TetrisGrid",
    setup() {
        const grid = computed(() => {
            let gridArray = [];
            for (let j = 0; j < 200; j++) {
                gridArray.push(
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                );
            }
            return gridArray;
        });

        return {
            grid,
        };
    },
});
</script> -->

<template>
  <div class="tetris-grid">
    <div
      v-for="(row, rowIndex) in grid"
      :key="rowIndex"
      class="tetris-row"
    >
      <div
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        class="tetris-cell"
        :style="{ backgroundColor: cell }"
      ></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
    name: "TetrisGrid",
    setup() {
        const grid = computed(() => {
            let gridArray = [];
            for (let j = 0; j < 20; j++) {
                let gridRow = [];
                for (let i = 0; i < 10; i++) {
                    gridRow.push(
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                    );
                }
                gridArray.push(gridRow);
            }
            return gridArray;
        });

        return {
            grid,
        };
    },
});
</script>

<style scoped>
.tetris-grid {
    border: 1px solid #0000ff;
    border-top: 2px solid #0000ff;
    border-left: 2px solid #0000ff;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    aspect-ratio: 1 / 2;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    max-height: 100%;
}

.tetris-row {
    display: flex;
}

.tetris-cell {
    border-bottom: 1px solid #0000ff;
    border-right: 1px solid #0000ff;
    aspect-ratio: 1;
    width: 100%;
}
</style>
