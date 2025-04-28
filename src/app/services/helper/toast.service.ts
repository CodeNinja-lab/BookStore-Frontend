import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../types/Others';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private message: Message = { text: '', type: null };
  private subj = new BehaviorSubject<Message>(this.message);

  constructor() { }

  getMessage(): Observable<Message> {
    return this.subj.asObservable();
  }

  setMessage(message: Message) {
    this.message = message;
    this.subj.next(this.message);
  }
}
