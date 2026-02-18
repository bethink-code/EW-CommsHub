'use client';

import { useRef, useEffect, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface VariableEditorProps {
  value: string;
  onChange?: (value: string) => void;
  variables: Record<string, string>;
  placeholder?: string;
  className?: string;
  rows?: number;
  readOnly?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

/** Escape HTML entities */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Convert raw text (with {Variable} placeholders) to HTML with styled tokens */
export function textToHtml(text: string, variables: Record<string, string>): string {
  const escaped = escapeHtml(text);

  // Replace {VarName} with styled, non-editable spans
  const withTokens = escaped.replace(/\{(\w+)\}/g, (match, varName) => {
    const resolved = variables[varName];
    if (resolved !== undefined) {
      return `<span class="var-token" data-var="${varName}" contenteditable="false" title="{${varName}}">${escapeHtml(resolved)}</span>`;
    }
    // Unknown variable — leave as raw text
    return match;
  });

  // Replace newlines with <br>
  return withTokens.replace(/\n/g, '<br>');
}

/** Walk the DOM and extract raw text, restoring {Variable} placeholders for tokens */
function htmlToText(element: HTMLElement): string {
  let result = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === 'BR') {
        result += '\n';
      } else if (el.classList.contains('var-token')) {
        const varName = el.dataset.var;
        result += varName ? `{${varName}}` : (el.textContent || '');
      } else {
        // Recurse into other elements (e.g. divs inserted by browser)
        result += htmlToText(el);
        // Some browsers wrap lines in divs — treat closing div as newline
        if (el.tagName === 'DIV' && el.nextSibling) {
          result += '\n';
        }
      }
    }
  }
  return result;
}

// =============================================================================
// READ-ONLY VARIANT
// =============================================================================

function VariableDisplay({ value, variables, className }: {
  value: string;
  variables: Record<string, string>;
  className?: string;
}) {
  return (
    <div
      className={className || 'variable-editor'}
      dangerouslySetInnerHTML={{ __html: textToHtml(value, variables) }}
    />
  );
}

// =============================================================================
// EDITABLE VARIANT
// =============================================================================

function EditableVariableEditor({
  value,
  onChange,
  variables,
  placeholder,
  className,
  rows = 10,
}: VariableEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const internalChangeRef = useRef(false);
  const lastValueRef = useRef(value);

  // Sync DOM when value changes from outside (template switch, channel change)
  useEffect(() => {
    if (internalChangeRef.current) {
      internalChangeRef.current = false;
      lastValueRef.current = value;
      return;
    }

    if (editorRef.current && value !== lastValueRef.current) {
      editorRef.current.innerHTML = textToHtml(value, variables);
      lastValueRef.current = value;
    }
  }, [value, variables]);

  // Set initial content on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = textToHtml(value, variables);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render tokens when variables change (e.g. client changes)
  useEffect(() => {
    if (editorRef.current) {
      const sel = window.getSelection();
      const hadFocus = document.activeElement === editorRef.current;

      editorRef.current.innerHTML = textToHtml(value, variables);

      if (hadFocus && editorRef.current) {
        editorRef.current.focus();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  const handleInput = useCallback(() => {
    if (!editorRef.current || !onChange) return;
    const rawText = htmlToText(editorRef.current);
    internalChangeRef.current = true;
    lastValueRef.current = rawText;
    onChange(rawText);
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  }, []);

  const minHeight = Math.max(100, rows * 24);

  return (
    <div
      ref={editorRef}
      className={className || 'variable-editor'}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder || 'Type your message...'}
      style={{ minHeight }}
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      role="textbox"
      aria-multiline="true"
    />
  );
}

// =============================================================================
// MAIN EXPORT
// =============================================================================

export function VariableEditor(props: VariableEditorProps) {
  if (props.readOnly) {
    return <VariableDisplay value={props.value} variables={props.variables} className={props.className} />;
  }
  return <EditableVariableEditor {...props} />;
}

export default VariableEditor;
