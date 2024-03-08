import {Link, RichTextEditor} from '@mantine/tiptap';
import {type EditorOptions} from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const defaultContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: {textAlign: 'left'},
      content: [
        {type: 'text', text: 'Hej, mit navn er '},
        {type: 'text', marks: [{type: 'highlight'}], text: '[Navn]'},
        {
          type: 'text',
          text: ', og jeg er en passioneret makeup artist med over ',
        },
        {type: 'text', marks: [{type: 'highlight'}], text: '[antal]'},
        {
          type: 'text',
          text: ' års erfaring i skønhedsbranchen. Min rejse startede, da jeg opdagede ',
        },
        {
          type: 'text',
          marks: [{type: 'italic'}],
          text: 'min kærlighed til kunsten at forvandle og fremhæve folks naturlige skønhed gennem makeup',
        },
        {type: 'text', text: '. Siden da har jeg arbejdet med alt fra '},
        {type: 'text', marks: [{type: 'bold'}], text: 'brudemakeup'},
        {type: 'text', text: ' til '},
        {type: 'text', marks: [{type: 'bold'}], text: 'fashion shows'},
        {type: 'text', text: ', og jeg elsker hvert eneste øjeblik af det.'},
      ],
    },
  ],
};

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function TextEditor(options?: Partial<EditorOptions>) {
  const haveContent = options ? isJsonString(options?.content as any) : false;
  const content = haveContent
    ? JSON.parse(options?.content as any)
    : defaultContent;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({types: ['heading', 'paragraph']}),
    ],
    ...options,
    content: content as undefined,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
