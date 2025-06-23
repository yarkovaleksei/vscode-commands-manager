export interface Command {
  id: string
  name: string
  command: string
  groupId: string
  icon?: string
}

export interface Group {
  id: string
  name: string
  icon?: string
}

export interface StorageData {
  version: number
  groups: Group[]
  commands: Command[]
}
