<template>
    <div class="mainLayout" style="border: 1px solid #00fff7">
        <img
            :src="imageUrl"
            :style="{ transform: `rotate(${rotation}deg)` }"
            class="logo"
            @mouseover="rotation += 90"
            @click="goToHome"
        />
        <router-view />
    </div>
</template>

<style scoped>
.mainLayout {
    background-color: #2b2b2b;
    color: white;
}
.logo {
    width: 80px;
    height: 80px;
    margin: 5px;
    margin-left: 20px;
    transition: transform 0.1s ease-in-out;
    cursor: pointer;
}
</style>

<script>
import { defineComponent } from "vue";
import { useSocket } from "@/plugins/socket";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import mainTitle from "../../public/mainTitle.gif";

export default defineComponent({
    name: "MainLayout",
    data() {
        return {
            imageUrl: "icons/icon-96.png",
            rotation: ref(0),
        };
    },
    setup() {
        const router = useRouter();
        const { socket } = useSocket();

        function leaveRoom() {
            socket.emit("leave-room");
            goToHome();
        }

        const goToHome = () => {
            router.push("/");
        };

        return { leaveRoom, mainTitle };
    },
});
</script>
