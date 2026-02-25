/**
 * Returns the app-wide mitt event bus instance.
 * Usage:
 *   const bus = useBus()
 *   bus.on('event-name', handler)
 *   bus.emit('event-name', payload)
 *   bus.off('event-name', handler)
 *
 * NOTE: mitt's off() requires the same handler reference used in on().
 * Store the handler in a variable for proper cleanup in onUnmounted().
 */
export const useBus = () => {
  const { $bus } = useNuxtApp()
  return $bus
}
