export class Ride{
  rideId: string;
  status: string[];
  statusTimes: string[];
  date: string;
  driverUserId: string;
  customerUserId: string;
  price: number;
  offerId: string;
  closed: boolean;
  paid: boolean;

  constructor(rideId: string, status: string, date: string, driverUserId: string,
              customerUserId: string, price: number, closed: boolean, paid: boolean) {
    this.rideId = rideId;
    this.status = [status];
    this.statusTimes = [new Date().toISOString()];
    this.date = date;
    this.driverUserId = driverUserId;
    this.customerUserId = customerUserId;
    this.price = price;
    this.closed = closed;
    this.paid = paid;
  }
}
