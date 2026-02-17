'use client';
import { history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { bracketMatching, defaultHighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { drawSelection, EditorView, keymap } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { livePreviewExtension } from './live-preview';

const myTheme = EditorView.theme({
  // вынести в отдельный файл все стили
  '&': {
    height: '100%',
    width: '100%',
    fontSize: '16px',
  },
  '.cm-content': {
    fontFamily: 'Menlo, Monaco, Lucida Console, monospace',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'white',
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-line': { padding: '0 10px' },
});

const extensions = [
  history(), // Undo/Redo
  drawSelection(), // Красивое выделение
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  markdown(), // Поддержка Markdown
  bracketMatching(), // Подсветка парных скобок
  livePreviewExtension,
  indentOnInput(), // Авто-отступ при вводе
  EditorView.lineWrapping, // Автоматический перенос длинных строк
  myTheme,
  keymap.of([
    ...historyKeymap,
    indentWithTab, // Tab работает как отступ, а не прыжок по кнопкам
  ]),
];

export const Editor = () => {
  return (
    <div className='size-full flex justify-start items-center flex-col pt-[15px]'>
      <div className='max-w-[900px]'>
        <div className='w-full flex justify-start'></div>
        <CodeMirror
          value={'test test test test'}
          extensions={extensions} // наши зависимости
          basicSetup={false} // отключаем базовые зависимости (пропс выше)
          theme={myTheme} // наша тема
        />
      </div>
    </div>
  );
};
