import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, ToastModule]
})
export class App {
  protected readonly title = signal('Mr Streaming');
}
