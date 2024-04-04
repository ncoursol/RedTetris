<template>
    <div class="mainLayout">
        <div class="navBar">
            <img
                :src="imageUrl"
                :style="{ transform: `rotate(${rotation}deg)` }"
                class="logo"
                @mouseover="rotation += 90"
                @click="goToHome"
            />
            <div class="title">
                RED TETRIS
            </div>
        </div>
        <router-view class="content"/>
    </div>
</template>

<style scoped>
.mainLayout {
    background-color: #2b2b2b;
    color: white;
    display: flex;
    flex-flow: column;
    height: 100%;
}
.navBar {
    flex: 0 1 72px;
    display: flex;
    align-items: center;
}
.content {
    flex: 1 1 auto;
}
.logo {
    width: 60px;
    height: 60px;
    margin: 5px;
    margin-left: 20px;
    transition: transform 0.1s ease-in-out;
    cursor: pointer;
}
.title {
    width: 100%;
    display: flex;
    font-size: 60px;
    letter-spacing: 12px;
    font-family: Druk;
    justify-content: center;
    
}
@media (max-width: 900px) {
    .title {
        font-size: 40px;
        letter-spacing: 10px;
    }
}
@media (max-width: 550px) {
    .title {
        font-size: 30px;
        letter-spacing: 8px;
        margin-left: 10px;
        overflow: hidden;
    }
}
</style>

<script>
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

        const goToHome = () => {
            router.push("/");
        };

        return { goToHome, mainTitle };
    },
});
</script>
