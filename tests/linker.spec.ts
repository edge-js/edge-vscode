/* eslint-disable sonarjs/no-duplicate-string */
import { join } from 'node:path'
import { test } from '@japa/runner'
import dedent from 'dedent'
import slash from 'slash'
import { Linker } from '../src/linker'
import { TemplateIndexer } from '../src/template_indexer'

test.group('Views Linker | .edge', () => {
  test('works fine', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/layouts/base.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const template = dedent`
      @!component('components/button', {
        text: 'Login',
        type: 'submit'
      })

      @layout('layouts/base')
      @end
    `

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 30,
          "colStart": 13,
          "line": 0,
        },
        {
          "colEnd": 21,
          "colStart": 9,
          "line": 5,
        },
      ]
    `)

    const paths = result.map((r) => r.templatePath)

    assert.sameDeepMembers(paths, [
      slash(join(fs.basePath, 'resources/views/components/button.edge')),
      slash(join(fs.basePath, 'resources/views/layouts/base.edge')),
    ])
  })

  test('components as tags', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/checkout_form/input.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const template = dedent`
    @!button({
      type: 'primary',
      text: 'Login'
    })

    @!checkoutForm.input({
      type: 'email',
      name: 'email',
    })
    `

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)

    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 8,
          "colStart": 2,
          "line": 0,
        },
        {
          "colEnd": 20,
          "colStart": 2,
          "line": 5,
        },
      ]
    `)
  })

  test('component as tags without !', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/components/checkout_form/input.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const template = dedent`
    @button({
      type: 'primary',
      text: 'Login'
    })

    @checkoutForm.input({
      type: 'email',
      name: 'email',
    })
    `

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)

    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 7,
          "colStart": 1,
          "line": 0,
        },
        {
          "colEnd": 19,
          "colStart": 1,
          "line": 5,
        },
      ]
    `)
  })

  test('ts source type', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')
    await fs.create('resources/views/pages/admin.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const template = dedent`
      return view.render('components/button', {
        props: 42
      })

      return view.renderSync('pages/admin', {})
    `

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'ts',
    })

    const positions = result.map((r) => r.position)

    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 37,
          "colStart": 20,
          "line": 0,
        },
        {
          "colEnd": 35,
          "colStart": 24,
          "line": 4,
        },
      ]
    `)

    const paths = result.map((r) => r.templatePath)

    assert.sameDeepMembers(paths, [
      slash(join(indexer.project.rootPath, 'resources/views/components/button.edge')),
      slash(join(indexer.project.rootPath, 'resources/views/pages/admin.edge')),
    ])
  })

  test('should not detect internal tags as components', async ({ assert, fs }) => {
    const template = dedent`
      @if(true)
      @inject('foo')

      @elseif
      @endif
      @!section
      @vite
      @entryPointScripts
      @entryPointStyles

      @unless(true)
        <p>hey</>
      @end
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    assert.deepEqual(result, [])
  })

  test('should not mark emails as components', async ({ assert, fs }) => {
    const template = `
      router.get('/send-email', async ({ response, session }) => {
          message.from('jul@adonisjs.com')
            .text('Hello world')
            .to('foo@bar.com').subject('My subject')
      })
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'ts',
    })

    assert.deepEqual(result, [])
  })

  test('should not mark slot or section as missing views', async ({ assert, fs }) => {
    const template = `
      <div>
        @!section('body')

        @slot('logo')
        @end
      </div>
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    assert.deepEqual(result, [])
  })

  test('should match component as tags position correctly when there are multiple matches', async ({
    assert,
    fs,
  }) => {
    await fs.create('resources/views/components/map/index.edge', '')

    const template = dedent`
      <div>map</div>
      map

      @!map()
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)
    assert.deepEqual(positions, [{ colEnd: 5, colStart: 2, line: 3 }])
  })

  test('should match component as tag position correctly when there are multiple matches', async ({
    assert,
    fs,
  }) => {
    await fs.create('resources/views/components/button.edge', '')

    const template = dedent`
      components/button


      @component('components/button')
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)
    assert.deepEqual(positions, [{ colEnd: 29, colStart: 12, line: 3 }])
  })

  test('match template in ts file in correct position', async ({ assert, fs }) => {
    await fs.create('resources/views/components/button.edge', '')

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })
    await indexer.scan()

    const template = dedent`
      console.log('components/button')

      return view.render('components/button', {
        props: 42
      })
    `

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'ts',
    })

    const positions = result.map((r) => r.position)
    assert.deepEqual(positions, [{ colEnd: 37, colStart: 20, line: 2 }])
  })

  test('should find link even when the component props include "(" character', async ({
    assert,
    fs,
  }) => {
    await fs.create('resources/views/components/button.edge', '')

    const template = dedent`
      @!button('foo', { test: route('bar') })
    `

    const indexer = new TemplateIndexer({
      rootPath: fs.basePath,
      disks: { default: 'resources/views' },
    })

    await indexer.scan()

    const result = await Linker.getLinks({
      fileContent: template,
      indexer,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)
    assert.deepEqual(positions, [{ colEnd: 8, colStart: 2, line: 0 }])
  })
})
