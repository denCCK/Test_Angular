import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestsessionAnswerResult } from '../models/testsessionAnswerResult';

@Injectable({
  providedIn: 'root'
})
export class TestsessionAnswerResultService {
  //private apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsession-answer-results';
  private apiUrl = 'http://localhost:8080/api/testsession-answer-results';

  constructor(private http: HttpClient) { }

  getAllTestsessionAnswerResults(): Observable<TestsessionAnswerResult[]> {
    return this.http.get<TestsessionAnswerResult[]>(this.apiUrl);
  }

  getTestsessionAnswerResultById(id: number): Observable<TestsessionAnswerResult> {
    return this.http.get<TestsessionAnswerResult>(`${this.apiUrl}/${id}`);
  }

  createTestsessionAnswerResult(testSessionAnswerResult: TestsessionAnswerResult): Observable<TestsessionAnswerResult> {
    return this.http.post<TestsessionAnswerResult>(this.apiUrl, testSessionAnswerResult);
  }

  updateTestsessionAnswerResult(id: number, testSessionAnswerResult: TestsessionAnswerResult): Observable<TestsessionAnswerResult> {
    return this.http.put<TestsessionAnswerResult>(`${this.apiUrl}/${id}`, testSessionAnswerResult);
  }

  deleteTestsessionAnswerResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAnswerResultsByTestsessionResultId(id: number): Observable<TestsessionAnswerResult[]> {
    return this.http.get<TestsessionAnswerResult[]>(`${this.apiUrl}/testsession-result/${id}`);
  }
}
