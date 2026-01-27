import React from 'react';

interface MarkdownRendererProps {
  content: string;
  onLinkClick?: (href: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, onLinkClick }) => {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let codeBlock: string[] = [];
    let inCodeBlock = false;
    let tableRows: string[] = [];
    let inTable = false;
    let key = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="space-y-2 ml-4 list-disc mb-4">
            {listItems.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlock.length > 0) {
        elements.push(
          <pre key={`code-${key++}`} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 overflow-x-auto mb-4">
            <code className="text-sm text-slate-200 font-mono">{codeBlock.join('\n')}</code>
          </pre>
        );
        codeBlock = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const rows = tableRows.map(row => 
          row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
        );
        
        elements.push(
          <div key={`table-${key++}`} className="overflow-x-auto mb-4">
            <table className="min-w-full border border-slate-700 rounded-lg">
              <thead className="bg-slate-800">
                <tr>
                  {rows[0].map((cell, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-semibold border-b border-slate-700">
                      {parseInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(2).map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-slate-800 last:border-b-0">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-2 text-sm">
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    const parseInline = (text: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      let current = '';
      let i = 0;

      while (i < text.length) {
        // Links: [text](url)
        if (text[i] === '[') {
          if (current) {
            parts.push(current);
            current = '';
          }
          
          const linkStart = i;
          let textEnd = text.indexOf(']', i);
          if (textEnd !== -1 && text[textEnd + 1] === '(') {
            const urlEnd = text.indexOf(')', textEnd);
            if (urlEnd !== -1) {
              const linkText = text.substring(i + 1, textEnd);
              const url = text.substring(textEnd + 2, urlEnd);
              
              // Check if it's a proof link (ends with .md)
              if (url.endsWith('.md')) {
                const proofId = url
                  .replace('MiniCaseStudies/TidesOS/MiniCaseStudies/', '')
                  .replace('MiniCaseStudies/LogiScan/MiniCaseStudies/', '')
                  .replace('.md', '')
                  .toLowerCase()
                  .replace(/case(\d+)-/, 'case$1-')
                  .replace(/_/g, '-');
                
                parts.push(
                  <button
                    key={`link-${parts.length}`}
                    onClick={() => onLinkClick?.(proofId)}
                    className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400/60 transition-all cursor-pointer"
                  >
                    {linkText}
                  </button>
                );
              } else {
                parts.push(
                  <a
                    key={`link-${parts.length}`}
                    href={url}
                    className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400/60 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkText}
                  </a>
                );
              }
              i = urlEnd + 1;
              continue;
            }
          }
        }

        // Bold: **text**
        if (text[i] === '*' && text[i + 1] === '*') {
          if (current) {
            parts.push(current);
            current = '';
          }
          const end = text.indexOf('**', i + 2);
          if (end !== -1) {
            parts.push(
              <strong key={`bold-${parts.length}`} className="font-bold">
                {text.substring(i + 2, end)}
              </strong>
            );
            i = end + 2;
            continue;
          }
        }

        // Inline code: `text`
        if (text[i] === '`' && text[i - 1] !== '`' && text[i + 1] !== '`') {
          if (current) {
            parts.push(current);
            current = '';
          }
          const end = text.indexOf('`', i + 1);
          if (end !== -1) {
            parts.push(
              <code key={`code-${parts.length}`} className="bg-slate-800/50 px-1.5 py-0.5 rounded text-amber-400 font-mono text-sm">
                {text.substring(i + 1, end)}
              </code>
            );
            i = end + 1;
            continue;
          }
        }

        current += text[i];
        i++;
      }

      if (current) {
        parts.push(current);
      }

      return parts;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          flushCodeBlock();
        } else {
          flushList();
          flushTable();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        continue;
      }

      // Tables
      if (trimmed.includes('|') && trimmed.indexOf('|') !== trimmed.lastIndexOf('|')) {
        flushList();
        if (!inTable) {
          inTable = true;
        }
        tableRows.push(trimmed);
        continue;
      } else if (inTable) {
        inTable = false;
        flushTable();
      }

      // Empty lines
      if (!trimmed) {
        flushList();
        continue;
      }

      // Headings
      if (trimmed.startsWith('#')) {
        flushList();
        const level = trimmed.match(/^#+/)?.[0].length || 1;
        const text = trimmed.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const className = level === 1 
          ? 'text-2xl sm:text-3xl font-bold text-white mb-4'
          : level === 2
          ? 'text-xl sm:text-2xl font-bold text-white mb-3 mt-6'
          : level === 3
          ? 'text-lg sm:text-xl font-bold text-white mb-3 mt-4'
          : 'text-base font-bold text-white mb-2 mt-3';
        
        elements.push(
          React.createElement(HeadingTag, { key: `heading-${key++}`, className }, parseInline(text))
        );
        continue;
      }

      // Horizontal rule
      if (trimmed.match(/^(---+|===+)$/)) {
        flushList();
        elements.push(<hr key={`hr-${key++}`} className="border-t border-slate-700 my-6" />);
        continue;
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.match(/^\d+\.\s/)) {
        const content = trimmed.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
        listItems.push(content);
        continue;
      }

      // Regular paragraphs
      flushList();
      if (trimmed) {
        elements.push(
          <p key={`p-${key++}`} className="leading-relaxed mb-3">
            {parseInline(trimmed)}
          </p>
        );
      }
    }

    flushList();
    flushCodeBlock();
    flushTable();

    return elements;
  };

  return <div className="markdown-content">{parseMarkdown(content)}</div>;
};
