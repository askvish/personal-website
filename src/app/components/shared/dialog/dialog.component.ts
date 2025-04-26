import { CommonModule, NgSwitch } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgTableComponent } from '../ng-table/ng-table.component';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, NgSwitch, NgTableComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: string }) {}

  angular_commands = [
    {
      command: 'npm install -g @angular/cli',
      meaning:
        'To install the Angular CLI into our local machine using npm, run this command.',
    },
    {
      command: 'ng version',
      meaning: 'Displays the information about the currently installed CLI.',
    },
    {
      command: 'ng new <application name>',
      meaning:
        'Using the ng new command, a new Angular application will be created.',
    },
    {
      command: 'ng new <application name> --prefix best',
      meaning:
        'A new project is created, and the project prefix is set to new.',
    },
    {
      command: 'ng new --help',
      meaning: 'All available Angular commands are returned by this command.',
    },
    {
      command: 'ng lint my-app',
      meaning:
        'Linting warnings are checked against this command in our entire application.',
    },
    {
      command: 'ng lint my-app --fix',
      meaning: 'This command will correct any form of linting errors.',
    },
    {
      command: 'ng lint my-app --format stylish',
      meaning: 'Our entire codebase is formatted using this command.',
    },
    {
      command: 'ng lint my-app --help',
      meaning: 'The list of linting commands is returned by this command.',
    },
    {
      command: 'ng add <package name>',
      meaning:
        'To use this command, you must first enable your package manager. Then, this command will use your package manager to download new dependencies and update your project with configuration changes.',
    },
    {
      command: 'ng generate component <name>',
      meaning:
        'A new component of our application will be created as a result of this command.',
    },
    {
      command: 'ng g s <service name>',
      meaning: 'Creates a new class-based service based on Javascript classes.',
    },
    {
      command: 'ng g cl <destination>',
      meaning: 'This command creates a new class in the specified directory.',
    },
    {
      command: 'ng build',
      meaning:
        'An application is created and stored in the dist directory using this command.',
    },
    {
      command: 'ng serve',
      meaning:
        'The local development server is launched, and the app is served locally in the browser. Port and open are both specified. When you change any of the source files, the app is rebuilt and reloaded, and the page is changed automatically.',
    },
    {
      command: 'ng serve -o',
      meaning:
        'This command opens up the application in a browser using any port 4200 or any available port.',
    },
  ];
}
