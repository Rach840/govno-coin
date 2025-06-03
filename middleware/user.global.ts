import { useUserStore } from "~/stores/useUserStore";

export default defineNuxtRouteMiddleware(async () => {
    const {
        user,
        toRubExchange,
        token,
        setUser,
        setTestUser,
        validateUser,
        refreshBalance,
    } = useUserStore();

    try {
        if ((!user && !token && !toRubExchange) || token) {
            setUser();
            await validateUser();
            await refreshBalance();
        } else {
            await refreshBalance();
        }
    } catch (error) {}
});
