import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  newTodoTitle = '';
  editingTodo: number | null = null;
  editingTitle = '';
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  completedCount = 0;
  pendingCount = 0;

  filters = [
    { value: 'all' as const, label: 'Toutes' },
    { value: 'pending' as const, label: 'En cours' },
    { value: 'completed' as const, label: 'Terminées' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.todos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(todos => {
        this.todos = todos;
        this.completedCount = this.todoService.getCompletedCount();
        this.pendingCount = this.todoService.getPendingCount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle);
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.todoService.deleteTodo(id);
    }
  }

  startEdit(todo: Todo): void {
    this.editingTodo = todo.id;
    this.editingTitle = todo.title;

    // Focus automatique sur l'input d'édition
    setTimeout(() => {
      const input = document.querySelector('.edit-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  saveEdit(id: number): void {
    if (this.editingTitle.trim()) {
      this.todoService.updateTodo(id, this.editingTitle);
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingTodo = null;
    this.editingTitle = '';
  }

  clearCompleted(): void {
    if (confirm(`Supprimer les ${this.completedCount} tâches terminées ?`)) {
      this.todoService.clearCompleted();
    }
  }

  getFilteredTodos(): Todo[] {
    switch (this.currentFilter) {
      case 'pending':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  trackByTodo(index: number, todo: Todo): number {
    return todo.id;
  }
}
