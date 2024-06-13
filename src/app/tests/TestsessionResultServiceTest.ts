import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestsessionResult } from '../models/testsessionResult';
import {TestsessionResultService} from "../service/TestsessionResultService";

describe('TestsessionResultService', () => {
  let service: TestsessionResultService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsession-results';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestsessionResultService]
    });
    service = TestBed.inject(TestsessionResultService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all testsession results', () => {
    const mockTestsessionResults: TestsessionResult[] = [
      new TestsessionResult(1, 1, 'John', 'Doe', 90, new Date(), new Date()),
      new TestsessionResult(2, 1, 'Jane', 'Doe', 95, new Date(), new Date())
    ];

    service.getAllTestsessionResults().subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionResults);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionResults);
  });

  it('should fetch a testsession result by id', () => {
    const mockTestsessionResult: TestsessionResult = new TestsessionResult(1, 1, 'John', 'Doe', 90, new Date(), new Date());

    service.getTestsessionResultById(1).subscribe(result => {
      expect(result).toEqual(mockTestsessionResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionResult);
  });

  it('should create a new testsession result', () => {
    const newTestsessionResult: TestsessionResult = new TestsessionResult(3, 2, 'Alice', 'Smith', 85, new Date(), new Date());

    service.createTestsessionResult(newTestsessionResult).subscribe(result => {
      expect(result).toEqual(newTestsessionResult);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTestsessionResult);
  });

  it('should update an existing testsession result', () => {
    const updatedTestsessionResult: TestsessionResult = new TestsessionResult(1, 1, 'John', 'Doe', 95, new Date(), new Date());

    service.updateTestsessionResult(1, updatedTestsessionResult).subscribe(result => {
      expect(result).toEqual(updatedTestsessionResult);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTestsessionResult);
  });

  it('should delete a testsession result', () => {
    const testsessionResultId = 1;

    service.deleteTestsessionResult(testsessionResultId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${testsessionResultId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch testsession results by testsession id', () => {
    const mockTestsessionResults: TestsessionResult[] = [
      new TestsessionResult(1, 1, 'John', 'Doe', 90, new Date(), new Date()),
      new TestsessionResult(2, 1, 'Jane', 'Doe', 95, new Date(), new Date())
    ];

    service.getTestsessionResultsByTestsessionId(1).subscribe(results => {
      expect(results.length).toBe(2);
      expect(results).toEqual(mockTestsessionResults);
    });

    const req = httpMock.expectOne(`${apiUrl}/testsession/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessionResults);
  });
});
