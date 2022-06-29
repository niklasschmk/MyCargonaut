import {TestBed} from '@angular/core/testing';
import {Request} from '../model/request';

let request: Request;
describe('RequestService', ()=>{
  beforeEach(()=>{
    request = new Request(
      20,
      '30.01.2023',
      'test',
      3,
      'Frankfurt',
      '12',
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    request = null;
  });
  it('should be created',()=>{
    expect(request).toBeTruthy();
  });

  it('should be found seats', ()=>{
    expect(request.seats).toEqual(3);
  });
  it('should be found request', ()=>{
    const testRequest = new Request(      20, '30.01.2023', 'test', 3, 'Frankfurt', '12');
    expect(request).toEqual(testRequest);
  });
  it('should be bigger',()=>{
    expect(request.seats).toBeGreaterThan(2);
  });
});
