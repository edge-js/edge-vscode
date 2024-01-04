import { CompletionItem, MarkdownString, SnippetString } from 'vscode'
import type { CompletionItemKind, Range } from 'vscode'

export class SuperCompletionItem extends CompletionItem {
  constructor(options: {
    label: string
    insertText?: string
    documentation?: string
    detail?: string
    kind?: CompletionItemKind
    range?: Range
  }) {
    super(options.label, options.kind)
    this.detail = options.detail
    if (options.insertText) {
      this.insertText = new SnippetString(options.insertText)
    }
    this.documentation = new MarkdownString(options.documentation as string)
    this.range = options.range
  }
}
