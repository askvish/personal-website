import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SafePipe } from '../../pipes/safe.pipe';
import { CommonModule } from '@angular/common';
import { MarkdownViewerComponent } from '../projects/markdown-viewer/markdown-viewer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-technopedia',
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    SafePipe,
    MarkdownViewerComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIcon,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './technopedia.component.html',
  styleUrl: './technopedia.component.css',
})
export default class TechnopediaComponent {
  pdfUrls = [
    'https://education.github.com/git-cheat-sheet-education.pdf',
    'https://about.gitlab.com/images/press/git-cheat-sheet.pdf',
    'https://wizardzines.com/git-cheat-sheet.pdf',
    'https://training.github.com/downloads/github-git-cheat-sheet.pdf',
    'https://static.javatpoint.com/tutorial/git/download/Git%20Cheat%20Sheet.pdf',
  ];

  protected readonly technologies = [
    { id: 'git', name: 'Git', icon: 'fa-brands fa-github fa-lg' },
    { id: 'markdown', name: 'Markdown', icon: 'fa-brands fa-markdown fa-lg' },
    { id: 'angular', name: 'Angular', icon: 'fa-brands fa-angular fa-lg' },
  ];

  isMenuHidden: boolean = false;

  constructor() {
    this.activeContent = 'git';
  }
  activeContent: string = 'git'; // Default content

  // Function to set active content based on click
  setActiveContent(content: string): void {
    this.activeContent = content;
  }
}
