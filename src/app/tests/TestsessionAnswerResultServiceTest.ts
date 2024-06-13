import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestsessionAnswerResult } from '../models/testsessionAnswerResult';
import {TestsessionAnswerResultService} from "../service/TestsessionAnswerResultService";

describe('TestsessionAnswerResultService', () => {
  let service: TestsessionAnswerResultService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsession-answer-results';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestsessionAnswerResultService]
    });
    service = TestBed.inject(TestsessionAnswerResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all testsession answer results', () => {
    const mockTestsessionAnswerResults: TestsessionAnswerResult[] = [
      new TestsessionAnswerResult(1, 1, 1, 1, 'Answer 1', '', true, false, '', '', '', false),
      new TestsessionAnswerResult(2, 1, 2, 2, 'Answer 2', '', false, false, '', '', '', false)
    ];

    service.getAllTestsessionAnswerResults().subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionAnswerResults);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionAnswerResults);
  });

  it('should fetch a testsession answer result by id', () => {
    const mockTestsessionAnswerResult: TestsessionAnswerResult = new TestsessionAnswerResult(1, 1, 1, 1, 'Answer 1', '', true, false, '', '', '', false);

    service.getTestsessionAnswerResultById(1).subscribe(result => {
      expect(result).toEqual(mockTestsessionAnswerResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionAnswerResult);
  });

  it('should create a new testsession answer result', () => {
    const newTestsessionAnswerResult: TestsessionAnswerResult = new TestsessionAnswerResult(3, 1, 3, 3, 'Answer 3', '', true, false, '', '', '', false);

    service.createTestsessionAnswerResult(newTestsessionAnswerResult).subscribe(result => {
      expect(result).toEqual(newTestsessionAnswerResult);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTestsessionAnswerResult);
  });

  it('should update an existing testsession answer result', () => {
    const updatedTestsessionAnswerResult: TestsessionAnswerResult = new TestsessionAnswerResult(1, 1, 1, 1, 'Updated Answer 1', '', false, false, '', '', '', false);

    service.updateTestsessionAnswerResult(1, updatedTestsessionAnswerResult).subscribe(result => {
      expect(result).toEqual(updatedTestsessionAnswerResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTestsessionAnswerResult);
  });

  it('should delete a testsession answer result', () => {
    const testsessionAnswerResultId = 1;

    service.deleteTestsessionAnswerResult(testsessionAnswerResultId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${testsessionAnswerResultId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch answer results by testsession result id', () => {
    const mockTestsessionAnswerResults: TestsessionAnswerResult[] = [
      new TestsessionAnswerResult(1, 1, 1, 1, 'Answer 1', '', true, false, '', '', '', false),
      new TestsessionAnswerResult(2, 1, 2, 2, 'Answer 2', '', false, false, '', '', '', false)
    ];

    service.getAnswerResultsByTestsessionResultId(1).subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionAnswerResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/testsession-result/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionAnswerResults);
  });
});
