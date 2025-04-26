import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface ResumeExperience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string[];
  skills: string[];
  logo?: string;
}

interface ResumeSkill {
  name: string;
  level: number;
  category: string;
}

interface ResumeEducation {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

@Component({
  selector: 'app-resume1',
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('0.5s ease-in-out')]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate(
          '0.6s ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(25px)' }),
            stagger('100ms', [
              animate(
                '0.5s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('expandSkill', [
      state('collapsed', style({ width: '0%' })),
      state('expanded', style({ width: '{{level}}%' }), {
        params: { level: 0 },
      }),
      transition('collapsed => expanded', [
        animate('0.8s cubic-bezier(0.33, 1, 0.68, 1)'),
      ]),
    ]),
  ],
})
export default class ResumeComponent implements OnInit, OnDestroy {
  experiences: ResumeExperience[] = [
    {
      id: 1,
      company: 'LTIMindtree',
      position: 'Senior Product Engineer',
      period: '2022 - Present',
      description: [
        'Led development of flagship SaaS product using Angular 16+',
        'Implemented advanced animation systems reducing bounce rate by 15%',
        'Integrated microfrontends architecture for improved team scalability',
      ],
      skills: ['Angular', 'TypeScript', 'RxJS', 'GSAP', 'Jest'],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/LTIMindtree_Logo.svg',
    },
    {
      id: 2,
      company: 'LTIMindtree',
      position: 'Senior Software Engineer',
      period: '2018 - 2020',
      description: [
        'Assisted in development of educational platform',
        'Created interactive learning components',
        'Participated in code reviews and testing processes',
      ],
      skills: ['Angular', 'HTML', 'CSS', 'Firebase', 'Git'],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/LTIMindtree_Logo.svg',
    },
    {
      id: 3,
      company: 'LTI - Larsen & Toubro InfoTech',
      position: 'Graduate Engineer Trainee',
      period: '2020 - 2022',
      description: [
        'Built responsive web applications with Angular 12',
        'Optimized application performance increasing load speed by 40%',
        'Collaborated with UX team to implement engaging user interfaces',
      ],
      skills: ['Angular', 'JavaScript', 'SCSS', 'NgRx', 'Jasmine'],
      logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGsPjF4QmtIYQ/company-logo_200_200/company-logo_200_200/0/1667281247260/lt_infotech_logo?e=1750291200&v=beta&t=d_lGHvJiZ_RjD4knnJW6Mj9RQnuGLiGaoMS8Ad56VU8',
    },
  ];

  skills: ResumeSkill[] = [
    { name: 'Angular', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Languages' },
    { name: 'RxJS', level: 85, category: 'Libraries' },
    { name: 'GSAP Animation', level: 80, category: 'Libraries' },
    { name: 'NgRx', level: 75, category: 'State Management' },
    { name: 'Jest/Jasmine', level: 70, category: 'Testing' },
    { name: 'SCSS/CSS', level: 90, category: 'Styling' },
    { name: 'Node.js', level: 65, category: 'Backend' },
    { name: 'Git/GitHub', level: 85, category: 'Tools' },
    { name: 'Figma', level: 70, category: 'Design' },
  ];

  education: ResumeEducation[] = [
    {
      institution: 'Tech University',
      degree: 'Master of Computer Science',
      period: '2016 - 2018',
      description:
        'Specialized in Software Engineering with focus on interactive applications',
    },
    {
      institution: 'Digital Arts College',
      degree: 'Bachelor of Web Development',
      period: '2012 - 2016',
      description: 'Graduated with honors, participated in multiple hackathons',
    },
  ];

  skillCategories: string[] = [];
  activeSection: string = 'experience';
  showSkills: boolean = false;
  selectedExperience: ResumeExperience | null = null;
  scrollSubscription: Subscription | undefined;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {
    this.initializeSkillCategories();
    this.initAnimations();

    // Initialize scroll-based animations
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.checkVisibility();
      });

    // Set first experience as selected by default
    if (this.experiences.length > 0) {
      this.selectedExperience = this.experiences[0];
    }

    // Trigger initial animations
    setTimeout(() => {
      this.showSkills = true;
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }

    // Clean up ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  initializeSkillCategories(): void {
    // Extract unique skill categories
    this.skillCategories = [
      ...new Set(this.skills.map((skill) => skill.category)),
    ];
  }

  initAnimations(): void {
    // GSAP Timeline for hero section
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTimeline
      .from('.resume-header h1', { y: -50, opacity: 0, duration: 0.8 })
      .from('.resume-header p', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.section-nav', { y: 30, opacity: 0, duration: 0.5 }, '-=0.2');

    // Setup animations for section visibility
    gsap.utils.toArray('.resume-section').forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
      });
    });

    // Timeline for skill bars (will be triggered later)
    this.setupSkillAnimations();
  }

  setupSkillAnimations(): void {
    gsap.set('.skill-progress-bar', { width: 0 });

    ScrollTrigger.create({
      trigger: '.skills-section',
      start: 'top 70%',
      onEnter: () => {
        gsap.to('.skill-progress-bar', {
          width: (index, element) => {
            return element.getAttribute('data-level') + '%';
          },
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.1,
        });
      },
      onLeaveBack: () => {
        gsap.to('.skill-progress-bar', { width: 0, duration: 0.5 });
      },
    });
  }

  checkVisibility(): void {
    // Update active section based on scroll position
    const sections = document.querySelectorAll('.resume-section');
    const scrollPosition = window.scrollY + 300;

    sections.forEach((section: any) => {
      if (
        section.offsetTop <= scrollPosition &&
        section.offsetTop + section.offsetHeight > scrollPosition
      ) {
        this.activeSection = section.id.replace('-section', '');
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;

    // Scroll to section
    const element = document.getElementById(`${section}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  selectExperience(experience: ResumeExperience): void {
    this.selectedExperience = experience;

    // Animate the experience detail transition
    gsap.fromTo(
      '.experience-details',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }

  getFilteredSkills(category: string): ResumeSkill[] {
    return this.skills.filter((skill) => skill.category === category);
  }

  animateExperienceHover(element: any, isEntering: boolean): void {
    gsap.to(element, {
      scale: isEntering ? 1.02 : 1,
      boxShadow: isEntering
        ? '0 10px 30px rgba(0, 0, 0, 0.15)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
    });
  }
}
