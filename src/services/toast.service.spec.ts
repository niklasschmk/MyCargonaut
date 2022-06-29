import {TestBed} from '@angular/core/testing';
import {ToastService} from './toast.service';
import {ToastController} from '@ionic/angular';

let toastService: ToastService;
let toastController: ToastController;

describe('ToastService', () => {
  beforeEach(() => {
    toastService = new ToastService(
      toastController
    );
    TestBed.configureTestingModule({});
  });
  afterEach(() => {
    toastService = null;
  });
  it('should be created', () => {
    expect(toastService).toBeTruthy();
  });
});
