import { Component, effect, inject, signal } from '@angular/core';
import { Message } from '../../types/Others';
import { ToastService } from '../../services/helper/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  toastService = inject(ToastService);
  message = signal<Message>({ text: '', type: null });
  render = signal(false);

  constructor() {
    this.toastService
      .getMessage()
      .subscribe((message) => this.message.set(message));

    effect(() => {
      this.render.set(
        this.message().text.trim().length > 0 && this.message().type !== null,
      );
    });

    effect(() => {
      if (this.render()) {
        setTimeout(() => {
          this.toastService.setMessage({ text: '', type: null });
        }, 3000);
      }
    });
  }
}
