export class User{
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  cargoCoins: number;

  constructor(firstName: string, lastName: string, userName: string, cargoCoins: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.cargoCoins = cargoCoins;
  }
}
