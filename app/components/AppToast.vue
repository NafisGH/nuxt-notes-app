<script setup lang="ts">
const { isVisible, message } = useToast();
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="app-toast">
      {{ message }}
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.app-toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 10px 16px;
  border-radius: 999px;
  background-color: #111827;
  color: #f9fafb;
  font-size: 0.9rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.4);
  z-index: 50;
}
</style>
