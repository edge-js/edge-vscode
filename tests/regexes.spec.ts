import { test } from '@japa/runner'
import { viewsCompletionRegex } from '../src/regexes'

test.group('Regexes | viewsCompletionRegex', () => {
  test('empty tag', ({ assert }) => {
    const match = "@include('')".match(viewsCompletionRegex)
    assert.deepEqual(match, [''])
  })

  test('tag with text', ({ assert }) => {
    const match = "@include('welcome')".match(viewsCompletionRegex)
    assert.deepEqual(match, ['welcome'])
  })

  test('@!component match', ({ assert }) => {
    const match = "@!component('welcome')".match(viewsCompletionRegex)
    assert.deepEqual(match, ['welcome'])
  })

  test('@layout match', ({ assert }) => {
    const match = "@layout('welcome')".match(viewsCompletionRegex)
    assert.deepEqual(match, ['welcome'])
  })

  test('special characters', ({ assert }) => {
    const match = "@include('welcome_dude')".match(viewsCompletionRegex)
    assert.deepEqual(match, ['welcome_dude'])
  })
})
