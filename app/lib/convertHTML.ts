import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import {generateHTML} from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';

export const convertHTML = (value?: string) => {
  return generateHTML(JSON.parse(value || '') as any, [
    StarterKit,
    Underline,
    Link,
    Highlight,
    TextAlign.configure({types: ['heading', 'paragraph']}),
    Youtube,
  ]);
};
