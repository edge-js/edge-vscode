/* eslint-disable sonarjs/no-duplicate-string */
import { join } from 'node:path'
import { test } from '@japa/runner'
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

    assert.deepEqual(result, [
      {
        path: join(fs.basePath, 'resources/views/components/button.edge'),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
      },
      {
        path: join(fs.basePath, 'resources/views/layouts/base.edge'),
        name: 'layouts/base',
        disk: 'default',
        isComponent: false,
        componentName: null,
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
      disks: { default: 'resources/views', dimerr: '@dimer' },
    })

    const result = await indexer.scan()

    assert.includeDeepMembers(result, [
      {
        path: join(fs.basePath, 'resources/views/components/button.edge'),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
      },
      {
        path: join(fs.basePath, 'resources/views/layouts/base.edge'),
        name: 'layouts/base',
        disk: 'default',
        isComponent: false,
        componentName: null,
      },
      {
        path: join(fs.basePath, 'node_modules/@dimer/components/foo.edge'),
        name: 'dimerr::components/foo',
        disk: 'dimerr',
        isComponent: true,
        componentName: 'dimerr.foo',
      },
      {
        path: join(fs.basePath, 'node_modules/@dimer/layouts/foo.edge'),
        name: 'dimerr::layouts/foo',
        disk: 'dimerr',
        isComponent: false,
        componentName: null,
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

    assert.includeDeepMembers(result, [
      {
        path: join(fs.basePath, 'resources/views/components/button.edge'),
        name: 'components/button',
        disk: 'default',
        isComponent: true,
        componentName: 'button',
      },
      {
        path: join(fs.basePath, 'resources/views/components/button-group.edge'),
        name: 'components/button-group',
        disk: 'default',
        isComponent: true,
        componentName: 'buttonGroup',
      },
      {
        path: join(fs.basePath, 'resources/views/components/button-group/button.edge'),
        name: 'components/button-group/button',
        disk: 'default',
        isComponent: true,
        componentName: 'buttonGroup.button',
      },
      {
        path: join(fs.basePath, 'resources/views/components/base_test.edge'),
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
      disks: { default: 'resources/views', dimerr: '@dimer' },
    })

    const result = await indexer.scan()

    assert.includeDeepMembers(result, [
      {
        path: join(fs.basePath, 'node_modules/@dimer/components/foo.edge'),
        name: 'dimerr::components/foo',
        disk: 'dimerr',
        isComponent: true,
        componentName: 'dimerr.foo',
      },
      {
        path: join(fs.basePath, 'node_modules/@dimer/layouts/foo.edge'),
        name: 'dimerr::layouts/foo',
        disk: 'dimerr',
        isComponent: false,
        componentName: null,
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
})