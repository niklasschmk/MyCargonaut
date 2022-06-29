export class Evaluation {
  evaluationId?: string;
  rater: string;
  stars: number;
  text: string;
  title: string;
  userId: string;
  date: Date;
  edited: boolean;

  constructor(rater: string, stars: number, text: string, title: string, userId: string, date: Date, edited: false) {
    this.rater = rater;
    this.stars = stars;
    this.text = text;
    this.title = title;
    this.userId = userId;
    this.date = date;
    this.edited = edited;
  }
}
