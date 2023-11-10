import type { TemplateIndexer } from './template_indexer'

export interface Project {
  /**
   * Path to the project root
   */
  rootPath: string

  /**
   * Paths to the different mounted disks
   */
  disks: Record<string, string>
}

/**
 * Represent an Edge file in the project
 */
export interface Template {
  /**
   * Absolute path to the template file
   */
  path: string

  /**
   * Name of the template.
   * @example `button` for `resources/views/components/button.edge`
   */
  name: string

  /**
   * The edge disk on which the template is located
   */
  disk: string

  /**
   * Whether the template is a component or not ( located in a components/ directory )
   */
  isComponent: boolean

  /**
   * The name of the component if the template is a component
   * @see https://edgejs.dev/docs/components/introduction#filename-to-tagname-conversion
   */
  componentName: string | null
}

/**
 * Different options accepted by the `getLinks` method
 */
export interface GetLinksOptions {
  /**
   * The content of the file to parse
   */
  fileContent: string

  /**
   * Whether the file is an Edge file or a Typescript file
   */
  sourceType: 'edge' | 'ts'

  /**
   * The indexer related to the file
   */
  indexer: TemplateIndexer
}
