import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemModel } from '../shared/model/item-model';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export default class ProjectsComponent {
  items: ItemModel[] = [
    {
      sno: 1,
      title: 'Collaborative Whiteboard',
      desc: 'Collaborative Whiteboard using Spring Boot, Angular and Socket.io.',
      link: 'https://collab-whiteboard-by-ashok.web.app/',
    },
    {
      sno: 1,
      title: 'Chat Application',
      desc: 'Chat Application using Spring Boot, Angular and Socket.io.',
      link: 'https://chat-app-by-ashok.web.app/',
    },
    {
      sno: 1,
      title: 'Todo App with Category',
      desc: 'Todo App with Category using Spring Boot, Angular.',
      link: 'https://advanced-todos-app-by-ashok.web.app/',
    },
    {
      sno: 3,
      title: 'Document Scanner App',
      desc: 'Self project.',
      link: 'https://document-scanner-by-ashok.web.app/',
    },
    {
      sno: 1,
      title: 'Food Recipe Website',
      desc: 'Food Recipe Website using React JS.',
      link: 'https://food-recipes-app-1099.web.app/',
    },
    {
      sno: 2,
      title: 'Brazil Weather App',
      desc: 'IIT Kanpur BTech 3rd year project.',
      link: 'https://brazil-weather-app.web.app/',
    },

    {
      sno: 4,
      title: 'Age Calculator App',
      desc: 'Utility app.',
      link: './age-calculator',
    },
    {
      sno: 5,
      title: 'Music Player App',
      desc: 'Utility app.',
      link: './music-player',
    },
    {
      sno: 6,
      title: 'Future Project',
      desc: 'Click to see future project.',
      link: '/',
    },
    {
      sno: 7,
      title: 'Pong Game',
      desc: 'Take a break and play this game.',
      link: '/pong-game',
    },
  ];

  goToProjects(link: string) {
    window.open(link, '_blank');
  }
}
