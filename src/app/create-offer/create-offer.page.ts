import {Component, OnInit, ViewChild} from '@angular/core';
import {OfferService} from '../../services/offer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IonInput, NavController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../services/toast.service';
import {Observable} from 'rxjs';
import {Vehicle} from '../../model/vehicle';
import {VehicleService} from '../../services/vehicle.service';
import {Offer} from '../../model/offer';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.page.html',
  styleUrls: ['./create-offer.page.scss'],
})
export class CreateOfferPage implements OnInit {
  @ViewChild('destinationInput')
  private destinationRef: IonInput;
  editMode = false;
  editOfferId: string;
  offerStatus = 'undefined';
  destination: string;
  date: any;
  price: number;
  start: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  offers: Offer[];
  currentVehicle: Vehicle;
  createOfferForm: FormGroup;
  vehicles: Vehicle[];
  vehicleObserve: Observable<Vehicle[]>;
  cargoSpace: number;
  seats: number;
  showVehicleData = false;

  validationMessages = {
    destination: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Ziel'},
      {type: 'minlength', message: 'Der Titel muss mindestens 2 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Titel darf höchstens 30 Zeichen lang sein!'}
    ],
    price: [
      {type: 'required', message: 'Bitte wähle einen Preis!'},
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
    vehicleId: [
      {type: 'required', message: 'Bitte gib ein Fahrzeug an!'},
    ],
  };

  constructor(private offerService: OfferService, private router: Router, private navCtrl: NavController,
              public formBuilder: FormBuilder, private toastService: ToastService, private route: ActivatedRoute,
              public vehicleService: VehicleService) {
    this.createOfferForm = this.formBuilder.group({
      destination: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ])),
      price: new FormControl('', Validators.compose([
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
      vehicleId: new FormControl('', Validators.compose([
        Validators.required
      ])),
      seats: new FormControl('', Validators.compose([
      ])),
      cargoSpace: new FormControl('', Validators.compose([
      ])),
    });
    this.getOffers();
    const eventJSON = this.route.snapshot.paramMap.get('offerId');
    this.editOfferId = JSON.parse(eventJSON);
    if (this.editOfferId !== null) {
      this.editMode = true;
      this.offerService.getOfferById(this.editOfferId, true).then(offer => {
        this.destination = offer.destination;
        this.price = offer.price;
        this.start = offer.start;
        this.date = offer.date;
        this.vehicleId = offer.vehicleId;
        this.vehicleService.getVehicleById(this.vehicleId).then(vehicle => {
          this.currentVehicle = vehicle;
          this.vehicleName = this.currentVehicle.name;
        });
        this.offerStatus = 'found';
      }).catch(err => {
        this.offerStatus = err;
      });
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.destinationRef.setFocus().then();
    //get vehicles of logged in user
    this.vehicleService.getVehicles().then(res => {
      this.vehicleObserve = res;
      this.vehicleObserve.subscribe(vehicles => {
        this.vehicles = vehicles;
      });
    });
  }

  createOffer() {
    if (this.editMode) {
      this.editOffer();
    } else {
      if (this.createOfferForm.valid) {
        this.vehicleService.getVehicleById(this.vehicleId).then(vehicle => {
          if(!this.showVehicleData){
            //get vehicle data
            this.currentVehicle = vehicle;
            this.cargoSpace = vehicle.cargoSpace;
            this.seats = vehicle.seats;
          }
          const offerId = this.generateOfferId();
          this.offerService.createOffer(this.date, this.destination, this.price, this.start, this.cargoSpace,
            this.seats, this.vehicleId, offerId).then(() => {
            this.toastService.presentToast('Angebot erfolgreich angelegt!', 'success').then();
            this.navCtrl.pop().then();
          });
        });
      } else {
        this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger').then();
      }
    }
  }

  generateOfferId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  editOffer() {
    if (this.createOfferForm.valid) {
      this.vehicleService.getVehicleById(this.vehicleId).then(vehicle => {
        if(!this.showVehicleData){
          //get vehicle data
          this.currentVehicle = vehicle;
          this.cargoSpace = vehicle.cargoSpace;
          this.seats = vehicle.seats;
        }
        this.offerService.editOffer(this.editOfferId, this.destination, this.price, this.start,
          this.vehicleId, this.seats, this.cargoSpace).then(() => {
          this.toastService.presentToast('Angebot erfolgreich geändert!', 'success').then();
          this.navCtrl.pop().then();
        });
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger').then();
    }
  }

  getOffers() {
    this.offerService.getOwnOffersOfUser();
  }

  openVehicleData(){
    this.vehicleService.getVehicleById(this.vehicleId).then(vehicle => {
      this.currentVehicle = vehicle;
      this.cargoSpace = vehicle.cargoSpace;
      this.seats = vehicle.seats;
      this.showVehicleData = true;
    });
  }
}
