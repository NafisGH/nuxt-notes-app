<!-- app/pages/notes/[id].vue -->
<script setup lang="ts">
import type { Note, Todo } from "~/types/notes";

const route = useRoute();
const notesStore = useNotesStore();

const isNew = computed(() => route.params.id === "new");

interface EditableNote {
  id: string | null;
  title: string;
  todos: Todo[];
}

const draft = ref<EditableNote | null>(null);
const originalNote = ref<Note | null>(null);
const isLoading = ref(true);

const isCancelModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const createEmptyEditableNote = (): EditableNote => ({
  id: null,
  title: "",
  todos: [],
});

const toEditable = (note: Note): EditableNote => ({
  id: note.id,
  title: note.title,
  todos: note.todos.map((t) => ({ ...t })),
});

onMounted(() => {
  notesStore.loadFromStorage();

  if (isNew.value) {
    draft.value = createEmptyEditableNote();
    isLoading.value = false;
    return;
  }

  const id = String(route.params.id);
  const existing = notesStore.getNoteById(id);

  if (!existing) {
    navigateTo("/");
    return;
  }

  originalNote.value = existing;
  draft.value = toEditable(existing);
  isLoading.value = false;
});

const addTodo = () => {
  if (!draft.value) return;
  const id = Date.now().toString() + Math.random().toString(16).slice(2);
  const newTodo: Todo = {
    id,
    text: "",
    completed: false,
  };
  draft.value.todos.push(newTodo);
};

const updateTodoText = (id: string, text: string) => {
  if (!draft.value) return;
  const todo = draft.value.todos.find((t) => t.id === id);
  if (todo) todo.text = text;
};

const toggleTodo = (id: string) => {
  if (!draft.value) return;
  const todo = draft.value.todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
};

const removeTodo = (id: string) => {
  if (!draft.value) return;
  draft.value.todos = draft.value.todos.filter((t) => t.id !== id);
};

const handleSave = () => {
  if (!draft.value) return;
  const title = draft.value.title.trim();

  if (isNew.value) {
    const newId = notesStore.createNote({
      title: title || "Без названия",
      todos: draft.value.todos,
    });
    navigateTo(`/notes/${newId}`);
    return;
  }

  if (!originalNote.value) return;

  const updated: Note = {
    ...originalNote.value,
    title: title || "Без названия",
    todos: draft.value.todos,
  };

  notesStore.updateNote(updated);
};

const handleCancelClick = () => {
  isCancelModalOpen.value = true;
};

const confirmCancel = () => {
  isCancelModalOpen.value = false;
  navigateTo("/");
};

const handleDeleteClick = () => {
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  isDeleteModalOpen.value = false;

  if (!isNew.value && originalNote.value) {
    notesStore.deleteNote(originalNote.value.id);
  }

  navigateTo("/");
};
</script>

<template>
  <section v-if="!isLoading && draft" class="note-edit-page">
    <header class="note-edit-page__header">
      <h1>
        {{ isNew ? "Новая заметка" : "Редактирование заметки" }}
      </h1>

      <div class="note-edit-page__actions">
        <button
          type="button"
          class="btn btn-outline"
          @click="handleCancelClick"
        >
          Отменить
        </button>
        <button
          v-if="!isNew"
          type="button"
          class="btn btn-secondary"
          @click="handleDeleteClick"
        >
          Удалить
        </button>
        <button type="button" class="btn btn-primary" @click="handleSave">
          Сохранить
        </button>
      </div>
    </header>

    <div class="note-edit-page__content">
      <div class="note-edit-page__field">
        <label for="note-title" class="note-edit-page__label">
          Заголовок
        </label>
        <input
          id="note-title"
          v-model="draft.title"
          type="text"
          class="note-edit-page__input"
          placeholder="Введите заголовок"
        />
      </div>

      <div class="note-edit-page__todos">
        <div class="note-edit-page__todos-header">
          <h2>Список задач</h2>
          <button type="button" class="btn btn-secondary" @click="addTodo">
            Добавить задачу
          </button>
        </div>

        <div
          v-if="draft.todos.length === 0"
          class="note-edit-page__todos-empty"
        >
          Пока нет задач. Добавьте первую.
        </div>

        <ul v-else class="note-edit-page__todos-list">
          <li
            v-for="todo in draft.todos"
            :key="todo.id"
            class="note-edit-page__todo-row"
          >
            <input
              type="checkbox"
              class="note-edit-page__todo-checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
            />

            <input
              type="text"
              class="note-edit-page__todo-input"
              :value="todo.text"
              placeholder="Текст задачи"
              @input="
                updateTodoText(
                  todo.id,
                  ($event.target as HTMLInputElement).value
                )
              "
            />

            <button
              type="button"
              class="note-edit-page__todo-delete"
              @click="removeTodo(todo.id)"
            >
              ✕
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Модалка отмены редактирования -->
    <BaseModal
      :open="isCancelModalOpen"
      title="Отменить редактирование?"
      @close="isCancelModalOpen = false"
    >
      <p>Несохранённые изменения будут потеряны.</p>

      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="isCancelModalOpen = false"
        >
          Остаться
        </button>
        <button type="button" class="btn btn-primary" @click="confirmCancel">
          Отменить
        </button>
      </template>
    </BaseModal>

    <!-- Модалка удаления -->
    <BaseModal
      :open="isDeleteModalOpen"
      title="Удалить заметку?"
      @close="isDeleteModalOpen = false"
    >
      <p>Действие необратимо. Заметка будет удалена.</p>

      <template #footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="isDeleteModalOpen = false"
        >
          Отмена
        </button>
        <button type="button" class="btn btn-primary" @click="confirmDelete">
          Удалить
        </button>
      </template>
    </BaseModal>
  </section>

  <section v-else class="note-edit-page__loading">Загрузка...</section>
</template>
