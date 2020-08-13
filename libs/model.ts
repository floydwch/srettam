import { getConnection } from './connection'

class DocRepository {
  db: any

  async load(name: string) {
    const connection = await getConnection()
    this.db = await connection.docs(name, { indexBy: 'id' })
    await this.db.load()
  }

  async create(doc: any) {
    await this.db.put(doc)
  }

  async get(id: string) {
    const result = await this.db.get(id)
    return result
  }

  async all() {
    const results = await this.db.query(() => true)
    return results
  }

  async slice(since: number | string, limit: number) {
    const items = await this.all()

    if (typeof since === 'string') {
      var sinceIndex: number =
        items.findIndex((item: any) => item.id === since) + 1
    } else {
      var sinceIndex = since
    }

    const results = items.slice(sinceIndex, sinceIndex + limit)
    return results
  }

  async filter(fn: (item: any) => any) {
    const results = await this.db.query(fn)
    return results
  }
}

class DocModel {
  doc: any

  constructor(doc: any) {
    this.doc = doc
  }

  static objects = new DocRepository()

  static async load(name: string) {
    await this.objects.load(name)
  }

  async save() {
    await DocModel.objects.create(this.doc)
  }
}

export { DocModel }
