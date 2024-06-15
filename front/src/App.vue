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

export default defineComponent({
    name: "App",
});
</script>
