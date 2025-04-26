export class CheatSheetItem {
  sno: number;
  title: string;
  desc: string;
  template: string;
  /**
   * Constructor for CheatSheetItem
   * @param sno serial number of cheat sheet
   * @param title title of cheat sheet
   * @param desc description of cheat sheet
   * @param template template of cheat sheet
   */
  constructor(sno: number, title: string, desc: string, template: string) {
    this.sno = sno;
    this.title = title;
    this.desc = desc;
    this.template = template;
  }
}
