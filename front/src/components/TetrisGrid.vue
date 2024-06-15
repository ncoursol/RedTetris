<template>
    <div class="tetris-grid">
        <div v-if="status === 1" class="end-screen"></div>
        <div v-for="(row, rowIndex) in grid.slice(1)" :key="rowIndex" class="tetris-row">
            <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="tetris-cell"
                :style="{ backgroundColor: cell[1] === 'shadow' ? 'black' : cell[0], borderRadius: opponentGrid ? '1px' : '3px' }">
                <div v-if="!(cell[1] === 'shadow' || (cell[0] === 'black' && cell[1] === 'null') || opponentGrid)"
                    class="cell-volume" :style="{ borderColor: cell[0] }">
                    <div class="cell-top" :style="{ borderColor: cell[1] !== 'null' ? 'gray' : cell[0] }"></div>
                </div>
                <div v-else-if="cell[1] === 'shadow'" class="cell-shadow" :style="{ borderColor: cell[0] }"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.end-screen {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #ffffff99;
    border-radius: 10px;
}

.tetris-grid {
    background-color: #494949;
    padding: 5px;
    border-radius: 10px;
    border: 2px solid black;
    aspect-ratio: 1 / 2;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    max-width: 100%;
    max-height: 94%;
    margin-left: auto;
    margin-right: auto;
}

.cell-top {
    aspect-ratio: 1;
    margin: 15%;
    border: 1px solid;
    box-shadow: inset 3px 3px 6px #000000bb;
}

.cell-volume {
    aspect-ratio: 1;
    border-radius: 3px;
    border: 1px solid;
    box-shadow: inset 3px 3px 6px #ffffff99, inset -3px -3px 6px #00000099;
}

.tetris-row {
    display: flex;
    flex-direction: row;
}

.tetris-cell {
    border-bottom: 1px solid #494949;
    border-right: 1px solid #494949;
    border-radius: 3px;
    aspect-ratio: 1;
    width: 100%;
}

.cell-shadow {
    aspect-ratio: 1;
    border-radius: 3px;
    border: 2px solid;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "TetrisGrid",
    props: {
        opponentGrid: {
            type: Boolean,
            default: false,
        },
        grid: {
            type: Array,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
    },
});
</script>