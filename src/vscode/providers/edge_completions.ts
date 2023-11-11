import { CompletionItemKind, Position, Range } from 'vscode'
import { IndexerManager } from '../indexer_manager'
import { edgeComponentsAsTagsCompletionRegex, viewsCompletionRegex } from '../../regexes'
import { SuperCompletionItem } from '../wrappers'
import { builtinTags } from '../builtin_tags_completion'
import type { CompletionItem, CompletionItemProvider, TextDocument } from 'vscode'

/**
 * Responsible for providing components/templates completions in .edge files
 */
export class EdgeCompletionProvider implements CompletionItemProvider {
  async provideCompletionItems(doc: TextDocument, pos: Position) {
    let completionItems: CompletionItem[] = []
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
     * Check if we are within a tag completion context and return builtin tag suggestions if so
     */
    const range = new Range(new Position(pos.line, 0), pos)
    const tagMatch = doc.getText(range).match(/\s*@(\w*)$/)
    if (tagMatch) {
      completionItems = builtinTags.filter((tag) => tag.label.toString().startsWith(tagMatch[1]!))
    }

    /**
     * Check if we are within a component as tag completion context and return component suggestions if so
     */
    const componentAsTagRange = doc.getWordRangeAtPosition(pos, edgeComponentsAsTagsCompletionRegex)
    if (componentAsTagRange) {
      const text = doc.getText(componentAsTagRange)
      const items = indexer?.searchComponent(text)?.map(({ componentName, disk }) => {
        return new SuperCompletionItem({
          label: componentName!,
          detail: disk,
          kind: CompletionItemKind.Constructor,
        })
      })

      completionItems.push(...(items ?? []))
    }

    return completionItems
  }
}
