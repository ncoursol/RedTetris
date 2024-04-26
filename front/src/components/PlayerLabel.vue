<template>
    <div class="player-label">
        <div class="overflowHandler">{{ player_name }}</div>
    </div>
</template>

<style scoped>
.player-label {
    display: flex;
    font-family: 'Druk';
    margin: 5px;
    margin-left: 10px;
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