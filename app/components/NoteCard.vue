<script setup lang="ts">
import type { Note } from "~/types/notes";

const props = defineProps<{
  note: Note;
}>();

const emit = defineEmits<{
  (e: "open", id: string): void;
  (e: "delete", id: string): void;
}>();

const previewTodos = computed(() => props.note.todos.slice(0, 3));
const hiddenCount = computed(() =>
  Math.max(0, props.note.todos.length - previewTodos.value.length)
);

const handleOpen = () => {
  emit("open", props.note.id);
};

const handleDeleteClick = () => {
  emit("delete", props.note.id);
};
</script>

<template>
  <article class="note-card">
    <header class="note-card__header">
      <h2 class="note-card__title">
        {{ note.title || "Без названия" }}
      </h2>
    </header>

    <ul v-if="note.todos.length" class="note-card__todos">
      <li v-for="todo in previewTodos" :key="todo.id" class="note-card__todo">
        <span
          class="note-card__todo-text"
          :class="{ 'note-card__todo-text--completed': todo.completed }"
        >
          • {{ todo.text }}
        </span>
      </li>
      <li v-if="hiddenCount > 0" class="note-card__more">
        и ещё {{ hiddenCount }}&nbsp;{{
          hiddenCount === 1 ? "задача" : "задачи"
        }}
      </li>
    </ul>

    <p v-else class="note-card__empty">Нет задач</p>

    <footer class="note-card__footer">
      <button type="button" class="btn btn-secondary" @click="handleOpen">
        Открыть
      </button>
      <button
        type="button"
        class="btn btn-outline note-card__delete"
        @click="handleDeleteClick"
      >
        Удалить
      </button>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.note-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-card__title {
  font-size: 1.1rem;
  margin: 0;
}

.note-card__todos {
  list-style: none;
  padding: 0;
  margin: 0;
}

.note-card__todo {
  margin-bottom: 4px;
}

.note-card__todo-text {
  font-size: 0.95rem;
}

.note-card__todo-text--completed {
  text-decoration: line-through;
  opacity: 0.7;
}

.note-card__more {
  font-size: 0.85rem;
  color: #6b7280;
}

.note-card__empty {
  font-size: 0.9rem;
  color: #9ca3af;
}

.note-card__footer {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.note-card__delete {
  font-size: 0.85rem;
}
</style>
