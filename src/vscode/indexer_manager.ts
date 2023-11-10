import { dirname } from 'path'
import { workspace } from 'vscode'
import { TemplateIndexer } from '../template_indexer'
import { Logger } from './logger'
import { ExtConfig } from './config'

/**
 * IndexerManager is responsible for keeping track of all the indexers and
 * starting them when the extension is activated
 */
export class IndexerManager {
  static #indexers: TemplateIndexer[] = []

  /**
   * Get the indexer related to the given file
   */
  static getIndexerFromFile(file: string) {
    return this.#indexers.find((indexer) => {
      const filename = file.toLowerCase()
      return filename.startsWith(indexer.project.rootPath.toLowerCase())
    })
  }

  /**
   * Bootstrap the indexers
   */
  static async bootstrap() {
    const projects = await workspace.findFiles('{**/package.json}', '**/node_modules/**', undefined)

    Logger.info(`Found ${projects.length} projects`)

    this.#indexers = projects.map((project) => {
      const projectDirectory = dirname(project.fsPath)
      return new TemplateIndexer({ rootPath: projectDirectory, disks: ExtConfig.disks })
    })

    for (const indexer of this.#indexers) {
      Logger.info(`Indexing ${indexer.project.rootPath}`)
      const templates = await indexer.scan()
      Logger.info(`Found ${templates.length} templates`)
    }
  }
}
