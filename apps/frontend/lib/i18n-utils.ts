/**
 * Utilities for internationalization (i18n) support
 * Handles Arabic numerals, dates, and RTL formatting
 */

/**
 * Convert Western/English numerals (0-9) to Arabic-Indic numerals (٠-٩)
 */
export function toArabicNumerals(num: string | number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Format a number for display based on locale
 * - Arabic locale: Use Arabic-Indic numerals (١٢٣)
 * - English locale: Use Western numerals (123)
 */
export function formatNumber(num: number, locale: string): string {
  if (locale === 'ar') {
    return toArabicNumerals(num);
  }
  return String(num);
}

/**
 * Format a date for display based on locale
 * - Arabic locale: Use Arabic locale formatting with Arabic numerals
 * - English locale: Use English locale formatting
 */
export function formatDate(date: Date | string, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'ar') {
    // Format in Arabic with Arabic numerals
    const formatted = dateObj.toLocaleDateString('ar-LB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatted;
  }

  // Format in English
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a currency amount for display based on locale
 * - Maintains $ symbol but uses Arabic numerals for Arabic locale
 */
export function formatCurrency(amount: number, locale: string, currency: string = '$'): string {
  if (locale === 'ar') {
    return `${currency}${toArabicNumerals(amount)}`;
  }
  return `${currency}${amount}`;
}

/**
 * Format a percentage for display based on locale
 */
export function formatPercentage(percent: number, locale: string): string {
  if (locale === 'ar') {
    return `${toArabicNumerals(percent)}%`;
  }
  return `${percent}%`;
}
