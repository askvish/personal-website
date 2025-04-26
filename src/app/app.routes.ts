import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/main/main.component'),
  },
  {
    path: 'resume',
    loadComponent: () => import('./components/resume/resume.component'),
  },
  {
    path: 'projects',
    loadComponent: () => import('./components/projects/projects.component'),
  },
  {
    path: 'cheat-sheets',
    loadComponent: () =>
      import('./components/cheat-sheets/cheat-sheets.component'),
  },
  {
    path: 'technopedia',
    loadComponent: () =>
      import('./components/technopedia/technopedia.component'),
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact/contact.component'),
  },
  {
    path: 'age-calculator',
    loadComponent: () =>
      import('./components/projects/age-calculator/age-calculator.component'),
  },
  {
    path: 'music-player',
    loadComponent: () =>
      import('./components/projects/music-player/music-player.component'),
  },
  {
    path: 'pong-game',
    loadComponent: () =>
      import('./components/projects/pong-game/pong-game.component'),
  },
  { path: '**', redirectTo: 'home' },
];
