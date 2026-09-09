import type { HTMLAttributes, SyntheticEvent } from 'react';

type ReadOnlyMatrixInteractionProps = HTMLAttributes<HTMLDivElement> & {
  'data-cost-matrix-read-only'?: 'true';
};

const INTERACTIVE_SELECTOR = 'button, input, select, textarea, [contenteditable="true"]';

const blockReadOnlyInteraction = (event: SyntheticEvent<HTMLElement>) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('[data-readonly-allow="true"]')) return;
  if (!target.closest(INTERACTIVE_SELECTOR)) return;

  event.preventDefault();
  event.stopPropagation();
};

export const getReadOnlyMatrixInteractionProps = (
  isReadOnly: boolean,
): ReadOnlyMatrixInteractionProps => {
  if (!isReadOnly) return {};

  return {
    'data-cost-matrix-read-only': 'true',
    'aria-readonly': true,
    onClickCapture: blockReadOnlyInteraction,
    onChangeCapture: blockReadOnlyInteraction,
    onInputCapture: blockReadOnlyInteraction,
    onBeforeInputCapture: blockReadOnlyInteraction,
    onKeyDownCapture: blockReadOnlyInteraction,
    onPasteCapture: blockReadOnlyInteraction,
    onDropCapture: blockReadOnlyInteraction,
  };
};
