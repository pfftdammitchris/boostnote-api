import https from 'https'
import { URL } from 'url'
import qs from 'querystring'
import { inspect } from 'util'
import * as T from './types'

class Boostnote {
  #hostname = 'boostnote.io'
  #pathname = '/api'
  #protocol = 'https'
  #token: string;

  [inspect.custom]() {
    return {
      hostname: this.#hostname,
      pathname: this.#pathname,
      token: this.#token,
    }
  }

  constructor(token: string) {
    if (!token) throw new Error(`Token is required`)
    this.#token = token
  }

  #req = (path: string | URL, opts?: https.RequestOptions & { data?: any }) => {
    return new Promise((resolve, reject) => {
      const url = typeof path === 'string' ? new URL(path) : path
      const options: https.RequestOptions = {
        method: opts?.method || 'get',
        headers: this.getHeaders(opts?.headers),
        hostname: this.#hostname,
        path: url.pathname,
      }
      if (/(post|put)/i.test(options.method) && opts?.data) {
        const data = qs.stringify(opts.data)
        options.headers['Content-Length'] = Buffer.byteLength(data)
      }
      const req = https.request(options, (res) => {
        let response = ''
        res
          .on('data', (chunk) => (response += chunk))
          .on('error', reject)
          .on('end', () => resolve(JSON.parse(response)))
      })
      req.on('error', reject)
      req.end()
    })
  }

  getHeaders(opts?: Record<string, any>) {
    return {
      Authorization: `Bearer ${this.#token}`,
      ...opts,
    }
  }

  getUrl(path: string) {
    return new URL(
      `${this.#protocol}://${this.#hostname}${this.#pathname}${path}`,
    )
  }

  /**
   * Retrieve a document
   * @param { string } id - Document ID
   * @return { Promise<T.BoostnoteDocument> }
   */
  async getDocument(id: string) {
    const doc = (await this.#req(this.getUrl(`/docs/${id}`))) as {
      doc: Promise<T.BoostnoteDocument>
    }
    return doc.doc
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
    const url = this.getUrl('/docs')
    if (opts) {
      Object.entries(opts).forEach(([key, value]) =>
        url.searchParams.set(key, String(value)),
      )
    }
    const response = (await this.#req(url)) as { docs: T.BoostnoteDocument[] }
    return response.docs
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
    const url = this.getUrl(`/docs`)
    const response = (await this.#req(url, { method: 'post', data: opts })) as {
      doc: T.BoostnoteDocument
    }
    return response.doc
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
    const url = this.getUrl(`/docs/${opts.id}`)
    const response = (await this.#req(url, {
      method: 'patch',
      data: opts,
    })) as { doc: T.BoostnoteDocument }
    return response.doc
  }

  /**
   * Delete a document
   * @param { string } id - Document ID
   * @return { Promise<null> }
   */
  async removeDocument(id: string): Promise<null> {
    await this.#req(`/docs/${id}`, { method: 'delete' })
    return null
  }

  /**
   * Retrieve a folder
   * @param { string } id - Folder ID
   * @return { Promise<T.BoostnoteFolder}
   */
  async getFolder(id: string) {
    const url = this.getUrl(`/folders/${id}`)
    const req = (await this.#req(url)) as {
      folder: T.BoostnoteFolder
    }
    return req.folder
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
    const url = this.getUrl('/folders')
    if (opts) {
      Object.entries(opts).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    const req = (await this.#req(url)) as {
      folders: T.BoostnoteFolder[]
    }
    return req.folders
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
    let body = {} as any
    if (typeof opts === 'string') {
      body.name = opts
    } else {
      body = opts
    }
    body = qs.stringify(body)
    const url = this.getUrl(`/folders`)
    const response = (await this.#req(url, { data: body })) as {
      folder: T.BoostnoteFolder
    }
    return response.folder
  }

  /**
   * Remove a folder
   * @param { string } id - Folder ID
   * @param { boolean | undefined } opts.force
   * @return { Promise<null> }
   */
  async removeFolder(id: string, opts?: { force?: boolean }): Promise<null> {
    const params = {} as typeof opts
    const url = this.getUrl(`/folders/${id}`)
    if (opts?.force) params.force = true
    await this.#req(url, { method: 'post' })
    return null
  }
}

export default Boostnote
