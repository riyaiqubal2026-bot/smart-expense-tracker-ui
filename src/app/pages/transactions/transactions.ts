import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transactions',
imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink],  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {

  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  expenses: Expense[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  searchText = '';
  selectedCategory = '';
  startDate = '';
  endDate = '';
  showAddExpenseForm = false;

  newExpense: Expense = {
    title: '',
    category: '',
    amount: 0,
    expenseDate: '',
    userId: null
  };

  editingExpenseId: number | null = null;
  editedExpense: Expense | null = null;

  ngOnInit(): void {
    this.loadExpenses();
  }
  loadExpenses(): void {
    this.expenseService.searchExpenses(
      this.currentPage,
      this.pageSize,
      this.searchText,
      this.selectedCategory,
      this.startDate,
      this.endDate
    ).subscribe({
      next: (data) => {
        this.expenses = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching expenses:', error);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadExpenses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadExpenses();
    }
  }
  get filteredExpenses(): Expense[] {
    return this.expenses;
}

  categories: string[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other'
  ];

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadExpenses();
  }

  openAddExpenseForm(): void {
    this.newExpense = {
      title: '',
      category: '',
      amount: 0,
      expenseDate: '',
      userId: null
    };

    this.showAddExpenseForm = true;
  }

  closeAddExpenseForm(): void {
    this.showAddExpenseForm = false;
  }

  saveExpense(): void {

    const request = this.editingExpenseId !== null
      ? this.expenseService.updateExpense(
        this.editingExpenseId,
        this.newExpense
      )
      : this.expenseService.addExpense(this.newExpense);

    request.subscribe({
      next: () => {
        this.closeAddExpenseForm();
        this.editingExpenseId = null;
        this.currentPage = 0;
        this.loadExpenses();
      },
      error: (error) => {
        console.error('Error saving expense:', error);
        alert('Unable to save expense. Please try again.');
      }
    });
  }


  startEditing(expense: Expense): void {
    this.editingExpenseId = expense.id!;

    this.editedExpense = {
      ...expense
    };
  }

  cancelEditing(): void {
    this.editingExpenseId = null;
    this.editedExpense = null;
  }

  saveEditedExpense(): void {
    if (this.editingExpenseId === null || !this.editedExpense) {
      return;
    }

    this.expenseService.updateExpense(
      this.editingExpenseId,
      this.editedExpense
    ).subscribe({
      next: () => {
        this.cancelEditing();
        this.loadExpenses();
      },
      error: (error) => {
        console.error('Error updating expense:', error);
        alert('Unable to update expense. Please try again.');
      }
    });
  }

  deleteExpense(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) {
      return;
    }

    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.loadExpenses();
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
        alert('Unable to delete expense. Please try again.');
      }
    });
  }

}