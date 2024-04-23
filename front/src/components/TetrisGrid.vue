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
    setup(props) {
        if (props.grid.length === 0) {
            let grid = Array.from({ length: 21 }, () =>
                Array.from({ length: 10 }, () => "white")
            );
            return { grid };
        }
    },
});
</script>

<style scoped>
.tetris-grid {
    background-color: #9090ff;
    padding: 5px;
    padding-bottom: 4px;
    padding-right: 4px;
    border-radius: 10px;
    border: 2px solid #0000ff;
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
    flex-direction: row;
}

.tetris-cell {
    border-bottom: 1px solid #9090ff;
    border-right: 1px solid #9090ff;
    border-radius: 3px;
    aspect-ratio: 1;
    width: 100%;
}
</style>
