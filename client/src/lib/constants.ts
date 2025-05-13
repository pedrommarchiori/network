// Application constants

// Medical specialties
export const SPECIALTIES = {
  CLINICAL: {
    id: 1,
    name: "Clínica",
    code: "clinical",
    icon: "stethoscope",
    description: "Prática em medicina interna e diagnóstico clínico",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80"
  },
  SURGERY: {
    id: 2,
    name: "Cirurgia",
    code: "surgery",
    icon: "scalpel",
    description: "Procedimentos cirúrgicos e técnicas operatórias",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80"
  },
  OBSTETRICS: {
    id: 3,
    name: "GO - Obstetrícia",
    code: "obstetrics",
    icon: "baby",
    description: "Cuidado pré-natal, parto e pós-parto",
    imageUrl: "https://images.unsplash.com/photo-1558960214-f4283a743867?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"
  },
  GYNECOLOGY: {
    id: 4,
    name: "GO - Ginecologia",
    code: "gynecology",
    icon: "female",
    description: "Saúde da mulher e sistema reprodutor feminino",
    imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"
  },
  PEDIATRICS: {
    id: 5,
    name: "Pediatria",
    code: "pediatrics",
    icon: "child",
    description: "Cuidados médicos para crianças e adolescentes",
    imageUrl: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"
  },
  PREVENTIVE: {
    id: 6,
    name: "Preventiva",
    code: "preventive",
    icon: "shield",
    description: "Medicina preventiva e saúde pública",
    imageUrl: "https://images.unsplash.com/photo-1581056771107-24247a210aca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80"
  }
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: {
    code: "easy",
    name: "Nível Básico",
    className: "bg-blue-100 text-blue-800",
  },
  MEDIUM: {
    code: "medium",
    name: "Nível Intermediário",
    className: "bg-yellow-100 text-yellow-800",
  },
  HARD: {
    code: "hard",
    name: "Nível Avançado",
    className: "bg-red-100 text-red-800",
  },
};

// Performance evaluation categories
export const PERFORMANCE_CATEGORIES = [
  { id: 1, name: "Anamnese", description: "Coleta de informações sobre o histórico do paciente" },
  { id: 2, name: "Apresentação", description: "Apresentação ao paciente e estabelecimento de rapport" },
  { id: 3, name: "Exame Físico", description: "Exame físico completo e direcionado" },
  { id: 4, name: "Diagnóstico", description: "Hipóteses diagnósticas e raciocínio clínico" },
  { id: 5, name: "Conduta", description: "Plano terapêutico e orientações ao paciente" },
  { id: 6, name: "História Patológica", description: "Avaliação de antecedentes patológicos" },
];

// Score evaluation thresholds
export const SCORE_EVALUATION = {
  EXCELLENT: { min: 9.0, max: 10.0, label: "Excelente", color: "text-green-600" },
  GOOD: { min: 7.0, max: 8.9, label: "Bom", color: "text-blue-600" },
  REGULAR: { min: 6.0, max: 6.9, label: "Regular", color: "text-yellow-600" },
  POOR: { min: 0.0, max: 5.9, label: "Insuficiente", color: "text-red-600" },
};

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/login",
    LOGOUT: "/api/logout",
    USER: "/api/auth/user",
  },
  DASHBOARD: "/api/dashboard",
  SPECIALTIES: "/api/specialties",
  SCENARIOS: "/api/scenarios",
  CHECKLISTS: "/api/checklists",
  ATTEMPTS: "/api/attempts",
  CATEGORIES: "/api/categories",
  PERFORMANCE: {
    USER: "/api/users/me/performance",
    SPECIALTY: "/api/users/me/specialty-performance",
  },
  RANKING: "/api/ranking",
};

// LocalStorage keys
export const STORAGE_KEYS = {
  THEME: "sanusxpro-theme",
  AUTH_TOKEN: "sanusxpro-auth-token",
  USER_PREFERENCES: "sanusxpro-user-preferences",
};

// Time constants (in milliseconds)
export const TIME = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
};

// Toast message durations
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// App metadata
export const APP_METADATA = {
  NAME: "SanusXPRO",
  VERSION: "1.0.0",
  DESCRIPTION: "Plataforma de preparação para residência médica e Revalida",
  AUTHOR: "SanusXPRO Team",
  COPYRIGHT: `© ${new Date().getFullYear()} SanusXPRO. Todos os direitos reservados.`,
};
