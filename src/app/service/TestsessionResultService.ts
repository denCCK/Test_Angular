import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestsessionResult } from '../models/testsessionResult';

@Injectable({
  providedIn: 'root'
})
export class TestsessionResultService {
  //private apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsession-results';
  private apiUrl = 'http://localhost:8080/api/testsession-results';

  constructor(private http: HttpClient) { }

  getAllTestsessionResults(): Observable<TestsessionResult[]> {
    return this.http.get<TestsessionResult[]>(this.apiUrl);
  }

  getTestsessionResultById(id: number): Observable<TestsessionResult> {
    return this.http.get<TestsessionResult>(`${this.apiUrl}/${id}`);
  }

  createTestsessionResult(testSessionResult: TestsessionResult): Observable<TestsessionResult> {
    return this.http.post<TestsessionResult>(this.apiUrl, testSessionResult);
  }

  updateTestsessionResult(id: number, testSessionResult: TestsessionResult): Observable<TestsessionResult> {
    return this.http.put<TestsessionResult>(`${this.apiUrl}/${id}`, testSessionResult);
  }

  deleteTestsessionResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTestsessionResultsByTestsessionId(id: number): Observable<TestsessionResult[]> {
    return this.http.get<TestsessionResult[]>(`${this.apiUrl}/testsession/${id}`);
  }

}
