export class Offer{
  offerId?: string;
  destination: string;
  date: Date;
  price: number;
  start: string;
  userId: string;
  vehicleId: string;
  bookedBy: string | null;
  rideId: string | null;

  constructor(destination: string, date: Date, price: number, start: string, userId: string, vehicleId: string) {
    this.destination = destination;
    this.date = date;
    this.price = price;
    this.start = start;
    this.userId = userId;
    this.vehicleId = vehicleId;
  }
}
