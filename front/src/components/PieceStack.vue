<template>
    <div class="game-stack">
        <div>

        </div>
    </div>
</template>

<style scoped>
.game-stack{
    background-color: #8a2be2;
    width: 30%;
    margin-top: 48px;
    border: 2px black solid;
    border-left: 0;
    border-radius: 0px 10px 10px 0px;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "PieceStack",
    props: {
        stack: {
            type: Array,
        },
    },
    setup() {
    },
});
</script>