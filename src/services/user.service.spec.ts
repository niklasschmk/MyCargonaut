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
      0,
    );
    TestBed.configureTestingModule({});
  });
  afterEach(()=>{
    user = null;
  });
  it('should be created',()=>{
    expect(user).toBeTruthy();
  });

  it('should be found an user', ()=>{
    expect(user.userName).toEqual('ziyad1212');
  });
});
