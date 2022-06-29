import {TestBed} from '@angular/core/testing';
import {Vehicle} from '../model/vehicle';


let vehicle: Vehicle;
describe('Verhicle', ()=>{
  beforeEach(()=>{
    vehicle = new Vehicle(
      'Chicken',
      20,
      3,
      '12'
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    vehicle = null;
  });
  it('should be created',()=>{
    expect(vehicle).toBeTruthy();
  });

  it('should be found an name', ()=>{
    expect(vehicle.name).toEqual('Chicken');
  });
  it('should be found an vehicle', ()=>{
    const testvehicle = new Vehicle('Chicken', 20, 3, '12');
    expect(vehicle).toEqual(testvehicle);
  });
  it('cargoSpace should be greater than 15 ',()=>{
    expect(vehicle.cargoSpace).toBeGreaterThan(15);
  });
});
