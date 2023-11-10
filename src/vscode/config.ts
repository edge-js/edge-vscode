import { workspace } from 'vscode'

interface Config {
  disks: Record<string, string> | undefined
}

/**
 * Store the extension configuration
 */
export class ExtConfig {
  public static readonly EXTENSION_NAME = 'vscode-edge'

  public static readonly CONFIG_NAME = 'edge'

  /**
   * Get the disks configuration
   */
  public static get disks() {
    const config = workspace.getConfiguration(this.CONFIG_NAME)

    return config.get<Config['disks']>('disks') ?? { default: 'resources/views' }
  }

  /**
   * Hook to listen for configuration changes
   * If immediate is `true`, the callback will be called immediately
   */
  public static onDidChange(callback: () => void, options?: { immediate: boolean }) {
    if (options && options.immediate) callback()

    workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(this.CONFIG_NAME)) callback()
    })
  }
}
