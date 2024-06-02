import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test } from '../models/test';
import {Question} from "../models/question";

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api/tests';

  constructor(private http: HttpClient) { }

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.apiUrl);
  }

  getTestById(id: number): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/${id}`);
  }

  createTest(test: Test): Observable<Test> {
    return this.http.post<Test>(this.apiUrl, test);
  }

  deleteTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTest(id: number, test: Test): Observable<Test> {
    return this.http.put<Test>(`${this.apiUrl}/${id}`, test);
  }
}
