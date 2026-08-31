import type { ModuleItem } from '../types/module';

export const modules: ModuleItem[] = [
  {
    id: 'module-01',
    code: 'MOD-01',
    title: 'Your Digital Neighborhood',

    description:
      'Understand the landscape of digital footprints and how everyday actions construct your online perimeter.',

    duration: 15,
    category: 'Basics',
    difficulty: 'Beginner',
    status: 'NOT_STARTED',
    icon: 'office-building',
    progress: 0,

    activities: [
      {
        id: 'A1',
        title: 'Your Digital Neighborhood',
        description:
          'Explore the digital services, devices, and platforms that form your everyday digital environment.',
        type: 'INTRO',
        completed: false,
      },
      {
        id: 'A2',
        title: 'Digital Footprint',
        description:
          'Learn how your online actions create a digital footprint.',
        type: 'QUESTION',
        completed: false,
      },
      {
        id: 'A3',
        title: 'Think About Your Activity',
        description:
          'Identify one digital activity you performed today and consider what information it creates.',
        type: 'REFLECTION',
        completed: false,
      },
    ],
  },

  {
    id: 'module-02',
    code: 'MOD-02',
    title: 'Phishing Defense',

    description:
      'Learn to identify sophisticated social engineering vectors and implement protocols against spear-phishing attacks.',

    duration: 25,
    category: 'Advanced',
    difficulty: 'Intermediate',
    status: 'NOT_STARTED',
    icon: 'phishing',
    progress: 0,

    activities: [
      {
        id: 'A1',
        title: 'Introduction to Phishing',
        description:
          'Understand how phishing attacks manipulate users.',
        type: 'INTRO',
        completed: false,
      },
      {
        id: 'A2',
        title: 'Identify the Threat',
        description:
          'Learn to recognize common phishing indicators.',
        type: 'QUESTION',
        completed: false,
      },
    ],
  },

  {
    id: 'module-03',
    code: 'MOD-03',
    title: 'Data Privacy',

    description:
      'Master classification protocols for sensitive information and apply robust encryption standards for data at rest and in transit.',

    duration: 20,
    category: 'Compliance',
    difficulty: 'Intermediate',
    status: 'NOT_STARTED',
    icon: 'fingerprint',
    progress: 0,

    activities: [
      {
        id: 'A1',
        title: 'Understanding Data Privacy',
        description:
          'Learn why protecting personal and sensitive information matters.',
        type: 'INTRO',
        completed: false,
      },
      {
        id: 'A2',
        title: 'Classifying Data',
        description:
          'Practice identifying different types of sensitive information.',
        type: 'QUESTION',
        completed: false,
      },
    ],
  },

  {
    id: 'module-04',
    code: 'MOD-04',
    title: 'Network Security',

    description:
      'Examine network topology vulnerabilities, VPN configurations, and intrusion detection system monitoring techniques.',

    duration: 30,
    category: 'Advanced',
    difficulty: 'Advanced',
    status: 'NOT_STARTED',
    icon: 'lan-connect',
    progress: 0,

    activities: [
      {
        id: 'A1',
        title: 'Network Security Fundamentals',
        description:
          'Understand the fundamental concepts of secure networks.',
        type: 'INTRO',
        completed: false,
      },
      {
        id: 'A2',
        title: 'Network Threats',
        description:
          'Identify common network vulnerabilities and threats.',
        type: 'QUESTION',
        completed: false,
      },
    ],
  },
];