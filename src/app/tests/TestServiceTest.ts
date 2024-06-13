import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Test } from '../models/test';
import { User } from '../models/user';
import {TestService} from "../service/TestService";

describe('TestService', () => {
  let service: TestService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/tests';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestService]
    });
    service = TestBed.inject(TestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tests', () => {
    const mockTests: Test[] = [
      new Test(1, 'Test 1', 'Description 1', new Date(), new Date(), new User(1, 'login1', 'password1', 'name1', 'surname1', 1), []),
      new Test(2, 'Test 2', 'Description 2', new Date(), new Date(), new User(2, 'login2', 'password2', 'name2', 'surname2', 2), [])
    ];

    service.getAllTests().subscribe(tests => {
      expect(tests.length).toBe(2);
      expect(tests).toEqual(mockTests);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTests);
  });

  it('should fetch a test by id', () => {
    const mockTest: Test = new Test(1, 'Test 1', 'Description 1', new Date(), new Date(), new User(1, 'login1', 'password1', 'name1', 'surname1', 1), []);

    service.getTestById(1).subscribe(test => {
      expect(test).toEqual(mockTest);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTest);
  });

  it('should create a new test', () => {
    const newTest: Test = new Test(3, 'Test 3', 'Description 3', new Date(), new Date(), new User(3, 'login3', 'password3', 'name3', 'surname3', 3), []);

    service.createTest(newTest).subscribe(test => {
      expect(test).toEqual(newTest);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTest);
  });

  it('should update an existing test', () => {
    const updatedTest: Test = new Test(1, 'Updated Test', 'Updated Description', new Date(), new Date(), new User(1, 'login1', 'password1', 'name1', 'surname1', 1), []);

    service.updateTest(1, updatedTest).subscribe(test => {
      expect(test).toEqual(updatedTest);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTest);
  });

  it('should delete a test', () => {
    const testId = 1;

    service.deleteTest(testId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${testId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
