import {TestBed} from '@angular/core/testing';
import {UserService} from './user.service';
import {User} from '../model/user';

let user: User;
describe('UserService', ()=>{
  beforeEach(()=>{
    user = new User(
      'Ziyad',
      'Issa',
      'ziyad1212',
      500,
      '30.01.2000',
      null
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    user = null;
  });
  it('should be created',()=>{
    expect(user).toBeTruthy();
  });

  it('should be found an username', ()=>{
    expect(user.userName).toEqual('ziyad1212');
  });
  it('should be found an user', ()=>{
    const testUser = new User(   'Ziyad', 'Issa', 'ziyad1212', 500, '30.01.2000',null);
    expect(user).toEqual(testUser);
  });
  it('should withdraw coins ',()=>{
    const actualcoins: number = user.cargoCoins - 150;
    expect(actualcoins).toEqual(350);
  });
});
