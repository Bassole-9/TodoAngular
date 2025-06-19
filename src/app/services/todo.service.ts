import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$: Observable<Todo[]> = this.todosSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.todos.push(newTodo);
    this.updateTodos();
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.updateTodos();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.updateTodos();
  }

  updateTodo(id: number, title: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.title = title.trim();
      this.updateTodos();
    }
  }

  getCompletedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  getPendingCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed);
    this.updateTodos();
  }

  private updateTodos(): void {
    this.todosSubject.next([...this.todos]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (this.isBrowser()) {
      localStorage.setItem('angular-todos', JSON.stringify(this.todos));
    }
  }

  private loadFromStorage(): void {
    if (this.isBrowser()) {
      const stored = localStorage.getItem('angular-todos');
      if (stored) {
        this.todos = JSON.parse(stored);
        this.updateTodos();
      }
    } else {
      console.warn('localStorage is not available in this environment.');
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
