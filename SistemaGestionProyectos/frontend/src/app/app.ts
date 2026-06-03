import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastModule} from "primeng/toast";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [MessageService]
})
export class App {
}
