import {Link} from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {generateHTML} from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import {useMemo} from 'react';
import {isJsonString} from './TextEditor';

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

export function TextViewer({content}: {content: string}) {
  const haveContent = isJsonString(content as any);
  const contentJSON = haveContent ? JSON.parse(content as any) : defaultContent;

  const output = useMemo(() => {
    return generateHTML(contentJSON as any, [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({types: ['heading', 'paragraph']}),
    ]);
  }, [contentJSON]);

  return (
    <div
      dangerouslySetInnerHTML={{__html: output}}
      data-testid="about-me-text"
    />
  );
}
