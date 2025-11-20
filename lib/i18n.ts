export type Locale = 'da' | 'en';

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  da: {
    login: 'Log ind',
    logout: 'Log ud',
    email: 'Email',
    password: 'Adgangskode',
    adminDashboard: 'Admin dashboard',
    viewerDashboard: 'Viewer oversigt',
    beboerDashboard: 'Beboer oversigt',
    language: 'Sprog',
    seniorMode: 'Senior-tilstand',
    save: 'Gem',
    messages: 'Beskeder',
    documents: 'Dokumenter'
  },
  en: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    adminDashboard: 'Admin dashboard',
    viewerDashboard: 'Viewer dashboard',
    beboerDashboard: 'Resident dashboard',
    language: 'Language',
    seniorMode: 'Senior mode',
    save: 'Save',
    messages: 'Messages',
    documents: 'Documents'
  }
};

export function getDictionary(locale: Locale = 'da'): Dictionary {
  return dictionaries[locale];
}
