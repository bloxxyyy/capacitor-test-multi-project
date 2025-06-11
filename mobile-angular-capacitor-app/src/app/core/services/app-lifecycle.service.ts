import { Injectable } from '@angular/core';
import { App, AppState } from '@capacitor/app';
import { BehaviorSubject } from 'rxjs';

export type AppLifecycleEvent = 'startup' | 'foreground' | 'background';

@Injectable({
  providedIn: 'root'
})
export class AppLifecycleService {
  private lifecycleSubject = new BehaviorSubject<AppLifecycleEvent>('startup');
  lifecycle$ = this.lifecycleSubject.asObservable();

  constructor() {
    this.registerListeners();
  }

  private registerListeners() {
    App.getLaunchUrl().then(() => {
      this.lifecycleSubject.next('startup');
    });

    App.addListener('appStateChange', (state: AppState) => {
      this.lifecycleSubject.next(state.isActive ? 'foreground' : 'background');
    });
  }
}
