import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService, Budget, BudgetRequest } from '../../services/budget.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css'
})
export class Budgets implements OnInit {

  private budgetService = inject(BudgetService);
  private cdr = inject(ChangeDetectorRef);

  budgets: Budget[] = [];

  loading = false;
  errorMessage = '';

  selectedMonth = this.getCurrentMonth();

  totalBudget = 0;
  totalSpent = 0;
  remainingBudget = 0;
  showForm = false;
  saving = false;

  categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other'
  ];

  newBudgetCategory = '';
  newBudgetAmount: number | null = null;

  ngOnInit(): void {
    this.loadBudgets();
  }

  getCurrentMonth(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-01`;
  }

  loadBudgets(): void {

    this.loading = true;
    this.errorMessage = '';

    this.budgetService.getBudgets(this.selectedMonth).subscribe({

      next: (data) => {

        console.log('Budget API response:', data);

        this.budgets = data;
        this.calculateSummary();

        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('Error loading budgets:', error);

        this.errorMessage = 'Unable to load budgets. Please try again.';

        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }

  calculateSummary(): void {

    this.totalBudget = this.budgets.reduce(
      (total, budget) => total + budget.budgetAmount,
      0
    );

    this.totalSpent = this.budgets.reduce(
      (total, budget) => total + budget.totalSpent,
      0
    );

    this.remainingBudget = this.totalBudget - this.totalSpent;
  }

  getProgressColor(percentage: number): string {

    if (percentage >= 100) {
      return 'red';
    }

    if (percentage >= 80) {
      return 'orange';
    }

    return 'green';
  }

  openBudgetForm(): void {
    this.showForm = true;
    this.errorMessage = '';
  }

  closeBudgetForm(): void {
    this.showForm = false;
    this.newBudgetCategory = '';
    this.newBudgetAmount = null;
    this.errorMessage = '';
  }

  saveBudget(): void {

    if (!this.newBudgetCategory || !this.newBudgetAmount || this.newBudgetAmount <= 0) {
      this.errorMessage = 'Please select a category and enter a valid budget amount.';
      return;
    }

    const request: BudgetRequest = {
      category: this.newBudgetCategory,
      budgetAmount: this.newBudgetAmount,
      budgetMonth: this.selectedMonth
    };

    this.saving = true;
    this.errorMessage = '';

    this.budgetService.addBudget(request).subscribe({

      next: () => {
        this.saving = false;
        this.closeBudgetForm();
        this.loadBudgets();
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error creating budget:', error);

        this.errorMessage =
          error.error?.message || 'Unable to create budget. Please try again.';

        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }
}
