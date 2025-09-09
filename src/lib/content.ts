import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface HeroContent {
  badge: {
    text: string;
    showIndicator: boolean;
  };
  hero: {
    name: string;
    profileImage: string;
    title: string;
  };
  cta: {
    text: string;
    type: string;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
    theme: string;
  }>;
}

export interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
  };
  stats: {
    sectionTitle: string;
    items: Array<{
      value: string;
      label: string;
    }>;
  };
  mission: {
    paragraphs: string[];
  };
  carousel: {
    items: Array<{
      theme: string;
    }>;
  };
  coreApi: {
    paragraphs: string[];
  };
  foundingTeam: {
    title: string;
    description: string;
    teamImage: string;
  };
}

export function getHeroContent(): HeroContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/hero.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as HeroContent;
}

export interface FeaturesContent {
  header: {
    badge: string;
    title: string;
    subtitle: string;
  };
  features: Array<{
    icon: string;
    name: string;
    description: string;
    href: string;
    cta: string;
    size: string;
    theme: string;
  }>;
}

export interface ServicesContent {
  header: {
    badge: string;
    title: string;
    subtitle: string;
  };
  services: Array<{
    icon: string;
    title: string;
    description: string;
    duration: string;
    price: string;
    featured: boolean;
    items: string[];
    deliverables: string[];
  }>;
  customSolution: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

export interface TimelineContent {
  header: {
    badge: string;
    title: string;
    subtitle: string;
  };
  steps: Array<{
    icon: string;
    title: string;
    description: string;
    reverse: boolean;
  }>;
}

export function getAboutContent(): AboutContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/about.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as AboutContent;
}

export function getFeaturesContent(): FeaturesContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/features.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as FeaturesContent;
}

export function getServicesContent(): ServicesContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/services.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as ServicesContent;
}

export interface CtaContent {
  badge: {
    text: string;
    showIndicator: boolean;
  };
  title: string;
  subtitle: string;
  buttons: {
    primary: {
      text: string;
      type: string;
    };
    secondary: {
      text: string;
    };
  };
  links: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export function getTimelineContent(): TimelineContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/timeline.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as TimelineContent;
}

export function getCtaContent(): CtaContent {
  const filePath = path.join(process.cwd(), 'src/content/pages/home/cta.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  return data as CtaContent;
}