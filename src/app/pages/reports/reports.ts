
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { ExpenseService, CategorySummary } from '../../services/expense';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [Sidebar, CurrencyPipe, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  totalExpenses = 0;
  monthlyExpenses = 0;
  totalTransactions = 0;
  highestSpendingCategory = '--';

  categorySummary: CategorySummary[] = [];
  monthlySpending: [number, number][] = [];

  currentYear = new Date().getFullYear();

  startDate = '';
  endDate = '';

  selectedYear = new Date().getFullYear();

  years: number[] = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index
  );

  ngOnInit(): void {
    this.loadReportData();
  }


  loadReportData(): void {

    this.expenseService.getTotalExpenses().subscribe({
      next: (data) => {
        this.totalExpenses = data;
        console.log('Total expenses:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading total expenses:', error)
    });

    this.expenseService.getMonthlyExpenses().subscribe({
      next: (data) => {
        this.monthlyExpenses = data;
        console.log('Monthly expenses:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading monthly expenses:', error)
    });

    this.expenseService.getTotalTransactions().subscribe({
      next: (data) => {
        this.totalTransactions = data;
        console.log('Total transactions:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading transactions:', error)
    });

    this.expenseService.getHighestSpendingCategory().subscribe({
      next: (data) => {
        this.highestSpendingCategory = data || '--';
        console.log('Highest category:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading highest category:', error)
    });

    const today = new Date();

    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toLocaleDateString('en-CA');

    const endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).toLocaleDateString('en-CA');

    this.expenseService.getCategorySummary(startDate, endDate).subscribe({
      next: (data) => {
        this.categorySummary = data;
        console.log('Category summary:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading category summary:', error)
    });

    this.expenseService.getMonthlySpending(this.currentYear).subscribe({
      next: (data) => {
        this.monthlySpending = data;
        console.log('Monthly spending:', data);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading monthly spending:', error)
    });
  }

  get averageMonthlyExpense(): number {
    const count = this.categorySummary.reduce(
      (total, item) => total + item.transactionCount,
      0
    );

    return count > 0 ? this.monthlyExpenses / count : 0;
  }

  get maxMonthlySpending(): number {
    return Math.max(
      ...this.monthlySpending.map(item => item[1]),
      1
    );
  }

  get maxCategorySpending(): number {
    return Math.max(
      ...this.categorySummary.map(item => item.totalAmount),
      1
    );
  }

  getMonthlyPercentage(amount: number): number {
    return (amount / this.maxMonthlySpending) * 100;
  }

  getCategoryPercentage(amount: number): number {
    return (amount / this.maxCategorySpending) * 100;
  }

  getMonthName(month: number): string {
    return new Date(this.currentYear, month - 1)
      .toLocaleString('en', { month: 'short' });
  }

  applyDateFilter(): void {

    if (!this.startDate || !this.endDate) {
      alert('Please select both start date and end date.');
      return;
    }

    if (this.startDate > this.endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.expenseService.getCategorySummary(
      this.startDate,
      this.endDate
    ).subscribe({
      next: (data) => {
        this.categorySummary = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error applying date filter:', error);
      }
    });
  }

  onYearChange(): void {

    this.expenseService.getMonthlySpending(this.selectedYear).subscribe({
        next: (data) => {
            this.monthlySpending = data;
            this.cdr.detectChanges();
        },
        error: (error) => {
            console.error('Error loading monthly spending:', error);
        }
    });
  }
}
