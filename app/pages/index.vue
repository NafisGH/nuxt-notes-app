<script setup lang="ts">
definePageMeta({
  title: "Список заметок",
});

const notesStore = useNotesStore();

onMounted(() => {
  notesStore.loadFromStorage();
});

const notes = computed(() => notesStore.notes);

const handleCreate = () => {
  navigateTo("/notes/new");
};

const handleOpenNote = (id: string) => {
  navigateTo(`/notes/${id}`);
};

// удаление с подтверждением
const noteIdToDelete = ref<string | null>(null);
const isDeleteModalOpen = ref(false);

const noteTitleToDelete = computed(() => {
  if (!noteIdToDelete.value) return "эту заметку";
  const note = notesStore.getNoteById(noteIdToDelete.value);
  return note?.title || "эту заметку";
});

const handleAskDelete = (id: string) => {
  noteIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  noteIdToDelete.value = null;
};

const confirmDelete = () => {
  if (noteIdToDelete.value) {
    notesStore.deleteNote(noteIdToDelete.value);
  }
  isDeleteModalOpen.value = false;
  noteIdToDelete.value = null;
};
</script>

<template>
  <section class="notes-page">
    <header class="notes-page__header">
      <h1>Заметки</h1>

      <button type="button" class="btn btn-primary" @click="handleCreate">
        Создать заметку
      </button>
    </header>

    <div v-if="notes.length === 0" class="notes-page__empty">
      <p>Пока нет ни одной заметки.</p>
      <button type="button" class="btn btn-outline" @click="handleCreate">
        Создать первую заметку
      </button>
    </div>

    <div v-else class="notes-page__list">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @open="handleOpenNote"
        @delete="handleAskDelete"
      />
    </div>

    <!-- Модалка подтверждения удаления -->
    <BaseModal
      :open="isDeleteModalOpen"
      title="Удалить заметку?"
      @close="cancelDelete"
    >
      <p>Действие необратимо. Будет удалена {{ noteTitleToDelete }}.</p>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="cancelDelete">
          Отмена
        </button>
        <button type="button" class="btn btn-primary" @click="confirmDelete">
          Удалить
        </button>
      </template>
    </BaseModal>
  </section>
</template>
