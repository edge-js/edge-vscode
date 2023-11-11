# Change Log

All notable changes to the "vscode-edge" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 1.0.0

- First official release

## 1.0.1

- Fix tags match regex

## 1.1.0

- Feat Goto template support

## 1.1.1

- Fix for missing dependencies

## 1.1.2

- Another release fixing missing dependencies

## 1.2.0

- Still another release fixing bundling/missing dependencies

## 1.3.0

### Features

- Add support for `components/**/.index.edge`. That means if you have a component in `components/button/index.edge`, completion and links will works for `@button` instead of `@button.index`.
- Before, in order to show completions, you had to press `ctrl+space`. Now, completions will show automatically when you type `@` or `@.`. Same for `.ts` files, when you will start typing `edge.render`, completions will show automatically.
- Add Edge built-in tags completions with some links to the documentation in the CompletionItem detail.
- Use different icons for Edge built-in tags and custom tags.
