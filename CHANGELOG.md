# Change Log

## 1.3.2

- Autocompletion was triggered when using `@section` in `.edge` files

## 1.3.1

- Polishing and fix some issues related to Document Links in .ts and .edge files

## 1.3.0

### Features

- Add support for `components/**/.index.edge`. That means if you have a component in `components/button/index.edge`, completion and links will works for `@button` instead of `@button.index`.
- Before, in order to show completions, you had to press `ctrl+space`. Now, completions will show automatically when you type `@` or `@.`. Same for `.ts` files, when you will start typing `edge.render`, completions will show automatically.
- Add Edge built-in tags completions with some links to the documentation in the CompletionItem detail.
- Use different icons for Edge built-in tags and custom tags.

## 1.2.0

- Still another release fixing bundling/missing dependencies

## 1.1.1

- Fix for missing dependencies

## 1.1.2

- Another release fixing missing dependencies

## 1.1.0

- Feat Goto template support

## 1.0.1

- Fix tags match regex

## 1.0.0

- First official release
