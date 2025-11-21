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
      />
    </div>
  </section>
</template>
