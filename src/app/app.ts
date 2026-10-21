import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user-component/user-component';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('userHub');
}
