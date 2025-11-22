import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// UI用辞書ファイルのインポート
import jaUI from './locales/ja/ui.json';
import enUI from './locales/en/ui.json';

const resources = {
  ja: {
    ui: jaUI
  },
  en: {
    ui: enUI
  }
};

i18n
  .use(LanguageDetector) // ブラウザの言語設定を検知
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ja', // 言語検知できない場合のデフォルト
    defaultNS: 'ui',   // デフォルトの名前空間（ui.jsonを使う）
    
    interpolation: {
      escapeValue: false // ReactはXSS対策済みなのでfalse
    }
  });

export default i18n;