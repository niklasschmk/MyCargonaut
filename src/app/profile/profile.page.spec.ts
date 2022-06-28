import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import {BehaviorSubject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';


const firestoreStub = {
  collection: (name: string) => ({
    doc: (_id: string) => ({
      valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
      set: (_d: any) => new Promise<void>((resolve, _reject) => resolve()),
    }),
  }),
};

let userServiceSpy: jasmine.SpyObj<UserService>;

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(waitForAsync(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', 'getUSerById');
    const routerSpyObj = jasmine.createSpyObj('Router', 'router');
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AngularFirestore, useValue: firestoreStub},
        { provide: Router, useValue: routerSpyObj},
        { provide: UserService, useValue: userServiceSpyObj},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
