/**
 * Find all the views that are being used inside an Edge template
 */
export const edgeRegex = /(@include|@layout|@!?component)\(['"]([^'"]+)['"]/g

/**
 * Find all components as tags inside an Edge template
 */
export const edgeComponentsAsTagsRegex =
  /^[ \t]*(@!?(?!include|set|can|unless|let|eval|inject|!component|if|elseif|vite|entryPointScripts|entryPointStyles|each|click|section|layout|component|slot|!section)(.+?))\(.*/gm

/**
 * Find all the views that are being used inside a TS/Js file
 */
export const tsRegex = /((?:[Vv]iew|[Ee]dge)\.render(?:Sync)?\(['"](.*?)['"])/g

/**
 * Check if we are currently inside a view link and capture the user input to suggest completions
 */
export const viewsCompletionRegex = /(?<=@include\(['"]|@layout\(['"]|@!component\(['"])[^'"]*/g

/**
 * Check if we are currently inside a component as tag and capture the user input
 * to suggest completions
 */
export const edgeComponentsAsTagsCompletionRegex =
  /@!?(?!include|set|unless|let|eval|inject|!component|if|elseif|vite|entryPointScripts|entryPointStyles|each|click|section|layout|component|slot|!section)(.+)?\(?/g

/**
 * Check if we are currently inside a view link and capture the user input to suggest completions
 */
export const tsViewsCompletionRegex = /(?<=([Ee]dge|[Vv]iew)\.render(?:Sync)?\()(['"])[^'"]*\2/g
