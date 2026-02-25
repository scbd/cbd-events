/**
 * Returns Capacitor platform info.
 * - platform: 'web' | 'ios' | 'android'
 * - isNative: true when running inside a native Capacitor shell
 */
export const usePlatform = () => {
  const { $platform, $isNative } = useNuxtApp()
  return { platform: $platform, isNative: $isNative }
}
