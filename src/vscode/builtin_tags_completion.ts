/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-template-curly-in-string */

import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemTag,
  MarkdownString,
  SnippetString,
} from 'vscode'

/**
 * `@if`
 */
const ifItem = new CompletionItem('if', CompletionItemKind.Keyword)
ifItem.insertText = new SnippetString('if(${1}) \n\t$0\n@end')
ifItem.documentation = new MarkdownString(
  'Insert an @if statement\n\nhttps://edgejs.dev/docs/conditionals'
)
ifItem.detail = 'Edge conditional'

/**
 * `@elseif`
 */
const elseIfItem = new CompletionItem('elseif', CompletionItemKind.Keyword)
elseIfItem.insertText = new SnippetString('elseif(${1})\n\t$0\n@end')
elseIfItem.documentation = new MarkdownString(
  'Insert an @elseif statement\n\nhttps://edgejs.dev/docs/conditionals'
)
elseIfItem.detail = 'Edge conditional'

/**
 * `@else`
 */
const elseItem = new CompletionItem('else', CompletionItemKind.Keyword)
elseItem.insertText = new SnippetString('else\n\t$0\n@end')
elseItem.documentation = new MarkdownString(
  'Insert an @else statement\n\nhttps://edgejs.dev/docs/conditionals'
)
elseItem.detail = 'Edge conditional'

/**
 * `@unless`
 */
const unlessItem = new CompletionItem('unless', CompletionItemKind.Keyword)
unlessItem.insertText = new SnippetString('unless(${1})\n\t$0\n@end')
unlessItem.documentation = new MarkdownString(
  'Insert an @unless statement\n\nhttps://edgejs.dev/docs/conditionals#the-unless-tag'
)
unlessItem.detail = 'Inverse of @if'

/**
 * `@each`
 */
const eachItem = new CompletionItem('each', CompletionItemKind.Keyword)
eachItem.insertText = new SnippetString('each(${1:item} in ${2:collections})\n\t$0\n@end')
eachItem.documentation = new MarkdownString(
  'Insert an @each statement\n\nhttps://edgejs.dev/docs/loops'
)
eachItem.detail = 'Basic loop'

/**
 * `@component`
 */
const componentItem = new CompletionItem('component', CompletionItemKind.Keyword)
componentItem.insertText = new SnippetString("component('${1:componentName}', { $2 })\n\t$0\n@end")
componentItem.documentation = new MarkdownString(
  'Insert an @component statement\n\nhttps://edgejs.dev/docs/components/introduction'
)
componentItem.detail = 'Render a component'

/**
 * Self closing `@component`
 */
const selfClosingComponentItem = new CompletionItem('component', CompletionItemKind.Keyword)
selfClosingComponentItem.insertText = new SnippetString("component('${1:componentName}', { $2 })")
selfClosingComponentItem.documentation = new MarkdownString(
  'Insert an @component statement\n\nhttps://edgejs.dev/docs/components/introduction'
)
selfClosingComponentItem.detail = 'Render a self closing component'

/**
 * `@slot`
 */
const slotItem = new CompletionItem('slot', CompletionItemKind.Keyword)
slotItem.insertText = new SnippetString('slot(${1:slotName})\n\t$0\n@end')
slotItem.documentation = new MarkdownString(
  'Insert an @slot statement\n\nhttps://edgejs.dev/docs/components/slots'
)
slotItem.detail = 'Define a slot'

/**
 * `@inject`
 */
const injectItem = new CompletionItem('inject', CompletionItemKind.Keyword)
injectItem.insertText = new SnippetString('inject(${1:variable})')
injectItem.documentation = new MarkdownString(
  'Insert an @inject statement\n\nhttps://edgejs.dev/docs/components/provide_inject'
)
injectItem.detail = 'Inject/share state with children'

/**
 * `@newError`
 */
const newErrorItem = new CompletionItem('newError', CompletionItemKind.Keyword)
newErrorItem.insertText = new SnippetString(
  "newError('${1:message}', \\$caller.filename, \\$caller.line, \\$caller.col)"
)
newErrorItem.documentation = new MarkdownString('Insert an @newError statement')

/**
 * `@include`
 */
