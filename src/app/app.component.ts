import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoAppComponent } from './components/todo-app/todo-app.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, TodoAppComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'todo-app';
}
