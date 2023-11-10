/**
 * Used by edge linker
 * Find all the views that are being used inside an Edge template
 */
export const edgeRegex = /(?<=@include\(['"]|@layout\(['"]|@!?component\(['"])([^'">]+)/g

/**
 * Used by edge linker
 * Find all components as tags
 */
export const edgeComponentsAsTagsRegex =
  /@!?(?!include|set|unless|let|eval|inject|!component|if|elseif|vite|entryPointScripts|entryPointStyles|each|click|section|layout|component|slot|!section)(.+)?\(?/g

/**
 * Used by edge suggester
 * Check if we are currently inside a view link and capture the user input
 */
export const viewsCompletionRegex = /(?<=[@include|@layout|@!component]\()(['"])[^'"]*\1/g

/**
 * Used by edge linker
 * Find all components as tags
 */
export const edgeComponentsAsTagsCompletionRegex =
  /@!?(?!include|end|set|unless|let|eval|inject|!component|each|section|layout|component)([\w.]+)/g

/**
 * Used by view linker
 * Find all the views that are being used inside a TS code
 */
export const tsRegex = /(?:[Vv]iew|[Ee]dge)\.render(?:Sync)?\(['"](.*)['"]/g

/**
 * Check if we are currently inside a view link and capture the user input
 */
export const tsViewsCompletionRegex = /(?<=([Ee]dge|[Vv]iew)\.render(?:Sync)?\()(['"])[^'"]*\2/g
