export class User{
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  cargoCoins: number;
  birthDay: Date;

  constructor(firstName: string, lastName: string, userName: string, cargoCoins: number, birthDay: Date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.cargoCoins = cargoCoins;
    this.birthDay = birthDay;
  }
}
