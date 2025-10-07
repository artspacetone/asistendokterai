import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

// Fungsi baru yang lebih canggih untuk merender URL dan teks tebal (**)
const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    // Regex untuk menangkap URL atau teks yang diapit **...**
    const regex = /(\bhttps?:\/\/[^\s]+)|(\*\*.*?\*\*)/g;
    const parts = text.split(regex).filter(Boolean); // filter(Boolean) untuk menghapus undefined/empty strings

    return parts.map((part, index) => {
        // Cek jika bagian adalah URL
        if (/^https?:\/\//.test(part)) {
            return (
                <a 
                    key={index} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 underline hover:text-sky-800 dark:hover:text-sky-300"
                >
                    {part}
                </a>
            );
        }
        // Cek jika bagian adalah teks tebal
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index}>
                    {part.substring(2, part.length - 2)}
                </strong>
            );
        }
        // Jika tidak, itu adalah teks biasa
        return part;
    });
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  const renderContent = () => {
    const elements = [];
    const lines = text.split('\n');
    let inList = false;
    let inTable = false;
    let tableContent: { headers: string[], rows: string[][] } = { headers: [], rows: [] };

    const flushList = (listItems: React.ReactNode[]) => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-4">{listItems}</ul>);
      }
    };
    
    const flushTable = () => {
        if(inTable) {
            elements.push(
                <div key={`table-wrapper-${elements.length}`} className="my-4 overflow-x-auto">
                    <table className="min-w-full border border-slate-300 dark:border-slate-600 border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-200 dark:bg-slate-600">
                                {tableContent.headers.map((header, i) => (
                                    <th key={i} className="border border-slate-300 dark:border-slate-600 p-2 text-left font-semibold">{header.trim()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent.rows.map((row, i) => (
                                <tr key={i} className="odd:bg-white dark:odd:bg-slate-700/50 even:bg-slate-50 dark:even:bg-slate-700">
                                    {row.map((cell, j) => (
                                        <td key={j} className="border border-slate-300 dark:border-slate-600 p-2">{cell.trim()}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            tableContent = { headers: [], rows: [] };
            inTable = false;
        }
    };

    let listItems: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const key = `line-${index}`;

      // Table parsing
      if (line.startsWith('|')) {
        if (!inTable) { // End of previous block
            flushList(listItems); listItems = [];
            inTable = true;
        }
        const cells = line.split('|').slice(1, -1);
        if (tableContent.headers.length === 0) {
            tableContent.headers = cells;
        } else if (!line.startsWith('| :---')) {
            tableContent.rows.push(cells);
        }
        return; // Continue table parsing
      } else if (inTable) {
          flushTable();
      }

      // Headings
      if (line.startsWith('### **')) {
        flushList(listItems); listItems = [];
        elements.push(<h3 key={key} className="text-xl font-bold mt-4 mb-2 pb-1 border-b border-slate-300 dark:border-slate-600">{line.replace(/### \*\*/g, '').replace(/\*\*/g, '')}</h3>);
        inList = false;
      } else if (line.startsWith('#### ')) {
        flushList(listItems); listItems = [];
        elements.push(<h4 key={key} className="text-lg font-semibold mt-3 mb-1">{line.replace(/#### /g, '')}</h4>);
        inList = false;
      }
      // List items
      else if (line.trim().startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        // Gunakan renderer baru untuk list item
        listItems.push(<li key={key}>{renderFormattedText(line.trim().substring(2))}</li>);
      }
      // Horizontal Rule or Spacer
      else if (line.trim() === '---') {
        flushList(listItems); listItems = [];
        elements.push(<hr key={key} className="my-4 border-slate-300 dark:border-slate-600" />);
        inList = false;
      }
      // Paragraph
      else if (line.trim() !== '') {
        flushList(listItems); listItems = [];
        // Gunakan renderer baru untuk paragraf
        elements.push(<p key={key} className="my-2 whitespace-pre-wrap">{renderFormattedText(line)}</p>);
        inList = false;
      }
    });

    flushList(listItems);
    flushTable();
    return elements;
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {renderContent()}
    </div>
  );
};

export default MarkdownRenderer;
