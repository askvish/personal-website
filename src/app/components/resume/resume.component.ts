import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume',
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export default class ResumeComponent implements OnInit {
  @ViewChild('resumeContainer', { static: true }) resumeContainer!: ElementRef;

  resume = {
    personal: {
      name: 'Ashok Vishwakarma',
      title: 'Senior Product Engineer',
      company: 'LTIMindtree',
      location: 'Noida, India',
      summary:
        'Passionate software engineer with 2.5+ years of experience in building modern web applications with Spring Boot, Angular.',
      contact: {
        email: 'ashokvishwakarma1099@gmail.com',
        phone: '+916376314671',
        website: 'https://ashokvishwakarma.com',
        github: 'https://github.com/askvish',
        linkedin: 'https://www.linkedin.com/in/ashok-vish',
      },
    },
    experience: [
      {
        title: 'Senior Product Engineer',
        company: 'LTIMindtree',
        location: 'Noida, India',
        period: 'June 2023 - Present',
        description: [
          'Utilized Java Spring Boot for backend development, implementing RESTful APIs for seamless communication between frontend and backend, ensuring efficient data handling and user authentication.',
          'Developed a responsive and user-friendly frontend using Angular, incorporating Material Design for an intuitive user experience, and implemented state management with NgRx for efficient data flow and component communication.',
          'Led development of flagship SaaS product using Angular 16+',
          'Contributed to the development of reusable components and libraries, enhancing the overall efficiency of the development process.',
        ],
      },
      {
        title: 'Software Software Engineer',
        company: 'LTIMindtree',
        location: 'Pune, India',
        period: 'Oct 2022 - May 2023',
        description: [
          'Developed and maintained a large-scale Angular application, implementing responsive design and optimizing performance for enhanced user experience.',
          'Collaborated with cross-functional teams to gather requirements, design solutions, and deliver high-quality software on time.',
          'Participated in code reviews, ensuring adherence to best practices and coding standards, resulting in improved code quality and reduced technical debt.',
          'Mentored junior developers, providing guidance on Angular best practices, design patterns, and performance optimization techniques.',
          'Contributed to the development of reusable components and libraries, enhancing the overall efficiency of the development process.',
          'Implemented state management using NgRx, ensuring efficient data flow and component communication within the application.',
        ],
      },
      {
        title: 'Graduate Engineer Trainee',
        company: 'LTI - Larsen & Toubro Infotech',
        location: 'Pune, India',
        period: 'Jul 2022 - Oct 2022',
        description: [
          'Designed and developed a Course Registration System (CRS) using Java, implementing robust user roles including Admin, Professor, and Student, with features such as course management, student enrollment, and grade assignment.',
          'Architected modular backend components with object-oriented principles, ensuring scalable code structure, maintainability, and seamless integration with database operations and exception handling.',
          'Led a team in agile development, incorporating best practices in version control (Git), code reviews, and unit testing, resulting in a production-ready application deployed in an Eclipse-based Java environment.',
        ],
      },
    ],
    education: [
      {
        degree:
          'Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE)',
        institution: 'Indian Institute of Technology Kanpur (IIT Kanpur)',
        year: '2018 - 2022',
      },
      {
        degree: 'Intermediate',
        institution: 'P.N. National Public School, Gorakhpur',
        year: '2015 - 2017',
      },
    ],
    achievements: [
      {
        title: 'All India Rank (AIR) 1139 in JEE Advanced, 2018',
        field: 'JEE Advanced, 2018',
        year: '2018',
      },
      {
        title: 'Spot Awards | Super Crew at LTIMindtree, Feb 2025',
        field: 'LTIMindtree',
        year: '2025',
      },
    ],
    skills: [
      { name: 'Spring Boot', level: 95 },
      { name: 'Angular', level: 90 },
      { name: 'TypeScript', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'JavaScript', level: 95 },
      { name: 'CSS/SCSS', level: 85 },
      { name: 'Git', level: 90 },
      { name: 'MySQL', level: 75 },
      { name: 'MongoDB', level: 75 },
    ],
  };

  constructor() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
  }

  ngOnInit(): void {
    // Initialize animations after view init
    setTimeout(() => this.initAnimations(), 1);
  }

  initAnimations(): void {
    // Initial entrance animation
    this.animateHeader();
    this.animateExperienceTimeline();
    this.animateEducation();
    this.animateSkills();

    // Setup scroll-based animations
    this.setupScrollAnimations();
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

  animateSkills(): void {
    // Stagger animate skill bars
    gsap.from('.skill-bar-progress', {
      width: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-section',
        start: 'top 80%',
      },
    });

    // Animate skill labels
    gsap.from('.skill-name', {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.skills-section',
        start: 'top 80%',
      },
    });

    // Animate skill percentages with counting
    const percentElements = document.querySelectorAll('.skill-percentage');
    percentElements.forEach((el, index) => {
      const target = this.resume.skills[index].level;

      gsap.from(el, {
        innerText: 0,
        duration: 2,
        snap: { innerText: 1 },
        onUpdate: function () {
          el.textContent = Math.round(Number(el.textContent)) + '%';
        },
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 80%',
        },
      });
    });
  }

  animateExperienceTimeline(): void {
    // Timeline connector animation
    gsap.from('.timeline-connector', {
      height: 0,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.experience-section',
        start: 'top 70%',
      },
    });

    // Staggered card reveal for experience items
    gsap.from('.experience-card', {
      x: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.4,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.experience-section',
        start: 'top 70%',
      },
    });

    // Timeline node animations
    gsap.from('.timeline-node', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.4,
      ease: 'elastic.out(1, 0.3)',
      scrollTrigger: {
        trigger: '.experience-section',
        start: 'top 70%',
      },
    });
  }

  animateEducation(): void {
    // Staggered card animations for education
    gsap.from('.education-card', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.education-section',
        start: 'top 80%',
      },
    });

    // Icon animations
    gsap.from('.education-icon', {
      rotate: -180,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'elastic.out(1, 0.3)',
      scrollTrigger: {
        trigger: '.education-section',
        start: 'top 80%',
      },
    });
  }

  setupScrollAnimations(): void {
    // Parallax background effect
    gsap.to('.parallax-bg', {
      backgroundPosition: '0 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.resume-container',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Section headers slide-in animation
    gsap.utils.toArray('.section-title').forEach((title: any) => {
      gsap.from(title, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
        },
      });
    });

    // Section divider line animation
    gsap.utils.toArray('.section-divider').forEach((divider: any) => {
      gsap.from(divider, {
        width: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: divider,
          start: 'top 85%',
        },
      });
    });
  }
}
