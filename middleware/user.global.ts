import { useUserStore } from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore();

    try {
        if (
            (!userStore.user && !userStore.token && !userStore.toRubExchange) ||
            userStore.token
        ) {
            userStore.setUser();
            await userStore.validateUser();
            await userStore.refreshBalance();
        } else {
            await userStore.refreshBalance();
        }
    } catch (error) {}
});
