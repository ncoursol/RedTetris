import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";

const routes = [
    {
        path: "/",
        component: () => import("../layouts/MainLayout.vue"),
        children: [
            { path: "", component: () => import("../pages/HomePage.vue") },
            {
                path: ":room/:player_name",
                component: () => import("../pages/GamePage.vue"),
                props: true,
                beforeEnter: (to, from, next) => {
                    const roomName = to.params.room;
                    const playerName = to.params.player_name;

                    axios
                        .get(`/checkRoom/${roomName}/${playerName}`)
                        .then((response) => {
                            if (response.status === 200) {
                                next();
                            }
                        })
                        .catch((error) => {
                            router.push({
                                path: "/error",
                                query: {
                                    status: error.response.status,
                                    message: error.response.data,
                                },
                            });
                        });
                },
            },
            {
                path: "/error",
                component: () => import("../pages/ErrorPage.vue"),
                props: (route) => ({
                    status: route.query.status,
                    message: route.query.message,
                }),
            },
            {
                path: "/:catchAll(.*)",
                component: () => import("../pages/ErrorPage.vue"),
                props: { status: 404, message: "Page not found" },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
