export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface Project {
  id: string;
  name: string;
  techStack: string;
  date: string;
  description: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  year: string;
}

export interface Recommendation {
  id: string;
  name: string;
  role: string;
  company: string;
  contact: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
    profilePicture?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  settings: {
    headerLayout: 'center' | 'left' | 'right';
    photoStyle: 'circle' | 'rounded';
    fontFamily: 'serif' | 'sans' | 'mono';
  };
  profileSummary: string;
  experiences: Experience[];
  skills: SkillGroup[];
  awards: string;
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  languages: Language[];
  interests: string;
  recommendations: Recommendation[];
}
