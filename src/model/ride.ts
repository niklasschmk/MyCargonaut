export class Ride{
  rideId: string;
  status: string;
  date: string;
  driverUserId: string;
  customerUserId: string;
  price: number;

  constructor(rideId: string, status: string, date: string, driverUserId: string, customerUserId: string, price: number) {
    this.rideId = rideId;
    this.status = status;
    this.date = date;
    this.driverUserId = driverUserId;
    this.customerUserId = customerUserId;
    this.price = price;
  }
}
