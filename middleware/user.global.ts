import { useUserStore } from "~/stores/telegram";

export default defineNuxtRouteMiddleware(async () => {
  const { setTestUser } = useUserStore();
  try {
    setTestUser();
  } catch (error) {}

});
