export type TodoId = string;
export type NoteId = string;

export interface Todo {
  id: TodoId;
  text: string;
  completed: boolean;
}

export interface Note {
  id: NoteId;
  title: string;
  todos: Todo[];
  createdAt: string; // ISO-строка даты
  updatedAt: string; // ISO-строка даты
}
