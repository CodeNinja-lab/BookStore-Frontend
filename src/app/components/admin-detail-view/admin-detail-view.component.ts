import { Component, output } from '@angular/core';

@Component({
  selector: 'app-admin-detail-view',
  imports: [],
  templateUrl: './admin-detail-view.component.html',
  styleUrl: './admin-detail-view.component.css',
})
export class AdminDetailViewComponent {
  close = output<boolean>();

  onClose() {
    this.close.emit(true);
  }
}
