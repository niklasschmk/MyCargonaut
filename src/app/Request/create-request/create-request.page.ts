import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInput, NavController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../services/toast.service';
import {VehicleService} from '../../../services/vehicle.service';
import {RequestService} from '../../../services/request.service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.page.html',
  styleUrls: ['./create-request.page.scss'],
})
export class CreateRequestPage implements OnInit {

  @ViewChild('destinationInput')
  private destinationRef: IonInput;
  editMode = false;
  editRequestId: string;
  requestStatus = 'undefined';
  destination: string;
  date: any;
  seats: number;
  cargoSpace: number;
  start: string;
  userId: string;
  requests: Request[];
  createRequestForm: FormGroup;

  validationMessages = {
    destination: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Ziel'},
      {type: 'minlength', message: 'Der Titel muss mindestens 2 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Titel darf höchstens 30 Zeichen lang sein!'}
    ],
    cargoSpace: [
      {type: 'required', message: 'Bitte wähle einen cargoSpace!'},
    ],
    start: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Startpunkt'},
      {type: 'minlength', message: 'Der Titel muss mindestens 2 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Titel darf höchstens 30 Zeichen lang sein!'}
    ],
    date: [
      {type: 'required', message: 'Bitte gib ein Datum und eine Uhrzeit an!'},
      //check if date is in future missing
    ],
    seats: [
      {type: 'required', message: 'Bitte gib die Anzahl der Plätze deiner Fahrzeug!'},
    ],
  };
  constructor(private requestService: RequestService, private router: Router, private navCtrl: NavController,
              public formBuilder: FormBuilder, private toastService: ToastService, private route: ActivatedRoute,
              public vehicleService: VehicleService) {
    this.createRequestForm = this.formBuilder.group({
      destination: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ])),
      cargoSpace: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      start: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      seats: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
    this.getRequests();
    const eventJSON = this.route.snapshot.paramMap.get('requestId');
    this.editRequestId = JSON.parse(eventJSON);
    if(this.editRequestId !== null){
      this.editMode = true;
      this.requestService.getRequestById(this.editRequestId, true).then(request => {
        this.destination = request.destination;
        this.cargoSpace = request.cargoSpace;
        this.start = request.start;
        this.seats = request.seats;
        this.date = request.date;
        this.requestStatus = 'found';
      }).catch(err => {
        this.requestStatus = err;
      });
    }
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.destinationRef.setFocus().then();
  }
  createRequest() {
    if(this.editMode){
      this.editRequest();
    } else {
      if(this.createRequestForm.valid) {
        const requestId = this.generateRequestId();
        this.requestService.createRequest(this.cargoSpace,this.date, this.destination, this.seats, this.start,
          this.userId, requestId).then(() => {
          this.toastService.presentToast('Gesuch erfolgreich angelegt!', 'success');
          this.navCtrl.pop();
        });
      } else {
        this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger');
      }
    }
  }
  generateRequestId(){
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  editRequest() {
    if (this.createRequestForm.valid) {
      this.requestService.editRequest(this.editRequestId, this.cargoSpace, this.date, this.destination, this.seats,
        this.start).then(() => {
        this.toastService.presentToast('Gesuche erfolgreich geändert!', 'success');
        this.navCtrl.pop();
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger');
    }
  }
  getRequests() {
    this.requestService.getOwnEventsOfUser();
  }
}
