import { edgeComponentsAsTagsRegex, edgeRegex, tsRegex } from './regexes'
import type { GetLinksOptions } from './types'

/**
 * Responsible for parsing the document and returning all the links found
 */
export class Linker {
  /**
   * Find the line and column of the match
   */
  static #matchIndexToPosition(
    match: RegExpMatchArray,
    matchCounts: Record<string, number>,
    lines: string[]
  ) {
    const fullMatch = match[0]!.trim()
    const templateName = match[2]!

    if (!templateName) return

    if (!matchCounts[fullMatch]) {
      matchCounts[fullMatch] = 0
    }

    let lineIndex = -1
    for (let i = 0; i <= matchCounts[fullMatch]!; i++) {
      lineIndex = lines.findIndex((line, index) => line.includes(fullMatch) && index > lineIndex)
    }
    const colStart = lines[lineIndex]!.indexOf(templateName)
    const colEnd = colStart + templateName.length

    matchCounts[fullMatch]!++
    return { line: lineIndex, colStart, colEnd }
  }

  /**
   * Get all the links that are being referenced as components as tags
   */
  static async #getComponentAsTagsLinks(options: GetLinksOptions) {
    if (options.sourceType !== 'edge') return []

    const matches = Array.from(options.fileContent.matchAll(edgeComponentsAsTagsRegex) || [])
    const matchCounts: Record<string, number> = {}
    const lines = options.fileContent.split('\n')

    return matches.map((match) => {
      const result = options.indexer?.searchComponent(match[2]!, true)

      return {
        templatePath: result[0]?.path,
        position: this.#matchIndexToPosition(match, matchCounts, lines),
      }
    })
  }

  /**
   * Get all the links that are referenced in the file
   */
  static async #getTemplateLinks(options: GetLinksOptions) {
    const regex = options.sourceType === 'edge' ? edgeRegex : tsRegex

    const matches = Array.from(options.fileContent.matchAll(regex) || [])
    const matchCounts: Record<string, number> = {}
    const lines = options.fileContent.split('\n')

    return matches.map((match) => {
      const result = options.indexer?.search(match[2]!)

      return {
        templatePath: result?.[0]?.path,
        position: this.#matchIndexToPosition(match, matchCounts, lines),
      }
    })
  }

  /**
   * Parse the whole document and return all the links found
   */
  static async getLinks(options: GetLinksOptions) {
    const basicLinksPromise = this.#getTemplateLinks(options)
    const componentsAsTagsPromise = this.#getComponentAsTagsLinks(options)

    const results = await Promise.all([basicLinksPromise, componentsAsTagsPromise])
    return results.flat().filter((link) => !!link.templatePath)
  }
}
