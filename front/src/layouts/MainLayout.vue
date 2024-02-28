<template>
  <div style="border: 1px solid #00fff7">
    <h1>MainLayout</h1>
    <button @click="leaveRoom">Go to Home</button>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useSocket } from "@/plugins/socket";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",
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

    return { leaveRoom };
  },
});
</script>
