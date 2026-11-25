
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  ngOnInit(): void {
    const savedSettings = localStorage.getItem('smartSpendSettings');

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const theme = settings.theme ?? 'light';

      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
