export class Vehicle {
  vehicleId?: string;
  name: string;
  cargoSpace: number;
  seats: number;
  userId: string;

  constructor(name: string, cargoSpace: number, seats: number, userId: string) {
    this.name = name;
    this.cargoSpace = cargoSpace;
    this.seats = seats;
    this.userId = userId;
  }
}
