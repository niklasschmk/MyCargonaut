export class Offer{
  offerId?: string;
  destination: string;
  price: number;
  start: string;
  userId: string;
  vehicleId: string;
  bookedBy: string | null;

  constructor(destination: string, price: number, start: string, userId: string, vehicleId: string) {
    this.destination = destination;
    this.price = price;
    this.start = start;
    this.userId = userId;
    this.vehicleId = vehicleId;
  }
}
