'use client'

import {
  AdmonitionDirectiveDescriptor,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  InsertSandpack,
  MDXEditor,
  SandpackConfig,
  ShowSandpackInfo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  thematicBreakPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
} from '@mdxeditor/editor'
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar'
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { CodeToggle } from '@mdxeditor/editor/plugins/toolbar/components/CodeToggle'
import { CreateLink } from '@mdxeditor/editor/plugins/toolbar/components/CreateLink'
import { DiffSourceToggleWrapper } from '@mdxeditor/editor/plugins/toolbar/components/DiffSourceToggleWrapper'
import { InsertAdmonition } from '@mdxeditor/editor/plugins/toolbar/components/InsertAdmonition'
import { InsertCodeBlock } from '@mdxeditor/editor/plugins/toolbar/components/InsertCodeBlock'
import { InsertImage } from '@mdxeditor/editor/plugins/toolbar/components/InsertImage'
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import '@mdxeditor/editor/style.css'
import type { ForwardedRef } from 'react'

export const ProductEditor = ({
  editorRef,
  diffMarkdown,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  diffMarkdown: string
} & MDXEditorProps) => {
  const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: 'react',
    presets: [
      {
        label: 'React',
        name: 'react',
        meta: 'live react',
        sandpackTemplate: 'react',
        sandpackTheme: 'light',
        snippetFileName: '/App.js',
        snippetLanguage: 'jsx',
        initialSnippetContent: '',
      },
    ],
  }

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            text: 'Plain Text',
            js: 'JavaScript',
            typescript: 'TypeScript',
            css: 'CSS',
            java: 'Java',
            json: 'Json',
            golang: 'Go',
          },
        }),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        diffSourcePlugin({
          diffMarkdown: diffMarkdown,
          viewMode: 'rich-text',
        }),
        linkPlugin(),
        linkDialogPlugin({
          linkAutocompleteSuggestions: [
            'https://pengode.com',
            'https://github.com',
          ],
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    when: (editor) => editor?.editorType === 'sandpack',
                    contents: () => <ShowSandpackInfo />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <CreateLink />
                        <InsertAdmonition />
                        <InsertImage />
                        <InsertCodeBlock />
                        <InsertSandpack />
                      </>
                    ),
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
