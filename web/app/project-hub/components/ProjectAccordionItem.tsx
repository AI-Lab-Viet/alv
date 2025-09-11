import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";

interface ProjectAccordionItemProps {
    value: string;
    title: string;
    type: "text" | "list";
    content?: string;
    items?: string[];
    listType?: "checkmarks" | "numbers" | "dots";
}

export default function ProjectAccordionItem({
    value,
    title,
    type,
    content,
    items,
    listType = "checkmarks"
}: ProjectAccordionItemProps) {
    const renderListItem = (item: string, index: number) => {
        switch (listType) {
            case "checkmarks":
                return (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-lg tracking-tight">{item}</span>
                    </li>
                );
            case "numbers":
                return (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                                {index + 1}
                            </span>
                        </div>
                        <span className="text-gray-700 text-lg tracking-tight">{item}</span>
                    </li>
                );
            case "dots":
                return (
                    <li key={index} className="text-gray-700 leading-relaxed text-lg tracking-tight">
                        <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{item}</span>
                        </div>
                    </li>
                );
            default:
                return null;
        }
    };

    return (
        <AccordionItem value={value} className="px-2">
            <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg lg:text-2xl tracking-tight">{title}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
                {type === "text" && content && (
                    <p className="text-gray-700 leading-relaxed text-lg tracking-tight">
                        {content}
                    </p>
                )}
                {type === "list" && items && (
                    <ul className={listType === "dots" ? "space-y-4" : "space-y-3"}>
                        {items.map((item, index) => renderListItem(item, index))}
                    </ul>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
