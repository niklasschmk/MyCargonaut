import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth},
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
