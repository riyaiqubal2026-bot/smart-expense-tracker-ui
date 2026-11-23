import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ExpenseService,
  CategorySummary
} from '../../services/expense';

@Component({
  selector: 'app-categories',
  imports: [CurrencyPipe, DecimalPipe, FormsModule,RouterLink], templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {

  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  categoryNames: string[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other'
  ];

  categorySummaries: CategorySummary[] = [];

  selectedPeriod = 'thisMonth';

  customStartDate = '';
  customEndDate = '';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSummary();
  }

  get totalSpent(): number {
    return this.categorySummaries.reduce(
      (total, item) => total + item.totalAmount,
      0
    );
  }

  get totalTransactions(): number {
    return this.categorySummaries.reduce(
      (total, item) => total + item.transactionCount,
      0
    );
  }

  get categoriesUsed(): number {
    return this.categorySummaries.filter(
      item => item.totalAmount > 0
    ).length;
  }

  getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadSummary(): void {

    const today = new Date();

    let startDate = '';
    let endDate = '';

    if (this.selectedPeriod === 'thisMonth') {

      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      startDate = this.getDateString(start);
      endDate = this.getDateString(end);

    } else if (this.selectedPeriod === 'lastMonth') {

      const start = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );

      startDate = this.getDateString(start);
      endDate = this.getDateString(end);

    } else if (this.selectedPeriod === 'thisYear') {

      const start = new Date(
        today.getFullYear(),
        0,
        1
      );

      const end = new Date(
        today.getFullYear(),
        11,
        31
      );

      startDate = this.getDateString(start);
      endDate = this.getDateString(end);

    } else if (this.selectedPeriod === 'custom') {

      if (!this.customStartDate || !this.customEndDate) {
        return;
      }

      if (this.customStartDate > this.customEndDate) {
        this.errorMessage = 'Start date cannot be after end date.';
        return;
      }

      startDate = this.customStartDate;
      endDate = this.customEndDate;
    }

    this.loading = true;
    this.errorMessage = '';

    this.expenseService.getCategorySummary(
      startDate,
      endDate
    ).subscribe({

      next: (data) => {

        this.categorySummaries = this.categoryNames.map(
          category => {

            const existing = data.find(
              item => item.category.toLowerCase() ===
                category.toLowerCase()
            );

            return existing ?? {
              category: category,
              totalAmount: 0,
              transactionCount: 0,
              averageAmount: 0
            };
          }
        );

        this.categorySummaries.sort(
          (a, b) => b.totalAmount - a.totalAmount
        );

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error(
          'Error loading category summary:',
          error
        );

        this.errorMessage =
          'Unable to load category information. Please try again.';

        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onPeriodChange(): void {
    this.errorMessage = '';

    if (this.selectedPeriod !== 'custom') {
      this.loadSummary();
    }
  }

  onCustomDateChange(): void {
    if (this.customStartDate && this.customEndDate) {
      this.loadSummary();
    }
  }

  getPercentage(amount: number): number {
    if (this.totalSpent === 0) {
      return 0;
    }

    return (amount / this.totalSpent) * 100;
  }

  getBarWidth(amount: number): number {
    return this.getPercentage(amount);
  }
}