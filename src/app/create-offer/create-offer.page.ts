import {Component, OnInit, ViewChild} from '@angular/core';
import {OfferService} from "../../services/offer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IonInput, NavController} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../services/toast.service";
import {Observable} from "rxjs";
import {Vehicle} from "../../model/vehicle";
import {VehicleService} from "../../services/vehicle.service";
import {Offer} from "../../model/offer";

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
  price: number;
  start: string;
  user_id: string;
  vehicle_id: string;
  vehicleName: string;
  offers: Offer[];
  currentVehicle: Vehicle;
  createOfferForm: FormGroup;

  validationMessages = {
    destination: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Ziel'},
      {type: 'minlength', message: 'Der Titel muss mindestens 2 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Titel darf höchstens 30 Zeichen lang sein!'}
    ],
    price: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Ziel'},
    ],
    start: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Startpunkt'},
      {type: 'minlength', message: 'Der Titel muss mindestens 2 Zeichen lang sein!'},
      {type: 'maxlength', message: 'Der Titel darf höchstens 30 Zeichen lang sein!'}
    ],
    vehicle_id: [
      {type: 'required', message: 'Bitte gib deinem Angebot ein Startpunkt'},
    ]
  }
  constructor(private offerService: OfferService, private router: Router, private navCtrl: NavController,
              public formBuilder: FormBuilder, private toastService: ToastService, private route: ActivatedRoute,
              private vehicleService: VehicleService) {
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
      vehicle_id: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
    this.getOffers();
    const eventJSON = this.route.snapshot.paramMap.get('offerId');
    this.editOfferId = JSON.parse(eventJSON);
    if(this.editOfferId !== null){
      this.editMode = true;
      this.offerService.getOfferById(this.editOfferId, true).then(offer => {
        this.destination = offer.destination;
        this.price = offer.price;
        this.start = offer.start;
        this.vehicle_id = offer.vehicle_id;
        this.vehicleService.getVehicleById(this.vehicle_id).then(vehicle => {
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
  }

  createOffer() {
    if(this.editMode){
      this.editOffer();
    } else {
      if(this.createOfferForm.valid) {
        const offerId = this.generateOfferId();
        this.offerService.createOffer(this.destination, this.price, this.start, this.vehicle_id, offerId).then(() => {
          this.toastService.presentToast('Angebot erfolgreich angelegt!', 'success');
          this.navCtrl.pop();
        });
      } else {
        this.toastService.presentToast('Bitte füllel alle Felder aus!', 'danger');
      }
    }
  }

  generateOfferId(){
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  editOffer() {
    if (this.createOfferForm.valid) {
      this.offerService.editOffer(this.editOfferId, this.destination, this.price, this.start,
        this.vehicle_id).then(() => {
        this.toastService.presentToast('Angebot erfolgreich geändert!', 'success');
        this.navCtrl.pop();
      });
    } else {
      this.toastService.presentToast('Bitte fülle alle Felder aus!', 'danger');
    }
  }

  getOffers() {
    this.offerService.getOwnEventsOfUser();
  }
}
