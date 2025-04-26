import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { CheatSheetCardComponent } from '../cheat-sheet-card/cheat-sheet-card.component';
import { CheatSheetItem } from '../shared/model/cheat-sheet-item';

@Component({
  selector: 'app-cheat-sheets',
  imports: [CommonModule, MatDialogModule, CheatSheetCardComponent],
  templateUrl: './cheat-sheets.component.html',
  styleUrl: './cheat-sheets.component.css',
})
export default class CheatSheetsComponent {
  items: CheatSheetItem[] = [
    {
      sno: 1,
      title: 'Markdown',
      desc: 'Markdown is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as an easy-to-read markup language.',
      template: 'markdown',
    },
    {
      sno: 2,
      title: 'MySQL',
      desc: 'MySQL is an open-source relational database management system (RDBMS). Its name is a combination of "My", the name of co-founder Michael Widenius\'s daughter My, and "SQL", the acronym for Structured Query Language.',
      template: 'mysql',
    },
    {
      sno: 3,
      title: 'Bash',
      desc: 'Bash, short for Bourne-Again SHell, is a shell program and command language supported by the Free Software Foundation and first developed for the GNU Project by Brian Fox. Designed as a 100% free software alternative for the Bourne shell, it was initially released in 1989.',
      template: 'bash',
    },
    {
      sno: 4,
      title: 'Angular',
      desc: 'Angular (also referred to as "Angular 2+") is a TypeScript-based free and open-source single-page web application framework. It is developed by Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS.',
      template: 'angular',
    },
    {
      sno: 5,
      title: 'MySQL',
      desc: 'MySQL CheatSheet.',
      template: 'mysql',
    },
    {
      sno: 6,
      title: 'Bash',
      desc: 'Bash CheatSheet.',
      template: 'bash',
    },
  ];
}
