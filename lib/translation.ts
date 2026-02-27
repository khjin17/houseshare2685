// Translation service for reviews and content
// Uses browser's built-in translation or external API

export interface TranslationResult {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
}

export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'pt' | 'it'

export const languageNames: Record<SupportedLanguage, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  pt: 'Português',
  it: 'Italiano',
}

class TranslationService {
  private userLanguage: SupportedLanguage = 'en'
  private translationCache: Map<string, TranslationResult> = new Map()

  constructor() {
    // Detect user's preferred language
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0]
      if (this.isSupportedLanguage(browserLang)) {
        this.userLanguage = browserLang as SupportedLanguage
      }
    }
  }

  private isSupportedLanguage(lang: string): lang is SupportedLanguage {
    return ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'pt', 'it'].includes(lang)
  }

  getUserLanguage(): SupportedLanguage {
    return this.userLanguage
  }

  setUserLanguage(lang: SupportedLanguage) {
    this.userLanguage = lang
    if (typeof window !== 'undefined') {
      localStorage.setItem('userLanguage', lang)
    }
  }

  async translate(text: string, targetLang: SupportedLanguage, sourceLang: string = 'auto'): Promise<TranslationResult> {
    // Create cache key
    const cacheKey = `${sourceLang}_${targetLang}_${text}`
    
    console.log("[v0] Starting translation:", { text, targetLang, sourceLang })
    
    // Check cache
    if (this.translationCache.has(cacheKey)) {
      console.log("[v0] Using cached translation")
      return this.translationCache.get(cacheKey)!
    }

    try {
      // In production, this would call a real translation API like Google Translate
      // For now, we'll use a mock translation service
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang,
          sourceLang: sourceLang || 'auto',
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const result: TranslationResult = await response.json()
      
      console.log("[v0] Translation API response:", result)
      
      // Cache the result
      this.translationCache.set(cacheKey, result)
      
      return result
    } catch (error) {
      console.error('[v0] Translation API error:', error)
      // Return mock translation for demo purposes
      const mockResult = this.mockTranslate(text, targetLang, sourceLang)
      console.log("[v0] Using mock translation:", mockResult)
      return mockResult
    }
  }

  private mockTranslate(text: string, targetLang: SupportedLanguage, sourceLang: string): TranslationResult {
    // Mock translation - in production, this would be replaced with real API calls
    const translations: Record<SupportedLanguage, string> = {
      ko: `[번역됨: ${text}]`,
      en: `[Translated: ${text}]`,
      ja: `[翻訳済み: ${text}]`,
      zh: `[已翻译: ${text}]`,
      es: `[Traducido: ${text}]`,
      fr: `[Traduit: ${text}]`,
      de: `[Übersetzt: ${text}]`,
      ru: `[Переведено: ${text}]`,
      pt: `[Traduzido: ${text}]`,
      it: `[Tradotto: ${text}]`,
    }

    return {
      translatedText: translations[targetLang] || text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    }
  }

  // Clear translation cache
  clearCache() {
    this.translationCache.clear()
  }
}

export const translationService = new TranslationService()
