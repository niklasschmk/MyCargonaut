import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Vehicle} from '../model/vehicle';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {AuthService} from './auth.service';
import {AlertService} from './alert.service';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  vehicleCollection: AngularFirestoreCollection<Vehicle>;

  constructor(private afs: AngularFirestore, public authService: AuthService,
              public alertService: AlertService, public toastService: ToastService) {
    this.vehicleCollection = this.afs.collection<Vehicle>('vehicle');
    this.getVehicles().then();
  }

  /**
   * Get all vehicles of the logged-in user
   */
  getVehicles(): Promise<Observable<Vehicle[]>>{
    return new Promise<Observable<Vehicle[]>>((resolve) => {
     resolve(this.afs.collection<Vehicle>('vehicle',ref =>
     ref.where('userId', '==', this.authService.userId)).valueChanges({idField: 'vehicleId'}));
    });
  }

  /**
   * Get a vehicle by an id
   *
   * @param vehicleId
   */
  getVehicleById(vehicleId: string): Promise<Vehicle>{
    return new Promise((resolve, reject) => {
      this.vehicleCollection.doc(vehicleId).ref.get().then((doc) => {
        if (doc.exists){
          resolve(doc.data());
        } else {
          reject('vehicle not found, vehicleId: ' + vehicleId);
        }
      });
    });
  }

  /**
   * Add a vehicle for the logged-in user with defined values
   *
   * @param name name of the vehicle
   * @param seats number of seats
   * @param cargoSpace cargoSpace in liters
   */
  addVehicle(name: string, seats: number, cargoSpace: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.vehicleCollection.add({
        name,
        seats,
        cargoSpace,
        userId: this.authService.userId,
        deleted: false,
      }).then(() => {
        this.toastService.presentToast('Fahrzeug wurde gespeichert', 'primary').then();
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }


  /**
   * Opens alert and deletes vehicle after confirmation
   *
   * @param vehicleId
   */
  deleteVehicle(vehicleId): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      //open delete confirm
      await this.alertService.presentAlertConfirm('Löschen bestätigen',
        'Sind Sie sicher, dass Sie das Fahrzeug löschen möchten?').then(confirm => {
          if(confirm){
            //delete vehicle if user confirmed
            this.vehicleCollection.doc(vehicleId).update({
              deleted: true,
            })
              .then(() => {
                  this.toastService.presentToast('Fahrzeug wurde gelöscht', 'primary');
                  resolve();
                }).catch(() => {
                  reject();
            });
          }
      });
    });
  }
}
