import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from "../models/answer";

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = 'http://localhost:8080/api/answers';

  constructor(private http: HttpClient) { }

  getAnswersByQuestionId(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/question/${questionId}`);
  }

  deleteAnswersByQuestionId(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/question/${questionId}`);
  }


  createAnswer(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(this.apiUrl, answer);
  }

  updateAnswer(id: number, answer: Answer): Observable<Answer> {
    return this.http.put<Answer>(`${this.apiUrl}/${id}`, answer);
  }

  deleteAnswer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
