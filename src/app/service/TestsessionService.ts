import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Testsession} from "../models/testsession";

@Injectable({
  providedIn: 'root'
})
export class TestsessionService {
  //private apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsessions';
  private apiUrl = 'http://localhost:8080/api/testsessions';

  constructor(private http: HttpClient) { }

  getAllTestsessions(): Observable<Testsession[]> {
    return this.http.get<Testsession[]>(this.apiUrl);
  }

  getTestsessionById(id: number): Observable<Testsession> {
    return this.http.get<Testsession>(`${this.apiUrl}/${id}`);
  }

  createTestsession(testSession: Testsession): Observable<Testsession> {
    return this.http.post<Testsession>(this.apiUrl, testSession);
  }

  updateTestsession(id: number, testSession: Testsession): Observable<Testsession> {
    return this.http.put<Testsession>(`${this.apiUrl}/${id}`, testSession);
  }

  deleteTestsession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
