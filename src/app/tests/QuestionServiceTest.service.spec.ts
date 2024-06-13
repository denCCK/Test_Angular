import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {QuestionService} from "../service/QuestionService";
import {Question} from "../models/question";
import {User} from "../models/user";

describe('QuestionService', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/questions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestionService]
    });
    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch questions', () => {
    const mockQuestions: Question[] = [
      new Question(
        1,
        'Test Question',
        'Test Description',
        new Date(),
        new Date(),
        5,
        'multiple-choice',
        'single',
        3,
        new User(1, 'login', 'password', 'User', 'Surname', 1), // Пример объекта User
        'Math'
      )
    ];

    service.getQuestions().subscribe(questions => {
      expect(questions.length).toBe(1);
      expect(questions).toEqual(mockQuestions);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestions);
  });

  it('should fetch question by id', () => {
    const mockQuestion: Question = new Question(
      1,
      'Test Question',
      'Test Description',
      new Date(),
      new Date(),
      5,
      'multiple-choice',
      'single',
      3,
      new User(1, 'login', 'password', 'User', 'Surname', 1), // Пример объекта User
      'Math'
    );

    service.getQuestionById(1).subscribe(question => {
      expect(question).toEqual(mockQuestion);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockQuestion);
  });

  it('should create a new question', () => {
    const newQuestion: Question = new Question(
      2,
      'New Question',
      'New Description',
      new Date(),
      new Date(),
      5,
      'multiple-choice',
      'single',
      3,
      new User(2, 'newlogin', 'newpassword', 'NewUser', 'NewSurname', 2), // Пример объекта User
      'Science'
    );

    service.createQuestion(newQuestion).subscribe(question => {
      expect(question).toEqual(newQuestion);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newQuestion);
  });

  it('should update a question', () => {
    const updatedQuestion: Question = new Question(
      1,
      'Updated Question',
      'Updated Description',
      new Date(),
      new Date(),
      5,
      'multiple-choice',
      'single',
      3,
      new User(1, 'login', 'password', 'User', 'Surname', 1), // Пример объекта User
      'Math'
    );

    service.updateQuestion(1, updatedQuestion).subscribe(question => {
      expect(question).toEqual(updatedQuestion);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedQuestion);
  });

  it('should delete a question', () => {
    service.deleteQuestion(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should delete a question with answers', () => {
    service.deleteQuestionWithAnswers(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/answers/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

