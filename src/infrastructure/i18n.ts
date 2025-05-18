import en from '@/core/translations/en.json'
import uk from '@/core/translations/uk.json'
import i18n from 'i18next'
import { LanguageDetector } from 'i18next-http-middleware'

i18n.use(LanguageDetector).init({
	resources: {
		en: {
			translation: en,
		},
		uk: {
			translation: uk,
		},
	},
	preload: ['uk', 'en'],
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
