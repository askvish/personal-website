import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../shared/model/item-model';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent implements OnInit {
  items: ItemModel[] = [
    {
      sno: 1,
      title: 'Portfolio',
      desc: "Ashok Vishwakarma's Portfolio.",
      link: './portfolio/',
    },
    {
      sno: 2,
      title: 'Food Recipe Website',
      desc: 'Food Recipe Website using React JS.',
      link: 'https://food-recipes-app-1099.web.app/',
    },
    {
      sno: 3,
      title: 'Random number Generator',
      desc: 'Click to Generate random number.',
      link: './portfolio/',
    },
    {
      sno: 4,
      title: 'Brazil Weather App',
      desc: 'IIT Kanpur BTech 3rd year project.',
      link: './projects/',
    },
    {
      sno: 4,
      title: 'Future Project',
      desc: 'Click to see future project.',
      link: './portfolio/',
    },
  ];

  constructor() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
  }

  ngOnInit(): void {
    // Initialize animations after view init
    setTimeout(() => this.animateHeader(), 1);
  }

  animateHeader(): void {
    const tl = gsap.timeline();

    // Animate name with text reveal
    tl.from('.name', {
      duration: 1.5,
      text: {
        value: '',
        delimiter: '',
      },
      ease: 'power2.inOut',
    });

    // Animate title with modern fade up
    tl.from(
      '.title',
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      '-=0.5'
    );

    // Animate summary with typewriter effect
    tl.from('.summary', {
      duration: 2.5,
      text: {
        value: '',
        delimiter: ' ',
      },
      ease: 'none',
    });

    // Particle effect for header
    this.createParticles();
  }
  createParticles(): void {
    const particles = document.querySelector('.particles');
    if (!particles) return;

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particles.appendChild(particle);

      gsap.set(particle, {
        x: gsap.utils.random(0, 800),
        y: gsap.utils.random(0, 200),
        scale: gsap.utils.random(0.3, 1),
        opacity: gsap.utils.random(0.2, 0.8),
      });

      gsap.to(particle, {
        x: `+=${gsap.utils.random(-100, 100)}`,
        y: `+=${gsap.utils.random(-50, 50)}`,
        opacity: gsap.utils.random(0.1, 0.6),
        duration: gsap.utils.random(2, 6),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }

  // Function to handle item click
  goToResume(): void {
    window.location.href = './resume';
  }

  goToProjects(): void {
    window.location.href = './projects';
  }
}
