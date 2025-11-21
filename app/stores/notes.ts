import { defineStore } from "pinia";
import type { Note, NoteId, Todo } from "~/types/notes";

const STORAGE_KEY = "nuxt-notes-app:notes";

interface NotesState {
  notes: Note[];
  initialized: boolean;
}

export const useNotesStore = defineStore("notes", {
  state: (): NotesState => ({
    notes: [],
    initialized: false,
  }),

  getters: {
    getNoteById: (state) => {
      return (id: NoteId): Note | undefined =>
        state.notes.find((note) => note.id === id);
    },
  },

  actions: {
    loadFromStorage() {
      if (!import.meta.client) return;
      if (this.initialized) return;

      this.initialized = true;

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      try {
        const parsed = JSON.parse(raw) as Note[];
        if (Array.isArray(parsed)) {
          this.notes = parsed.map((note) => ({
            ...note,
            todos: Array.isArray(note.todos) ? note.todos : [],
          }));
        }
      } catch (error) {
        console.error("Failed to parse notes from storage", error);
      }
    },

    saveToStorage() {
      if (!import.meta.client) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    },

    createNote(payload: { title: string; todos?: Todo[] }): NoteId {
      const now = new Date().toISOString();
      const id = Date.now().toString(); // для тестового этого достаточно

      const newNote: Note = {
        id,
        title: payload.title,
        todos: payload.todos ?? [],
        createdAt: now,
        updatedAt: now,
      };

      this.notes.push(newNote);
      this.saveToStorage();

      return id;
    },

    updateNote(updated: Note) {
      const index = this.notes.findIndex((note) => note.id === updated.id);
      if (index === -1) return;

      this.notes[index] = {
        ...updated,
        updatedAt: new Date().toISOString(),
      };

      this.saveToStorage();
    },

    deleteNote(id: NoteId) {
      this.notes = this.notes.filter((note) => note.id !== id);
      this.saveToStorage();
    },
  },
});
