export interface BoostnoteDocument {
  id: string
  emoji: string
  head: {
    id: number
    title: string
    content: string
    createdAt: string
  }
  workspaceId: string
  parentFolderId?: string
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BoostnoteFolder {
  id: string
  name: string
  pathname: string
  emoji: string
  childDocsIds: string[]
  childFolderIds: string[]
  teamId: string
  workspaceId: string
  parentFolderId?: string
  createdAt: string
  updatedAt: string
}

export type OrderBy = 'createdAt' | 'updatedAt'
