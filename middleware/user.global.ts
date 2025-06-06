import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore();
    const cacheStore = useCacheStore();

    try {
        console.log(cacheStore.news);
        if (
            (!userStore.user && !userStore.token && !userStore.toRubExchange) ||
            userStore.token
        ) {
            userStore.setUser();
            await userStore.validateUser();
            await userStore.refreshBalance();
        } else {
            cacheStore.cacheNews();
            cacheStore.exchangeCache();
        }
    } catch (error) {}
});
