import { Component } from '@angular/core';

@Component({
  selector: 'app-no-page',
  imports: [],
  template: `
    <div class="no-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  `,
  styles: [`
    .no-page {
      text-align: center;
      margin-top: 50px;
    }
    .no-page h1 {
      font-size: 2em;
      color: #ff0000;
    }
    .no-page p {
      font-size: 1.2em;
    }
  `]
})
export class NoPageComponent { }
