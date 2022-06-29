export class Request {
  requestId?: string;
  cargoSpace: number;
  date: string;
  destination: string;
  seats: number;
  start: string;
  userId: string;
  lowestBid: number;
  lowestBidUserId: string;
  offerId: string;

  constructor(cargoSpace: number, date: string, destination: string, seats: number, start: string, userId: string) {
    this.cargoSpace = cargoSpace;
    this.date = date;
    this.destination = destination;
    this.seats = seats;
    this.start = start;
    this.userId = userId;
  }
}
