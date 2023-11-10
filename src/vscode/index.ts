import { type ExtensionContext, RelativePattern, type Uri, languages, workspace } from 'vscode'
import { IndexerManager } from './indexer_manager'
import { ExtConfig } from './config'
import { Logger } from './logger'
import { TsCompletionProvider } from './providers/ts_completions'
import { EdgeCompletionProvider } from './providers/edge_completions'
import { EdgeLinksProvider } from './providers/edge_links'
import { TsLinksProvider } from './providers/ts_links'

export async function activate(context: ExtensionContext) {
  /**
   * Re-index projects when a new .edge file has been created/deleted
   */
  const watcherPattern = new RelativePattern(workspace.workspaceFolders![0]!, '**/*.{edge}')
  const watcher = workspace.createFileSystemWatcher(watcherPattern)
  async function reIndex(file: Uri) {
    Logger.info(`File changed: ${file.fsPath}`)
    const indexer = IndexerManager.getIndexerFromFile(file.fsPath)
    if (!indexer) return

    const res = await indexer.scan()
    Logger.info(`Found ${res.length} templates`)
  }

  watcher.onDidCreate(reIndex)
  watcher.onDidDelete(reIndex)
  watcher.onDidChange(reIndex)

  /**
   * Re-bootstrap and index projects when the configuration changes
   */
  ExtConfig.onDidChange(
    async () => {
      Logger.info('Configuration changed, re-indexing projects')
      await IndexerManager.bootstrap()
    },
    { immediate: true }
  )

  const edgeSelector = [{ language: 'edge', scheme: 'file' }]
  const jsSelectors = [
    { language: 'javascript', scheme: 'file' },
    { language: 'typescript', scheme: 'file' },
  ]

  /**
   * Autocompletion and links for views in TS files
   */
  const viewsTsLink = languages.registerDocumentLinkProvider(jsSelectors, new TsLinksProvider())
  const viewsCompletion = languages.registerCompletionItemProvider(
    jsSelectors,
    new TsCompletionProvider()
  )

  /**
   * Autocompletion and links for views in Edge files
   */
  const edgeLinks = languages.registerDocumentLinkProvider(edgeSelector, new EdgeLinksProvider())
  const edgeCompletion = languages.registerCompletionItemProvider(
    edgeSelector,
    new EdgeCompletionProvider()
  )

  context.subscriptions.push(viewsCompletion, viewsTsLink, edgeCompletion, edgeLinks)
}
