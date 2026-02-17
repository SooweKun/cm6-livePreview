import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import type { DecorationSet, PluginValue } from '@codemirror/view';
import { Decoration, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';

// Декорация, которая скрывает текст (делает его невидимым)
const hideDecoration = Decoration.replace({});

class LivePreviewPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    // Пересчитываем декорации при изменении документа или перемещении курсора
    if (update.docChanged || update.selectionSet) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const selection = view.state.selection.main;

    // Получаем номер строки, где сейчас находится курсор
    const cursorLine = view.state.doc.lineAt(selection.head).number;

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter: (node) => {
          // Проверяем типы узлов, которые являются "форматированием"
          // В CM6 markdown это обычно названия с префиксом "HeaderMark", "EmphasisMark" и т.д.
          if (node.name.includes('Mark') || node.name.includes('Formatting')) {
            const line = view.state.doc.lineAt(node.from).number;

            // Если курсор НЕ на этой строке — скрываем разметку
            if (line !== cursorLine) {
              builder.add(node.from, node.to, hideDecoration);
            }
          }
        },
      });
    }

    return builder.finish();
  }
}

export const livePreviewExtension = ViewPlugin.fromClass(LivePreviewPlugin, {
  decorations: (v) => v.decorations,
});
