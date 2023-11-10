import { pathToFileURL } from 'node:url'
import {
  DocumentLink,
  type DocumentLinkProvider,
  Position,
  Range,
  type TextDocument,
  Uri,
} from 'vscode'
import { IndexerManager } from '../indexer_manager'
import { Linker } from '../../linker'

/**
 * Responsible for providing links ( Go To Click ) on templates in .edge files
 */
export class EdgeLinksProvider implements DocumentLinkProvider {
  /**
   * Parse the whole document and return all the links found
   */
  async provideDocumentLinks(doc: TextDocument) {
    const indexer = IndexerManager.getIndexerFromFile(doc.uri.fsPath)
    if (!indexer) return []

    const links = await Linker.getLinks({
      sourceType: 'edge',
      fileContent: doc.getText(),
      indexer,
    })

    return links.map((link) => {
      const templateUri = Uri.parse(pathToFileURL(link.templatePath!).href)

      const start = new Position(link.position.line, link.position.colStart)
      const end = new Position(link.position.line, link.position.colEnd)

      return new DocumentLink(new Range(start, end), templateUri)
    })
  }
}
