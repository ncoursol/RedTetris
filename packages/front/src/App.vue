<template>
  <div style="border: 1px solid #fb00ff">
    <h1>App</h1>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  created() {
    console.log("App created");
  },
});
</script>
