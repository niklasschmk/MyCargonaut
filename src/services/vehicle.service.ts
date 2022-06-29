import {Injectable} from '@angular/core';
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
    this.getVehicles();
  }

  /**
   * Get all vehicles of the logged in user
   */
  getVehicles(): Promise<Vehicle[]>{
    return new Promise<Vehicle[]>((resolve, reject) => {
      const myVehicles: Vehicle[] = [];
      this.afs.collection<Vehicle>('vehicle').ref.where('userId', '==',this.authService.userId)
        .get().then(docSnaps => {
        for(const docSnap of docSnaps.docs){
          const vehicle = docSnap.data();
          vehicle.vehicleId = docSnap.id;
          myVehicles.push(vehicle);
        }
        resolve(myVehicles);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getVehicleById(vehicleId: string): Promise<Vehicle>{
    console.log(vehicleId);
    return new Promise((resolve, reject) => {
      this.vehicleCollection.doc(vehicleId).ref.get().then((doc) => {
        if (doc.exists){
          console.log('Doc exists');
          resolve(doc.data());
        } else {
          reject('vehicle not found');
        }
      });
    });
  }

  /**
   * Add a vehicle for the logged in user with defined values
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
        userId: this.authService.userId
      }).then(() => {
        this.toastService.presentToast('Fahrzeug wurde gespeichert', 'primary');
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
            this.vehicleCollection.doc(vehicleId).delete()
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
