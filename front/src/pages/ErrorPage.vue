<template>
    <div class="errorPage">
        <h1>{{ status }} Error</h1>
        <p>{{ message }}</p>
    </div>
</template>

<style scoped>
.errorPage {
    text-align: center;
    padding-top: 100px;
    background-color: white;
    color: black;
}

h1 {
    font-size: 48px;
    color: #ff0000;
}

p {
    font-size: 24px;
    color: #333333;
}
</style>

<script>
export default {
    name: "ErrorPage",
    props: {
        status: Number,
        message: String,
    },
};
</script>
