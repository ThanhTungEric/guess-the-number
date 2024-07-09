import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LOGIN_EN from './en/Login.json';
import LOGIN_VI from './vn/Login.json';

export const locales = {
    en: 'English',
    vi: 'Tiếng Việt',
};

const resources = {
    en: {
        login: LOGIN_EN,
    },
    vi: {
        login: LOGIN_VI,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi',
        fallbackLng: 'vi',
        ns: ['login'],
        defaultNS: 'login',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
