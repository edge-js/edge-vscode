import { Range } from 'vscode'
import { IndexerManager } from '../indexer_manager'
import { edgeComponentsAsTagsRegex, viewsCompletionRegex } from '../../regexes'
import { SuperCompletionItem } from '../wrappers'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

/**
 * Responsible for providing components/templates completions in .edge files
 */
export class EdgeCompletionProvider implements CompletionItemProvider {
  async provideCompletionItems(doc: TextDocument, pos: Position) {
    const indexer = IndexerManager.getIndexerFromFile(doc.uri.fsPath)

    /**
     * Check if we are within a view completion context and return view suggestions if so
     */
    const basicTagRanges = doc.getWordRangeAtPosition(pos, viewsCompletionRegex)
    if (basicTagRanges) {
      const text = doc.getText(basicTagRanges)
      return indexer?.search(text)?.map((suggestion) => {
        return new SuperCompletionItem({ label: suggestion.name, detail: suggestion.disk })
      })
    }

    /**
     * Second view completion context possibility : components as tags. We either check if we are
     * in a component as tag context or if the last two characters are '@' or '@!'
     */
    const componentAsTagRange = doc.getWordRangeAtPosition(pos, edgeComponentsAsTagsRegex)
    const lastTwoChars = doc.getText(new Range(pos.translate(0, -2), pos))

    if (componentAsTagRange || lastTwoChars.trim() === '@' || lastTwoChars === '@!') {
      const text = doc.getText(componentAsTagRange)

      return indexer?.searchComponent(text)?.map(({ componentName, disk }) => {
        return new SuperCompletionItem({ label: componentName!, detail: disk })
      })
    }
  }
}
