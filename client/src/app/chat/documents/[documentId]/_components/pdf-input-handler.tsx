import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {LoaderPinwheel, Send} from "lucide-react";
import React, {useState} from "react";
import {useQueryDocumentById} from "@/services/document/useQueryDocumentById";

interface PDFInputHandlerProps {
    documentId: string;
}

function PDFInputHandler({documentId}: PDFInputHandlerProps) {
    const {queryDocument, isQuerying} = useQueryDocumentById(Number(documentId));
    const [query, setQuery] = useState<string>("");
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;
        const task = queryDocument({query});
        setQuery("");
        await task;
    }
    
    return (
        <>
            <form onSubmit={handleSubmit} className="flex w-full gap-3" autoComplete="off">
                <Input
                    name="query"
                    placeholder="Ask any question..."
                    minLength={3}
                    required
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                />
                <Button 
                    type="submit" 
                    disabled={isQuerying}
                >
                    {isQuerying ? <LoaderPinwheel className="animate-spin"/> : <Send className="text-white"/>}
                </Button>
            </form>
        </>
    );
}

export default PDFInputHandler;
