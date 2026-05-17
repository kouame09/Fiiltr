import { CVData } from './types';

export const initialData: CVData = {
  personalInfo: {
    fullName: "KOFFI AMAN KOUASSI",
    jobTitle: "Développeur Full-Stack Senior",
    email: "koffi.aman@email.ci",
    phone: "+225 07 00 00 00 00",
    linkedin: "linkedin.com/in/koffiaman",
    location: "Abidjan, Côte d'Ivoire",
    profilePicture: "",
    github: "github.com/koffiaman",
    twitter: "",
    facebook: "",
    instagram: "",
    website: "koffiaman.dev"
  },
  settings: {
    headerLayout: 'center',
    photoStyle: 'circle',
    fontFamily: 'serif'
  },
  profileSummary: "Développeur Full-Stack passionné avec plus de 6 ans d'expérience dans la conception et le déploiement d'applications web scalables. Expert en React, Node.js et architectures Cloud. Fortement orienté vers la performance technique et l'expérience utilisateur, avec une solide expérience en gestion d'équipes agiles.",
  experiences: [
    {
      id: "exp-1",
      role: "Lead Développeur Full-Stack",
      company: "TechIvoire Solutions",
      location: "Abidjan, CI",
      startDate: "Jan 2021",
      endDate: "Présent",
      description: [
        "Direction technique d'une équipe de 5 développeurs sur la refonte du portail e-services.",
        "Optimisation des temps de réponse de l'API de 40% grâce à la mise en cache Redis et à l'optimisation des requêtes SQL.",
        "Mise en place d'une architecture microservices robuste utilisant Docker et Kubernetes.",
        "Réduction des bugs de production de 25% via l'implémentation de tests unitaires et d'intégration systématiques."
      ]
    },
    {
      id: "exp-2",
      role: "Développeur JavaScript Senior",
      company: "Digital Africa Services",
      location: "Abidjan, CI",
      startDate: "Mars 2018",
      endDate: "Déc 2020",
      description: [
        "Développement de fonctionnalités critiques pour une plateforme de paiement mobile utilisée par plus de 100k utilisateurs.",
        "Collaboration avec les designers UI/UX pour créer des interfaces fluides et accessibles.",
        "Migration réussie d'une application monolithique vers une architecture React/Next.js.",
        "Formation et mentorat de 3 développeurs juniors sur les bonnes pratiques de codage."
      ]
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Technologies Frontend",
      items: "React, Next.js, TypeScript, Tailwind CSS, Redux"
    },
    {
      id: "skill-2",
      category: "Backend & Database",
      items: "Node.js, Express, PostgreSQL, MongoDB, GraphQL"
    },
    {
      id: "skill-3",
      category: "Outils & Cloud",
      items: "AWS, Docker, Git, Jenkins, Firebase"
    }
  ],
  awards: "Prix de l'Innovation Technologique 2022 - Forum du Numérique Abidjan",
  projects: [
    {
      id: "proj-1",
      name: "Plateforme de Télémédecine",
      keywords: "React, Node.js, WebRTC, Socket.io",
      date: "2022",
      description: [
        "Conception d'un système de consultation vidéo en temps réel sécurisé.",
        "Gestion des dossiers patients informatisés avec chiffrement de bout en bout."
      ]
    },
    {
      id: "proj-2",
      name: "Application de Suivi Logistique",
      keywords: "React Native, Google Maps API, Firebase",
      date: "2021",
      description: [
        "Développement d'une application mobile pour le suivi en temps réel des livraisons urbaines.",
        "Optimisation des itinéraires de livraison réduisant le temps de trajet de 15%."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      id: "cert-2",
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      year: "2021"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Diplôme d'Ingénieur en Informatique",
      school: "ESATIC (École Supérieure des TIC)",
      location: "Abidjan, Côte d'Ivoire",
      year: "2017"
    },
    {
      id: "edu-2",
      degree: "Licence en Mathématiques-Informatique",
      school: "Université Félix Houphouët-Boigny",
      location: "Abidjan, Côte d'Ivoire",
      year: "2014"
    }
  ],
  languages: [
    { id: "lang-1", name: "Français", level: "Maternel" },
    { id: "lang-2", name: "Anglais", level: "Professionnel (C1)" }
  ],
  interests: "Intelligence Artificielle, Photographie, Basketball, Voyages",
  recommendations: [
    {
      id: "rec-1",
      name: "Jean-Marc Yao",
      role: "Directeur CTO",
      company: "TechIvoire Solutions",
      contact: "jm.yao@techivoire.ci"
    }
  ]
};
