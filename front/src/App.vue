<template>
    <div id="main">
        <router-view />
    </div>
</template>

<style scoped>
#main {
    height: 100vh;
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
});
</script>
