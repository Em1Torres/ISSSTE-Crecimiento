import polyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from './espanol';

export const i18nProvider = polyglotI18nProvider(
	() => spanishMessages,
	'es'
);