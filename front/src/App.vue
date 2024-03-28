<template>
    <div id="main">
        <router-view />
    </div>
</template>

<style scoped>
#main {
    height: 100vh;
}
@font-face {
    font-family: Druk;
    src: url("../public/fonts/DrukWide-Heavy-Trial.otf");
}
</style>

<script>
import { defineComponent } from "vue";
import { useSocket } from "@/plugins/socket";

export default defineComponent({
    name: "App",
    setup() {
        const { socket } = useSocket();

        const sessionID = sessionStorage.getItem("sessionID");
        if (sessionID) {
            socket.auth = { sessionID };
            socket.connect();
        }
        socket.on("session", ({ sessionID }) => {
            socket.auth = { sessionID };
            sessionStorage.setItem("sessionID", sessionID);
        });
    },
});
</script>
