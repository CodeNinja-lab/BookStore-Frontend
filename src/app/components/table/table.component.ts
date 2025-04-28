import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  objects = input.required<any[]>();

  view = input.required<boolean>();
  update = input.required<boolean>();
  delete = input.required<boolean>();

  viewEvent = output<any>();
  updateEvent = output<any>();
  deleteEvent = output<any>();

  head = signal<string[]>([]);
  values = signal<any[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.head.set(Object.keys(this.objects()[0]));
    this.objects().map((value) => {
      this.values().push(Object.values(value !== null ? value : ''));
    });
  }

  getObjectFromArrays(keys: any[], values: any[]) {
    return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
  }

  onViewClick(obj: any) {
    this.viewEvent.emit(obj);
  }

  onUpdateClick(obj: any) {
    this.updateEvent.emit(obj);
  }

  onDeleteClick(obj: any) {
    this.deleteEvent.emit(obj);
  }
}
