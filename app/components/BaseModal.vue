<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    emit("close");
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal">
        <header class="modal__header">
          <h2 class="modal__title">
            {{ title }}
          </h2>
          <button type="button" class="modal__close" @click="emit('close')">
            ✕
          </button>
        </header>

        <div class="modal__body">
          <slot />
        </div>

        <footer class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px 16px 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.modal__title {
  margin: 0;
  font-size: 1.05rem;
}

.modal__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.modal__body {
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
