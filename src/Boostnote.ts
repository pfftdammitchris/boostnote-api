import axios, { AxiosInstance } from 'axios'
import * as T from './types'

class Boostnote {
  #req: AxiosInstance

  constructor(token: string) {
    this.#req = axios.create({
      baseURL: 'https://boostnote.io/api',
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /**
   * Retrieve a document
   * @param { string } id - Document ID
   * @return { Promise<T.BoostnoteDocument> }
   */
  async getDocument(id: string) {
    const res = await this.#req.get<
      any,
      { data: { doc: T.BoostnoteDocument } }
    >(`/docs/${id}`)
    return res.data.doc
  }

  /**
   * Retrieve a list of documents
   * @param { string | undefined } opts.title
   * @param { boolean | undefined } opts.archived
   * @param { string | undefined } opts.workspaceId
   * @param { string | undefined } opts.parentFolderId
   * @param { T.OrderBy | undefined } opts.orderBy
   * Order by: 'createdAt' | 'updatedAt'
   * @return { Promise<T.BoostnoteDocument> }
   */
  async getDocuments(opts?: {
    title?: string
    archived?: boolean
    workspaceId?: string
    parentFolderId?: string
    orderBy?: T.OrderBy
  }) {
    const res = await this.#req.get<
      any,
      { data: { docs: T.BoostnoteDocument[] } }
    >(`/docs`, { params: opts })
    return res.data.docs
  }

  /**
   * Create a document
   * @param { string } opts.title
   * @param { string } opts.content
   * @param { string | undefined } opts.workspaceId
   * @param { string | undefined } opts.parentFolder
   * @param { string[] | undefined } opts.tags
   * @return { Promise<T.BoostnoteDocument> }
   */
  async createDocument(opts: {
    title: string
    content: string
    workspaceId?: string
    parentFolder?: string
    tags?: string[]
  }) {
    const res = await this.#req.post<
      any,
      { data: { doc: T.BoostnoteDocument } }
    >(`/docs`, opts)
    return res.data.doc
  }

  /**
   * Update a document
   * @param { string } opts.id
   * @param { string | undefined } opts.title
   * @param { string | undefined } opts.content
   * @param { string | undefined } opts.emoji
   * @param { string | undefined } opts.workspaceId
   * @param { string | undefined } opts.parentFolder
   * @return { Promise<T.BoostnoteDocument> }
   */
  async updateDocument(opts?: {
    id: string
    title?: string
    content?: string
    emoji?: string
    workspaceId?: string
    parentFolder?: string
  }) {
    const { id, ...rest } = opts
    const res = await this.#req.patch<
      any,
      { data: { doc: T.BoostnoteDocument } }
    >(`/docs/${id}`, rest)
    return res.data.doc
  }

  /**
   * Delete a document
   * @param { string } id - Document ID
   * @return { Promise<null> }
   */
  async removeDocument(id: string): Promise<null> {
    await this.#req.delete(`/docs/${id}`)
    return null
  }

  /**
   * Retrieve a folder
   * @param { string } id - Folder ID
   * @return { Promise<T.BoostnoteFolder}
   */
  async getFolder(id: string) {
    const res = await this.#req.get<
      any,
      { data: { folder: T.BoostnoteFolder } }
    >(`/folders/${id}`)
    return res.data.folder
  }

  /**
   * Retrieve a list of folders
   * @param { string | undefined } opts.name
   * @param { string | undefined } opts.workspaceId
   * @param { string | undefined } opts.parentFolder
   * @param { T.OrderBy | undefined } opts.orderBy
   * @return { Promise<T.BoostnoteFolder[]> }
   */
  async getFolders(opts?: {
    name?: string
    workspaceId?: string
    parentFolder?: string
    orderBy?: T.OrderBy
  }) {
    const res = await this.#req.get<
      any,
      { data: { folders: T.BoostnoteFolder[] } }
    >(`/folders`, { params: opts })
    return res.data.folders
  }

  /**
   * Create a folder
   * @param { string | object } opts
   * @param { string | undefined } opts.name
   * @param { string | undefined } opts.emoji
   * @param { string | undefined } opts.workspaceId
   * @param { string | undefined } opts.parentFolderId
   * @return { Promise<T.BoostnoteFolder> }
   */
  async createFolder(name: string): Promise<T.BoostnoteFolder>
  async createFolder(opts: {
    name: string
    emoji?: string
    workspaceId?: string
    parentFolderId?: string
  }): Promise<T.BoostnoteFolder>
  async createFolder(
    opts:
      | string
      | {
          name: string
          emoji?: string
          workspaceId?: string
          parentFolderId?: string
        },
  ) {
    let body = {} as Extract<typeof opts, object>
    if (typeof opts === 'string') {
      body.name = opts
    } else {
      body = opts
    }
    const res = await this.#req.post<
      any,
      { data: { folder: T.BoostnoteFolder } }
    >(`/folders`, body)
    return res?.data?.folder
  }

  /**
   * Remove a folder
   * @param { string } id - Folder ID
   * @param { boolean | undefined } opts.force
   * @return { Promise<null> }
   */
  async removeFolder(id: string, opts?: { force?: boolean }): Promise<null> {
    let params = {} as typeof opts
    if (opts?.force) params.force = true
    await this.#req.delete(`/folders/${id}`, { params })
    return null
  }
}

export default Boostnote
