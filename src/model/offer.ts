export class Offer{
  offerId?: string;
  destination: string;
  price: number;
  start: string;
  user_id: string;
  vehicle_id: string;

  constructor(destination: string, price: number, start: string, user_id: string, vehicle_id: string) {
    this.destination = destination;
    this.price = price;
    this.start = start;
    this.user_id = user_id;
    this.vehicle_id = vehicle_id;
  }
}
