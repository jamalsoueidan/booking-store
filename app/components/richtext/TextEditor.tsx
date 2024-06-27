import {ActionIcon} from '@mantine/core';
import {Link, RichTextEditor} from '@mantine/tiptap';
import {IconBrandYoutube} from '@tabler/icons-react';
import {type EditorOptions} from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {useEffect, useState} from 'react';

export function TextEditor(options?: Partial<EditorOptions>) {
  const [content, setContent] = useState(options?.content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      TextAlign.configure({types: ['heading', 'paragraph']}),
    ],
    ...options,
  });

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');

    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  useEffect(() => {
    if (
      editor &&
      JSON.stringify(content) !== JSON.stringify(options?.content)
    ) {
      setContent(options?.content);
      editor.commands.setContent(options?.content || '');
    }
  }, [content, editor, options]);

  return (
    <RichTextEditor editor={editor} mih="250px">
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <ActionIcon
          size="lg"
          color="black"
          variant="transparent"
          onClick={addYoutubeVideo}
        >
          <IconBrandYoutube
            style={{width: '100%', height: '100%'}}
            stroke={1}
          />
        </ActionIcon>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
