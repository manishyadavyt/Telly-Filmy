'use client';

import React, { useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Link2,
  Minus,
  Image as ImageIcon,
  AlignLeft,
  Code,
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  id?: string;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'Write your article content here...',
  minHeight = '420px',
  id,
}: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelection = () => {
    const el = textareaRef.current;
    if (!el) return { start: 0, end: 0, selected: '' };
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      selected: el.value.substring(el.selectionStart, el.selectionEnd),
    };
  };

  const replaceSelection = useCallback(
    (before: string, after: string = '', defaultText = 'text') => {
      const el = textareaRef.current;
      if (!el) return;
      const { start, end, selected } = getSelection();
      const text = selected || defaultText;
      const replacement = `${before}${text}${after}`;
      const newValue =
        value.substring(0, start) + replacement + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        el.focus();
        const newCursor = start + before.length + text.length + after.length;
        el.setSelectionRange(newCursor, newCursor);
      });
    },
    [value, onChange]
  );

  const insertLine = useCallback(
    (prefix: string, defaultText = 'Heading') => {
      const el = textareaRef.current;
      if (!el) return;
      const { start, end, selected } = getSelection();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const text = selected || defaultText;
      const before = value.substring(0, lineStart);
      const after = value.substring(end);
      const newValue = `${before}${prefix}${text}${after}`;
      onChange(newValue);
      requestAnimationFrame(() => {
        el.focus();
        const newCursor = lineStart + prefix.length + text.length;
        el.setSelectionRange(newCursor, newCursor);
      });
    },
    [value, onChange]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const el = textareaRef.current;
      if (!el) {
        onChange(value + (value ? '\n\n' : '') + text);
        return;
      }
      const { start, end } = getSelection();
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        el.focus();
        const newCursor = start + text.length;
        el.setSelectionRange(newCursor, newCursor);
      });
    },
    [value, onChange]
  );

  const handleLink = useCallback(() => {
    const { selected } = getSelection();
    const url = prompt('Enter link URL:', 'https://');
    if (!url) return;
    const linkText = selected || 'link text';
    replaceSelection(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', linkText);
  }, [replaceSelection]);

  const handleImage = useCallback(() => {
    const url = prompt('Enter Image URL to insert into article:', 'https://');
    if (!url) return;
    const alt = prompt('Image caption / alt text (optional):', 'Article Image') || 'Article Image';
    insertAtCursor(`\n\n<img src="${url}" alt="${alt}" />\n\n`);
  }, [insertAtCursor]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const buttons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: 'Bold',
      action: () => replaceSelection('<strong>', '</strong>', 'bold text'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: 'Italic',
      action: () => replaceSelection('<em>', '</em>', 'italic text'),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: 'H2 Heading',
      action: () => insertLine('<h2>', 'Subheading</h2>\n'),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      label: 'H3 Heading',
      action: () => insertLine('<h3>', 'Section Title</h3>\n'),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: 'Bullet List',
      action: () => insertAtCursor('\n<ul>\n  <li>Key highlight 1</li>\n  <li>Key highlight 2</li>\n</ul>\n'),
    },
    {
      icon: <Quote className="w-4 h-4" />,
      label: 'Quote Block',
      action: () => replaceSelection('<blockquote>', '</blockquote>', 'Notable quote or insider statement...'),
    },
    {
      icon: <Link2 className="w-4 h-4" />,
      label: 'Add Hyperlink',
      action: handleLink,
    },
    {
      icon: <ImageIcon className="w-4 h-4 text-orange-400" />,
      label: 'Insert Image in Content',
      action: handleImage,
    },
    {
      icon: <Minus className="w-4 h-4" />,
      label: 'Horizontal Divider',
      action: () => insertAtCursor('\n<hr />\n'),
    },
    {
      icon: <AlignLeft className="w-4 h-4" />,
      label: 'Paragraph Wrap',
      action: () => replaceSelection('<p>', '</p>', 'Paragraph text...'),
    },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-slate-700 overflow-hidden bg-slate-900 focus-within:border-orange-500 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-700 bg-slate-800/80 flex-wrap">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.label}
            onClick={btn.action}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none active:bg-slate-600 min-w-[34px] min-h-[34px] flex items-center justify-center"
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight }}
        className="w-full bg-transparent px-4 py-3.5 text-slate-200 text-sm font-mono leading-relaxed resize-y focus:outline-none placeholder:text-slate-600"
        spellCheck
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 border-t border-slate-700">
        <span className="text-[11px] text-slate-400">
          💡 Tip: You can also use the Media Manager on the right to insert uploaded images directly.
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{wordCount} words</span>
          <span className="text-xs text-slate-500">({charCount} chars)</span>
        </div>
      </div>
    </div>
  );
}
