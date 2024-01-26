import Decimal from 'decimal.js'

export function delay(delayInMills: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delayInMills)
  })
}

export function avatar(seed: string, url?: string | null) {
  if (url) return url

  return `https://api.dicebear.com/7.x/fun-emoji/png?seed=${seed}`
}

export function env(key: string) {
  const value = process.env[key]
  if (!value) throw new Error(`Please set ${key} in .env file`)
  return value
}

export class RupiahFormat implements Intl.NumberFormat {
  private numberFormat = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })

  format(value: number | bigint | string | Decimal): string {
    return this.numberFormat.format(value as any)
  }

  resolvedOptions(): Intl.ResolvedNumberFormatOptions {
    return this.numberFormat.resolvedOptions()
  }

  formatToParts(number?: number | bigint | undefined): Intl.NumberFormatPart[] {
    return this.numberFormat.formatToParts(number)
  }

  formatRange(start: number | bigint, end: number | bigint): string {
    return this.numberFormat.formatRange(start, end)
  }

  formatRangeToParts(
    start: number | bigint,
    end: number | bigint,
  ): Intl.NumberRangeFormatPart[] {
    return this.numberFormat.formatRangeToParts(start, end)
  }
}

export const RupiahFormatter = new RupiahFormat()
