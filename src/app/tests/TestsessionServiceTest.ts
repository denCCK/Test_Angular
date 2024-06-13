import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {TestsessionService} from "../service/TestsessionService";
import {Testsession} from "../models/testsession";

describe('TestsessionService', () => {
  let service: TestsessionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://angulartest.asuscomm.com:8080/api/testsessions';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestsessionService]
    });
    service = TestBed.inject(TestsessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all testsessions', () => {
    const mockTestsessions: Testsession[] = [
      new Testsession(1, 'Session 1', 'Description 1', new Date(), new Date(), 1, new Date(), new Date(), 10, new Date()),
      new Testsession(2, 'Session 2', 'Description 2', new Date(), new Date(), 2, new Date(), new Date(), 20, new Date())
    ];

    service.getAllTestsessions().subscribe(testsessions => {
      expect(testsessions.length).toBe(2);
      expect(testsessions).toEqual(mockTestsessions);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsessions);
  });

  it('should fetch a testsession by id', () => {
    const mockTestsession: Testsession = new Testsession(1, 'Session 1', 'Description 1', new Date(), new Date(), 1, new Date(), new Date(), 10, new Date());

    service.getTestsessionById(1).subscribe(testsession => {
      expect(testsession).toEqual(mockTestsession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestsession);
  });

  it('should create a new testsession', () => {
    const newTestsession: Testsession = new Testsession(3, 'Session 3', 'Description 3', new Date(), new Date(), 3, new Date(), new Date(), 30, new Date());

    service.createTestsession(newTestsession).subscribe(testsession => {
      expect(testsession).toEqual(newTestsession);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newTestsession);
  });

  it('should update an existing testsession', () => {
    const updatedTestsession: Testsession = new Testsession(1, 'Updated Session', 'Updated Description', new Date(), new Date(), 1, new Date(), new Date(), 10, new Date());

    service.updateTestsession(1, updatedTestsession).subscribe(testsession => {
      expect(testsession).toEqual(updatedTestsession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTestsession);
  });

  it('should delete a testsession', () => {
    const testsessionId = 1;

    service.deleteTestsession(testsessionId).subscribe(response => {
      expect(response).toBeNull();;
    });

    const req = httpMock.expectOne(`${apiUrl}/${testsessionId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
