
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import { Component, OnInit, inject } from '@angular/core';
// import { CurrencyPipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private router = inject(Router);

  private expenseService = inject(ExpenseService);

  userName = 'User';
  expenses: Expense[] = [];
  totalExpenses = 0;
  monthlyExpenses = 0;
  totalTransaction = 0;
  highestSpendingCategory = '—';
  monthlySpending: { month: number; amount: number }[] = [
    { month: 1, amount: 0 },
    { month: 2, amount: 0 },
    { month: 3, amount: 0 },
    { month: 4, amount: 0 },
    { month: 5, amount: 0 },
    { month: 6, amount: 0 },
    { month: 7, amount: 0 },
    { month: 8, amount: 0 },
    { month: 9, amount: 0 },
    { month: 10, amount: 0 },
    { month: 11, amount: 0 },
    { month: 12, amount: 0 }
  ];
  currentYear = new Date().getFullYear();

  // get totalExpenses(): number {
  //   return this.expenses.reduce(
  //     (total, expense) => total + expense.amount,
  //     0
  //   );
  // }

  get recentExpenses(): Expense[] {
    return [...this.expenses]
      .sort((a, b) =>
        new Date(b.expenseDate).getTime() -
        new Date(a.expenseDate).getTime()
      )
      .slice(0, 5);
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  getBarHeight(amount: number): number {
    const maxAmount = Math.max(
      ...this.monthlySpending.map(item => item.amount),
      0
    );

    if (maxAmount === 0) {
      return 0;
    }

    return (amount / maxAmount) * 100;
  }

  ngOnInit(): void {
    this.userName = this.auth.getUser()?.name ?? 'User';
    this.expenseService.getRecentExpenses().subscribe({
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

    this.expenseService.getTotalExpenses().subscribe({
      next: (total) => {
        this.totalExpenses = total;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching total expenses: ', error);
      }
    });
    this.expenseService.getMonthlyExpenses().subscribe({
      next: (total) => {
        this.monthlyExpenses = total;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching monthly expenses:', error);
      }
    });
    this.expenseService.getTotalTransactions().subscribe({
      next: (total) => {
        this.totalTransaction = total;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching total transactions:', error);
      }
    });
    this.expenseService.getHighestSpendingCategory().subscribe({
      next: (category) => {
        this.highestSpendingCategory = category;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching highest spending category:', error);
      }
    });
    this.expenseService.getMonthlySpending(this.currentYear).subscribe({
      next: (data) => {
        this.monthlySpending = this.monthlySpending.map((item) => {
          const matchingMonth = data.find(([month]) => month === item.month);

          return {
            ...item,
            amount: matchingMonth ? matchingMonth[1] : 0
          };
        });

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching monthly spending:', error);
      }
    });

  }


}
