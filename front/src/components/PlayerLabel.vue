<template>
    <div class="player-label">
        <div class="overflowHandler">{{ player_name }}</div>
    </div>
</template>

<style scoped>
.player-label {
    display: flex;
    font-family: 'Druk';
    margin-bottom: 5px;
    justify-content: center;
    border: 2px solid black;
    border-radius: 5px;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #919191;
}

.overflowHandler {
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "PlayerLabel",
    props: {
        player_name: {
            type: String,
            required: true,
        },
    },
});
</script>