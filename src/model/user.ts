export class User{
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  cargoCoins: number;
  birthDay: string;
  picturePath: string;

  constructor(firstName: string, lastName: string, userName: string, cargoCoins: number, birthDay: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.cargoCoins = cargoCoins;
    this.birthDay = birthDay;
  }
}
