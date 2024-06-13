import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestsessionQuestionResult } from '../models/testsessionQuestionResult';
import {TestsessionQuestionResultService} from "../service/TestsessionQuestionResultService";

describe('TestsessionQuestionResultService', () => {
  let service: TestsessionQuestionResultService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsession-question-results';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestsessionQuestionResultService]
    });
    service = TestBed.inject(TestsessionQuestionResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all testsession question results', () => {
    const mockTestsessionQuestionResults: TestsessionQuestionResult[] = [
      new TestsessionQuestionResult(1, 1, 1, true, 5),
      new TestsessionQuestionResult(2, 1, 2, false, 0)
    ];

    service.getAllTestsessionQuestionResults().subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionQuestionResults);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionQuestionResults);
  });

  it('should fetch a testsession question result by id', () => {
    const mockTestsessionQuestionResult: TestsessionQuestionResult = new TestsessionQuestionResult(1, 1, 1, true, 5);

    service.getTestsessionQuestionResultById(1).subscribe(result => {
      expect(result).toEqual(mockTestsessionQuestionResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionQuestionResult);
  });

  it('should create a new testsession question result', () => {
    const newTestsessionQuestionResult: TestsessionQuestionResult = new TestsessionQuestionResult(3, 1, 3, true, 10);

    service.createTestsessionQuestionResult(newTestsessionQuestionResult).subscribe(result => {
      expect(result).toEqual(newTestsessionQuestionResult);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTestsessionQuestionResult);
  });

  it('should update an existing testsession question result', () => {
    const updatedTestsessionQuestionResult: TestsessionQuestionResult = new TestsessionQuestionResult(1, 1, 1, false, 0);

    service.updateTestsessionQuestionResult(1, updatedTestsessionQuestionResult).subscribe(result => {
      expect(result).toEqual(updatedTestsessionQuestionResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTestsessionQuestionResult);
  });

  it('should delete a testsession question result', () => {
    const testsessionQuestionResultId = 1;

    service.deleteTestsessionQuestionResult(testsessionQuestionResultId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${testsessionQuestionResultId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch question results by testsession result id', () => {
    const mockTestsessionQuestionResults: TestsessionQuestionResult[] = [
      new TestsessionQuestionResult(1, 1, 1, true, 5),
      new TestsessionQuestionResult(2, 1, 2, false, 0)
    ];

    service.getQuestionResultsByTestsessionResultId(1).subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionQuestionResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/testsession-result/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionQuestionResults);
  });
});
