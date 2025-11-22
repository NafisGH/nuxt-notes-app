const isVisible = ref(false);
const message = ref("");
let timeoutId: number | null = null;

export function useToast() {
  const showToast = (text: string, duration = 3000) => {
    message.value = text;
    isVisible.value = true;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      isVisible.value = false;
      timeoutId = null;
    }, duration);
  };

  return {
    isVisible,
    message,
    showToast,
  };
}
