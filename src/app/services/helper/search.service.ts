import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private word: string = '';
  private subj = new BehaviorSubject<string>(this.word);

  constructor() { }

  getSearchWord(): Observable<string> {
    return this.subj.asObservable();
  }

  setSearchWord(word: string) {
    this.word = word;
    this.subj.next(this.word);
  }
}
