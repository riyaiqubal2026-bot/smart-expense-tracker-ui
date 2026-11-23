import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Expense {
    id?: number;
    title: string;
    category: string;
    amount: number;
    expenseDate: string;
    userId: number | null;
}
export interface CategorySummary {
    category: string;
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
}

@Injectable({
    providedIn: 'root'
})

export class ExpenseService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:8081/api/expenses';
    getAllExpenses(
        page: number,
        size: number
    ): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/fetchAllExpenses?page=${page}&size=${size}&sort=expenseDate,desc`
        );
    }

    searchExpenses(
        page: number,
        size: number,
        title: string,
        category: string,
        startDate: string,
        endDate: string
    ): Observable<any> {

        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sort', 'expenseDate,desc');

        if (title.trim()) {
            params = params.set('title', title.trim());
        }

        if (category) {
            params = params.set('category', category);
        }

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<any>(
            `${this.apiUrl}/search`,
            { params }
        );
    }

    addExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(
            `${this.apiUrl}/saveExpense`,
            expense
        );
    }

    updateExpense(id: number, expense: Expense): Observable<Expense> {
        return this.http.put<Expense>(
            `${this.apiUrl}/updateExpense/${id}`,
            expense
        );
    }

    deleteExpense(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/deleteExpense/${id}`
        );
    }

    getRecentExpenses(): Observable<{ content: Expense[] }> {
        return this.http.get<{ content: Expense[] }>(
            `${this.apiUrl}/fetchAllExpenses?page=0&size=5&sort=expenseDate,desc`
        );
    }

    getTotalExpenses(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/total`
        );
    }

    getMonthlyExpenses(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/monthly-total`
        );
    }

    getTotalTransactions(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/total-transaction`
        );
    }

    getHighestSpendingCategory(): Observable<string> {
        return this.http.get(
            `${this.apiUrl}/highest-spending-category`,
            { responseType: 'text' }
        );
    }

    getMonthlySpending(year: number): Observable<[number, number][]> {
        return this.http.get<[number, number][]>(
            `${this.apiUrl}/monthly-spending?year=${year}`
        );
    }

    getCategorySummary(
        startDate: string,
        endDate: string
    ): Observable<CategorySummary[]> {

        let params = new HttpParams();

        if (startDate) {
            params = params.set('startDate', startDate);
        }

        if (endDate) {
            params = params.set('endDate', endDate);
        }

        return this.http.get<CategorySummary[]>(
            `${this.apiUrl}/category-summary`,
            { params }
        );
    }
}
