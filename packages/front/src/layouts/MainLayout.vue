<template>
  <div style="border: 1px solid #00fff7">
    <h1>MainLayout</h1>
    <button @click="goToHome">Go to Home</button>
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const router = useRouter();
    const goToHome = () => {
      router.push("/");
    };

    return { goToHome };
  },
});
</script>
