import { createI18n, type VueI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

const listLocales = ['en', 'fr']

type MessageSchema = typeof en
let userLang: string | undefined
for(const lang of navigator.languages) {
  userLang = listLocales.find(loc => lang === loc) || listLocales.find(loc => lang.split('-')[0] === loc)
  if(userLang) break;
}
console.log('The language is: ' + userLang)
const instance = createI18n<[MessageSchema], 'en' | 'fr'>({
  legacy: false,
  locale: userLang || 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    fr: fr
  }
})

export default instance

export const i18n: VueI18n = instance.global
