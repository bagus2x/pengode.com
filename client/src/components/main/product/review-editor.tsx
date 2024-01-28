'use client'

import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  directivesPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
} from '@mdxeditor/editor'
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar'
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { CreateLink } from '@mdxeditor/editor/plugins/toolbar/components/CreateLink'
import { InsertAdmonition } from '@mdxeditor/editor/plugins/toolbar/components/InsertAdmonition'
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import '@mdxeditor/editor/style.css'
import { type ForwardedRef } from 'react'

export const ReviewEditor = ({
  editorRef,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
} & MDXEditorProps) => {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
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
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertAdmonition />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}
