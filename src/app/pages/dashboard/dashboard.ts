
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private expenseService = inject(ExpenseService);

  expenses: Expense[] = [];

  get totalExpenses(): number {
    return this.expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  get recentExpenses(): Expense[] {
    return [...this.expenses]
      .sort((a, b) =>
        new Date(b.expenseDate).getTime() -
        new Date(a.expenseDate).getTime()
      )
      .slice(0, 5);
  }

  ngOnInit(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        console.log('Full API response:', data);
        console.log('Expense content:', data.content);

        this.expenses = data.content;
        this.cdr.detectChanges();

        console.log('Total expenses:', this.totalExpenses);
      },
      error: (error) => {
        console.error('Error fetching expenses:', error);
      }
    });
  }
}
