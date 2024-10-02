import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: 'replace', icon: 'search' },
    { title: 'AMA Search', url: 'replace', icon: 'search' },
    { title: 'Track Finder', url: 'replace', icon: 'locate' },
    { title: 'Favorite Tracks', url: 'replace', icon: 'star' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
