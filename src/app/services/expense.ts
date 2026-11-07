import { Injectable, inject } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import{ Observable } from 'rxjs';


export interface Expense{
    id?:number;
    title:string;
    category:string;
    amount:number;
    expenseDate:string;
    userId:number | null;
}

@Injectable({
    providedIn:'root'
})

export class ExpenseService {
    private http=inject(HttpClient);
        
    private apiUrl='http://localhost:8081/api/expenses';
    getAllExpenses():Observable<{content :Expense[]}>{
        return this.http.get<{ content :Expense[]}>(
            `${this.apiUrl}/fetchAllExpenses?page=0&size=100`
        );
    }
}
