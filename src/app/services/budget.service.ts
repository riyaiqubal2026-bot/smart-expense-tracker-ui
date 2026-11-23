
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Budget {
    id?: number;
    category: string;
    budgetAmount: number;
    budgetMonth: string;
    totalSpent: number;
    remainingAmount: number;
    percentageUsed: number;
}

export interface BudgetRequest {
    category: string;
    budgetAmount: number;
    budgetMonth: string;
}

@Injectable({
    providedIn: 'root'
})
export class BudgetService {

    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:8081/api/budgets';

    getBudgets(month: string): Observable<Budget[]> {
        return this.http.get<Budget[]>(
            `${this.apiUrl}?month=${month}`
        );
    }

    addBudget(budget: BudgetRequest): Observable<Budget> {
        return this.http.post<Budget>(
            this.apiUrl,
            budget
        );
    }

    updateBudget(
        id: number,
        budget: BudgetRequest
    ): Observable<Budget> {
        return this.http.put<Budget>(
            `${this.apiUrl}/${id}`,
            budget
        );
    }

    deleteBudget(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
