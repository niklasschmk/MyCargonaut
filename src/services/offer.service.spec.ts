import {TestBed} from '@angular/core/testing';
import {Offer} from '../model/offer';


let offer: Offer;
describe('OfferService', ()=>{
  beforeEach(()=>{
    offer = new Offer(
      'desti',
      '30.01.2000',
      20,
      'Frankfurt',
      '12',
      '12'
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    offer = null;
  });
  it('should be created',()=>{
    expect(offer).toBeTruthy();
  });

  it('should be found start', ()=>{
    expect(offer.start).toEqual('Frankfurt');
  });
  it('should be found an offer', ()=>{
    const testOffer = new Offer(offer.destination, offer.date, offer.price, offer.start, offer.userId, offer.vehicleId);
    expect(offer).toEqual(testOffer);
  });
  it('should be end with furt ',()=>{
    expect(offer.start).toContain('furt');
  });
});
