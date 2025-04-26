export class ItemModel {
  sno: number;
  title: string;
  desc: string;
  link: string;

  constructor(sno: number, title: string, desc: string, link: string) {
    this.sno = sno;
    this.title = title;
    this.desc = desc;
    this.link = link;
  }
}
