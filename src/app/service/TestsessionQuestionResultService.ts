import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestsessionQuestionResult } from '../models/testsessionQuestionResult';

@Injectable({
  providedIn: 'root'
})
export class TestsessionQuestionResultService {
  private apiUrl = 'http://localhost:8080/api/testsession-question-results';

  constructor(private http: HttpClient) { }

  getAllTestsessionQuestionResults(): Observable<TestsessionQuestionResult[]> {
    return this.http.get<TestsessionQuestionResult[]>(this.apiUrl);
  }

  getTestsessionQuestionResultById(id: number): Observable<TestsessionQuestionResult> {
    return this.http.get<TestsessionQuestionResult>(`${this.apiUrl}/${id}`);
  }

  createTestsessionQuestionResult(testSessionQuestionResult: TestsessionQuestionResult): Observable<TestsessionQuestionResult> {
    return this.http.post<TestsessionQuestionResult>(this.apiUrl, testSessionQuestionResult);
  }

  updateTestsessionQuestionResult(id: number, testSessionQuestionResult: TestsessionQuestionResult): Observable<TestsessionQuestionResult> {
    return this.http.put<TestsessionQuestionResult>(`${this.apiUrl}/${id}`, testSessionQuestionResult);
  }

  deleteTestsessionQuestionResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getQuestionResultsByTestsessionResultId(id: number): Observable<TestsessionQuestionResult[]> {
    return this.http.get<TestsessionQuestionResult[]>(`${this.apiUrl}/testsession-result/${id}`);
  }
  
}
