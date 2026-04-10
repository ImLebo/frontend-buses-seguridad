import type { SystemAction } from './system-action.type'
import type { SystemModule } from './system-module.type'

export interface PermissionGrant {
  module: SystemModule
  actions: SystemAction[]
}
