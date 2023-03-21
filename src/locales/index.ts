import { createI18n, type Composer } from 'vue-i18n'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof en
const userLang = navigator.language
console.log('The language is: ' + userLang)
const instance = createI18n<[MessageSchema], 'en' | 'fr'>({
  legacy: false,
  locale: userLang,
  fallbackLocale: 'en',
  messages: {
    en: en,
    fr: fr
  }
})

export default instance

export const i18n = instance.global
