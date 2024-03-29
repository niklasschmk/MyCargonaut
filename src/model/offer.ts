export class Offer{
  offerId?: string;
  destination: string;
  date: string;
  price: number;
  start: string;
  userId: string;
  vehicleId: string;
  bookedBy: string | null;
  rideId: string | null;
  seats: number;
  cargoSpace: number;

  constructor(destination: string, date: string, price: number, start: string, userId: string, vehicleId: string) {
    this.destination = destination;
    this.date = date;
    this.price = price;
    this.start = start;
    this.userId = userId;
    this.vehicleId = vehicleId;
  }
}
