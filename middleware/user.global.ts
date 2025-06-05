import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore();
    const cacheStore = useCacheStore();

    try {
        if (
            (!userStore.user && !userStore.token && !userStore.toRubExchange) ||
            userStore.token
        ) {
            userStore.setTestUser();
            await userStore.validateUser();
            await userStore.refreshBalance();
        } else if (cacheStore.news) {
            console.log("кеширует");
            cacheStore.cacheNews();
        } else {
            await userStore.refreshBalance();
        }
    } catch (error) {}
});
