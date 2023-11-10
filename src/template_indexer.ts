import { join, relative } from 'path'
import fg from 'fast-glob'
import slash from 'slash'

import { camelCase } from 'change-case'
import type { Project, Template } from './types'

/**
 * Responsible for indexing the templates in the given project
 * Store the templates index in memory and also provide
 * methods to search the templates
 */
export class TemplateIndexer {
  /**
   * Templates index
   */
  #templates: Template[] = []

  constructor(public readonly project: Project) {}

  /**
   * Returns absolute paths to the disks
   */
  #normalizeDiskPath(project: Project) {
    const result = Object.entries(project.disks).map(([diskName, diskPath]) => {
      diskPath = diskPath.startsWith('@') ? `node_modules/${diskPath}` : diskPath

      const path = slash(join(project.rootPath, diskPath))
      return [diskName, path]
    })

    return Object.fromEntries(result) as Record<string, string>
  }

  /**
   * Search for a component by the given text
   */
  searchComponent(text: string, exact = false) {
    text = text.replaceAll(/[@|!|(|)]/g, '')

    const components = this.#templates.filter((template) => template.isComponent)
    if (!text) return components

    return components.filter((template) => {
      if (exact) return template.componentName === text

      return template.componentName!.startsWith(text)
    })
  }

  /**
   * Search for a template by the given text
   */
  search(text: string) {
    text = text.replaceAll(/"|'/g, '').replaceAll('.', '/').replaceAll(/\s/g, '')
    if (!text) return this.#templates

    return this.#templates.filter((template) => template.name.startsWith(text))
  }

  /**
   * Create a glob pattern for searching edge files in the given disks
   * using fast-glob
   */
  async #searchEdgeFilesInDisks(normalizedDisks: Record<string, string>) {
    let diskDirectoriesPattern = Object.values(normalizedDisks)
      .map((disk) => slash(`${disk}`))
      .join(',')

    if (Object.keys(normalizedDisks).length > 1) {
      diskDirectoriesPattern = `{${diskDirectoriesPattern}}`
    }

    const globPattern = slash(`${diskDirectoriesPattern}/**/**.edge`)
    const files = await fg(globPattern, { onlyFiles: true, caseSensitiveMatch: false })

    return files.map((file) => slash(file))
  }

  /**
   * Convert the given edge filename to a valid edge Tag Name
   */
  #componentFileNameToTagName(diskPath: string, path: string, disk: string) {
    const diskComponentsPath = join(diskPath, 'components')

    /**
     * If the file is not located in the disk/components directory, then it's
     * not a component
     */
    const isComponent = path.startsWith(diskComponentsPath)
    if (!isComponent) return null

    let componentName = slash(relative(diskComponentsPath, path))
      .replace('.edge', '')
      .split('/')
      .map((part) => camelCase(part))
      .join('.')

    /**
     * If the component is located in a secondary disk, we need to prefix the
     * component name with the disk name
     */
    if (disk !== 'default' && componentName) {
      componentName = `${disk}.${componentName}`
    }

    return componentName
  }

  /**
   * Scan the project for templates and store the result in memory
   */
  async scan() {
    if (Object.keys(this.project.disks).length === 0) return []

    const disks = this.#normalizeDiskPath(this.project)
    const matchedFiles = await this.#searchEdgeFilesInDisks(disks)

    this.#templates = matchedFiles.map((path) => {
      const [disk, diskPath] = Object.entries(disks).find(([, diskPath]) =>
        path.startsWith(diskPath)
      )!

      const filename = relative(diskPath, path).replace('.edge', '')
      const name = disk === 'default' ? filename : `${disk}::${filename}`
      const componentName = this.#componentFileNameToTagName(diskPath, path, disk)

      return { path, name, disk, isComponent: !!componentName, componentName }
    })

    return this.#templates
  }
}
