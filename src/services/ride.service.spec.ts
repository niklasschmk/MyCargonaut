import {TestBed} from '@angular/core/testing';
import {Ride} from '../model/ride';


let ride: Ride;
describe('RideService', ()=>{
  beforeEach(()=>{
    ride = new Ride(
      '12',
      'Test',
      '30.01.2000',
      '12',
      '13',
      20,
      true,
      true
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    ride = null;
  });
  it('should be created',()=>{
    expect(ride).toBeTruthy();
  });

  it('price should be 20', ()=>{
    expect(ride.price).toEqual(20);
  });
  it('should be found ride', ()=>{
    const testride = new Ride(  '12', 'Test', '30.01.2000', '12', '13', 20, true, true );
    expect(ride).toEqual(testride);
  });
  it('should be paid ',()=>{
    expect(ride.paid).toBeTruthy();
  });
});
