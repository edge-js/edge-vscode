/* eslint-disable sonarjs/no-duplicate-string */
import { join } from 'node:path'
import { test } from '@japa/runner'
import slash from 'slash'
import { TemplateIndexer } from '../src/template_indexer'

test.group('Template indexer | Scan', () => {
  test('simple scan', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    const result = await indexer.scan()

    assert.includeDeepMembers(result, [
      {
        path: slash(join(fs.basePath, 'resources/views/components/button.edge')),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
        selfClosedInsertText: `button(\${1})`,
        insertText: `button(\${1}) \n\t$0\n@end`,
      },
      {
        path: slash(join(fs.basePath, 'resources/views/layouts/base.edge')),
        name: 'layouts/base',
        disk: 'default',
        isComponent: false,
        componentName: null,
        selfClosedInsertText: `null(\${1})`,
        insertText: `null(\${1}) \n\t$0\n@end`,
      },
    ])
  })

  test('scan with multiple disks', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')
    await fs.create('node_modules/@dimer/components/foo.edge', '')
    await fs.create('node_modules/@dimer/layouts/foo.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views', dimer: '@dimer' },
    })

    const result = await indexer.scan()

    assert.includeDeepMembers(result, [
      {
        path: slash(join(fs.basePath, 'resources/views/components/button.edge')),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
        selfClosedInsertText: `button(\${1})`,
        insertText: `button(\${1}) \n\t$0\n@end`,
      },
      {
        path: slash(join(fs.basePath, 'resources/views/layouts/base.edge')),
        name: 'layouts/base',
        disk: 'default',
        isComponent: false,
        componentName: null,
        selfClosedInsertText: `null(\${1})`,
        insertText: `null(\${1}) \n\t$0\n@end`,
      },
      {
        path: slash(join(fs.basePath, 'node_modules/@dimer/components/foo.edge')),
        name: 'dimer::components/foo',
        disk: 'dimer',
        isComponent: true,
        componentName: 'dimer.foo',
        selfClosedInsertText: `dimer.foo(\${1})`,
        insertText: `dimer.foo(\${1}) \n\t$0\n@end`,
      },
      {
        path: slash(join(fs.basePath, 'node_modules/@dimer/layouts/foo.edge')),
        name: 'dimer::layouts/foo',
        disk: 'dimer',
        isComponent: false,
        componentName: null,
        selfClosedInsertText: `null(\${1})`,
        insertText: `null(\${1}) \n\t$0\n@end`,
      },
    ])
  })

  test('handle invalid disk path', async ({ assert, fs }) => {
    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: {
        default: 'resources/views',
        foo: 'inexistent/directory',
      },
    })

    const result = await indexer.scan()
    assert.deepEqual(result, [])
  })

  test('dont throws if no disk specified', async ({ assert, fs }) => {
    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: {},
    })

    const result = await indexer.scan()
    assert.deepEqual(result, [])
  })

  test('correctly convert the components names', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/button-group.edge', '')
    await fs.create('resources/views/components/button-group/button.edge', '')
    await fs.create('resources/views/components/base_test.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    const result = await indexer.scan()

    assert.containsSubset(result, [
      {
        path: slash(join(fs.basePath, 'resources/views/components/button.edge')),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
      },
      {
        path: slash(join(fs.basePath, 'resources/views/components/button-group.edge')),
        name: 'components/button-group',
        disk: 'default',
        isComponent: true,
        componentName: 'buttonGroup',
      },
      {
        path: slash(join(fs.basePath, 'resources/views/components/button-group/button.edge')),
        name: 'components/button-group/button',
        disk: 'default',
        isComponent: true,
        componentName: 'buttonGroup.button',
      },
      {
        path: slash(join(fs.basePath, 'resources/views/components/base_test.edge')),
        name: 'components/base_test',
        disk: 'default',
        isComponent: true,
        componentName: 'baseTest',
      },
    ])
  })

  test('correctly prefix secondary disks templates', async ({ assert, fs }) => {
    await fs.create('node_modules/@dimer/components/foo.edge', '')
    await fs.create('node_modules/@dimer/layouts/foo.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views', dimer: '@dimer' },
    })

    const result = await indexer.scan()

    assert.containsSubset(result, [
      {
        path: slash(join(fs.basePath, 'node_modules/@dimer/components/foo.edge')),
        name: 'dimer::components/foo',
        disk: 'dimer',
        isComponent: true,
        componentName: 'dimer.foo',
      },
      {
        path: slash(join(fs.basePath, 'node_modules/@dimer/layouts/foo.edge')),
        name: 'dimer::layouts/foo',
        disk: 'dimer',
        isComponent: false,
        componentName: null,
      },
    ])
  })

  test('components/**/*/index.edge files should be indexed without index.edge suffix', async ({
    assert,
    fs,
  }) => {
    await fs.create('resources/views/components/button/index.edge', '')
    await fs.create('resources/views/components/foo/bar/index.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    const result = await indexer.scan()
    assert.containsSubset(result, [
      {
        path: slash(join(fs.basePath, 'resources/views/components/button/index.edge')),
        name: 'components/button/index',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
      },
      {
        path: slash(join(fs.basePath, 'resources/views/components/foo/bar/index.edge')),
        name: 'components/foo/bar/index',
        disk: 'default',
        isComponent: true,
        componentName: 'foo.bar',
      },
    ])
  })
})

test.group('Template indexer | Search', () => {
  test('simple search', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/foo.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.search('components/but')

    assert.deepEqual(results.length, 1)
    assert.deepEqual(results[0]!.name, 'components/button')
  })

  test('search with empty text should returns everything', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/foo.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.search('')

    assert.deepEqual(results.length, 3)
  })

  test('search text should be sanitized', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/foo.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.search('  components/but  "')

    assert.deepEqual(results.length, 1)
    assert.deepEqual(results[0]!.name, 'components/button')
  })

  test('returns all matching templates', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/foo.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.search('components')

    assert.deepEqual(results.length, 2)
    assert.deepEqual(results[0]!.name, 'components/button')
    assert.deepEqual(results[1]!.name, 'components/foo')
  })

  test('search component should only return components', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/layouts/foo.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.searchComponent('button')

    assert.deepEqual(results.length, 1)
  })

  test('exact search component should only returns exact matches', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/layouts/button.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()
    const results = indexer.searchComponent('button', true)

    assert.deepEqual(results.length, 1)
    assert.deepEqual(results[0]!.name, 'components/button')
  })

  test('search component should be based on componentName', async ({ assert, fs }) => {
    await fs.create('node_modules/@dimer/components/foo.edge', '')
    await fs.create('node_modules/@dimer/layouts/foo.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views', dimerr: '@dimer' },
    })

    await indexer.scan()
    const results = indexer.searchComponent('dimerr.foo')

    assert.deepEqual(results.length, 1)
    assert.deepEqual(results[0]!.name, 'dimerr::components/foo')
    assert.deepEqual(results[0]!.componentName, 'dimerr.foo')
  })

  test('search index component', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button/index.edge', '')
    await fs.create('resources/views/components/foo/bar/index.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()

    const fooResult = indexer.searchComponent('foo')
    const buttonResult = indexer.searchComponent('button')

    assert.deepEqual(fooResult.length, 1)
    assert.deepEqual(fooResult[0]!.componentName, 'foo.bar')

    assert.deepEqual(buttonResult.length, 1)
    assert.deepEqual(buttonResult[0]!.componentName, 'button')
  })
})
