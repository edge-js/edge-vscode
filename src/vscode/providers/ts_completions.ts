import { IndexerManager } from '../indexer_manager'
import { tsViewsCompletionRegex } from '../../regexes'
import { SuperCompletionItem } from '../wrappers'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

/**
 * Responsible for providing templates completions in .ts/.js files
 */
export class TsCompletionProvider implements CompletionItemProvider {
  /**
   * Check if we are within a view completion context and return view suggestions if so
   */
  async provideCompletionItems(doc: TextDocument, pos: Position) {
    const range = doc.getWordRangeAtPosition(pos, tsViewsCompletionRegex)
    if (!range) return

    const indexer = IndexerManager.getIndexerFromFile(doc.uri.fsPath)
    const suggestions = indexer?.search(doc.getText(range))

    return suggestions?.map((suggestion) => {
      return new SuperCompletionItem({ label: suggestion.name, detail: suggestion.disk })
    })
  }
}