const includeItem = new CompletionItem('include', CompletionItemKind.Keyword)
includeItem.insertText = new SnippetString("include('${1:filename}')")
includeItem.documentation = new MarkdownString(
  'Insert an @include statement\n\nhttps://edgejs.dev/docs/partials'
)
includeItem.detail = 'Include a partial'

/**
 * `@includeIf`
 */
const includeIf = new CompletionItem('includeIf', CompletionItemKind.Keyword)
includeIf.insertText = new SnippetString("includeIf(${1:condition}, '${2:filename}')")
includeIf.documentation = new MarkdownString(
  'Insert an @includeIf statement\n\nhttps://edgejs.dev/docs/partials#include-conditionally'
)
includeIf.detail = 'Include a partial conditionally'

/**
 * `@svg`
 */
const svgItem = new CompletionItem('svg', CompletionItemKind.Keyword)
svgItem.insertText = new SnippetString("svg('${1}')")
svgItem.documentation = new MarkdownString(
  'Render SVG icon as a tag\n\nhttps://edgejs.dev/docs/edge-iconify'
)
svgItem.detail = 'Render SVG icon as a tag'

/**
 * `@debugger`
 */
const debuggerItem = new CompletionItem('debugger', CompletionItemKind.Keyword)
debuggerItem.insertText = new SnippetString('debugger')
debuggerItem.documentation = new MarkdownString(
  'Define debugger breakpoint\n\nhttps://edgejs.dev/docs/debugging'
)
debuggerItem.detail = 'Define debugger breakpoint'

/**
 * `@let`
 */
const letItem = new CompletionItem('let', CompletionItemKind.Keyword)
letItem.insertText = new SnippetString('let ${1:variable} = ${2:value}')
letItem.documentation = new MarkdownString(
  'Define a local variable\n\nhttps://edgejs.dev/docs/templates_state#inline-variables'
)
letItem.detail = 'Define a local variable'

/**
 * `@assign`
 */
const assignItem = new CompletionItem('assign', CompletionItemKind.Keyword)
assignItem.insertText = new SnippetString("assign(${1:expression} = '${2:value}')")
assignItem.documentation = new MarkdownString(
  'Mutate an existing variable\n\nSee https://edgejs.dev/docs/templates_state#inline-variables'
)
assignItem.detail = 'Mutate an existing variable'

/**
 * `@section` Deprecated in Edge 6.
 */
const sectionItem = new CompletionItem('section', CompletionItemKind.Keyword)
sectionItem.insertText = new SnippetString('section(${1:name})\n\t$0\n@end')
sectionItem.documentation = new MarkdownString(
  'Insert an @section statement\n\nThis tag is deprecated in Edge 6, please see https://edgejs.dev/docs/changelog/upgrading-to-v6'
)
sectionItem.tags = [CompletionItemTag.Deprecated]
sectionItem.detail = 'Deprecated in Edge 6'

/**
 * `@layout` Deprecated in Edge 6.
 */
const layoutItem = new CompletionItem('layout', CompletionItemKind.Keyword)
layoutItem.insertText = new SnippetString("layout('${1:layoutName}')")
layoutItem.documentation = new MarkdownString(
  'Insert an @layout statement\n\nThis tag is deprecated in Edge 6, please see https://edgejs.dev/docs/changelog/upgrading-to-v6'
)
layoutItem.tags = [CompletionItemTag.Deprecated]
layoutItem.detail = 'Deprecated in Edge 6'

/**
 * `@set`. Deprecated in Edge 6.
 */
const setItem = new CompletionItem('set', CompletionItemKind.Keyword)
setItem.insertText = new SnippetString("set('${1:variable}', ${2:value})")
setItem.documentation = new MarkdownString(
  'Insert an @set statement\n\nThis tag is deprecated in Edge 6, please see https://edgejs.dev/docs/changelog/upgrading-to-v6'
)
setItem.tags = [CompletionItemTag.Deprecated]
setItem.detail = 'Deprecated in Edge 6'

export const builtinTags = [
  ifItem,
  elseIfItem,
  elseItem,
  unlessItem,
  eachItem,
  componentItem,
  slotItem,
  injectItem,
  newErrorItem,
  includeItem,
  includeIf,
  svgItem,
  debuggerItem,
  letItem,
  assignItem,
  sectionItem,
  layoutItem,
  setItem,
]

export const builtinSelfClosingTags = [selfClosingComponentItem]
