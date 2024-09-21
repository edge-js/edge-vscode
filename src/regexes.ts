/**
 * Find all the views that are being used inside an Edge template
 */
export const edgeRegex = /(@include|@!?component)\(['"]([^'"]+)['"]/g

/**
 * Find all components as tags inside an Edge template
 */
export const edgeComponentsAsTagsRegex =
  /^[ \t]*(@!?(?!include|includeIf|set|can|unless|svg|let|eval|inject|stack|dd|dump|pushTo|pushOnceTo|!component|if|elseif|else|vite|entryPointScripts|entryPointStyles|each|assign|debugger|component|slot|newError)(.+?))\(.*/gm

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
  /@!?(?!include|includeIf|set|can|unless|svg|let|eval|inject|stack|dd|dump|pushTo|pushOnceTo|!component|if|elseif|else|vite|entryPointScripts|entryPointStyles|each|assign|debugger|component|slot|newError)(.+)?\(?/g

/**
 * Check if we are currently inside a view link and capture the user input to suggest completions
 */
export const tsViewsCompletionRegex = /(?<=([Ee]dge|[Vv]iew)\.render(?:Sync)?\()(['"])[^'"]*\2/g
