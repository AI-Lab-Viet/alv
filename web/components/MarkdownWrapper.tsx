import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownWrapper({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p className="text-sm break-words whitespace-pre-wrap" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1
            className="text-lg break-words whitespace-pre-wrap font-bold"
            {...props}
          />
        ),
        li: ({ node, ...props }) => (
          <li
            className="text-sm break-words whitespace-pre-wrap list-disc ml-4"
            {...props}
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
