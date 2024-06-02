import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../models/grade';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = 'http://localhost:8080/api/grades';

  constructor(private http: HttpClient) { }

  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  getGradesByTestsessionId(testsessionId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/testsession/${testsessionId}`);
  }

  createGrade(grade: Grade): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteGradesByTestsessionId(testsessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testsession/${testsessionId}`);
  }

  updateGrade(id: number, grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade);
  }

  updateGradesByTestsessionId(testsessionId: number, grades: Grade[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/testsession/${testsessionId}`, grades);
  }
}
