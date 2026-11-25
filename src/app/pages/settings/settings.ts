import { Component ,OnInit} from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [Sidebar, FormsModule],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
  standalone: true,

})
export class Settings implements OnInit{
  currency = 'AUD';
  theme = 'light';
  budgetAlerts = false;
  monthlySummary = false;

  ngOnInit(): void {
    this.loadSettings();
    this.applyTheme();
  }
  


  saveSettings(): void {

    const settings = {
      currency: this.currency,
      theme: this.theme,
      budgetAlerts: this.budgetAlerts,
      monthlySummary: this.monthlySummary
    };

    localStorage.setItem('smartSpendSettings', JSON.stringify(settings));
    this.applyTheme();

    alert('Settings saved successfully!');
  }

  loadSettings(): void {

    const savedSettings = localStorage.getItem('smartSpendSettings');

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      this.currency = settings.currency ?? 'AUD';
      this.theme = settings.theme ?? 'light';
      this.budgetAlerts = settings.budgetAlerts ?? false;
      this.monthlySummary = settings.monthlySummary ?? false;
    }
  }

  applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

}
