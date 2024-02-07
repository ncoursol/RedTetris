<template>
  <div>
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
