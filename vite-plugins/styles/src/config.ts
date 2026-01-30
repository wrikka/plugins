import type { StylesPluginOptions } from './types'

export const DEFAULT_OPTIONS: StylesPluginOptions = {
  enabled: true,
  unocss: {}
}

export function resolveOptions(options: StylesPluginOptions = {}) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    unocss: {
      ...DEFAULT_OPTIONS.unocss,
      ...options.unocss
    }
  }
}
