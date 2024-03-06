import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RuTranslation from './public/locales/ru/translation.json';
import EnTranslation from './public/locales/en/translation.json';

export const defaultNS = 'translation';
export const resources = {
  ru: {
    translation: RuTranslation,
  },
  en: {
    translation: EnTranslation,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'ru',
  ns: ['RuTranslation', 'EnTranslation'],
  defaultNS,
  resources,
});

export default i18n;
