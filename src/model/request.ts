export class Request {
  requestId?: string;
  cargoSpace: number;
  date: Date;
  destination: string;
  seats: number;
  start: string;
  userId: string;

  constructor(cargoSpace: number, date: Date, destination: string, seats: number, start: string, userId: string) {
    this.cargoSpace = cargoSpace;
    this.date = date;
    this.destination = destination;
    this.seats = seats;
    this.start = start;
    this.userId = userId;
  }
}
