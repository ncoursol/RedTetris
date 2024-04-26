<template>
    <div class="tetris-grid">
        <div
            v-for="(row, rowIndex) in grid.slice(1)"
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
import { defineComponent } from "vue";

export default defineComponent({
    name: "TetrisGrid",
    props: {
        grid: {
            type: Array,
            required: true,
        },
    },
});
</script>

<style scoped>
.tetris-grid {
    background-color: #919191;
    padding: 5px;
    border-radius: 10px;
    border: 2px solid black;
    aspect-ratio: 1 / 2;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    max-width: 100%;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
}

.tetris-row {
    display: flex;
    flex-direction: row;
}

.tetris-cell {
    border-bottom: 1px solid #919191;
    border-right: 1px solid #919191;
    border-radius: 3px;
    aspect-ratio: 1;
    width: 100%;
}
</style>
