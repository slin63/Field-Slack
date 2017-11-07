import { Injectable } from '@angular/core';

@Injectable()
export class LocalService {
  constructor() {}
  
  localStorageItem(id: string): string {
      return localStorage.getItem(id);
  }
}
