import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {BehaviorSubject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';

const firestoreStub = {
  collection: (name: string) => ({
    doc: (_id: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise<void>((resolve, _reject) => resolve()),
    }),
  }),
};


describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreStub },
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
