// Replaced by app-wide mitt bus.
// Re-exports the mitt instance so calendar internals that import this file
// continue to work during the gradual Phase-07 migration.
import { useBus } from '~/composables/use-bus'

export default useBus()
