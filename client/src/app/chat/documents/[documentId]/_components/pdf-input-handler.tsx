import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Send} from "lucide-react";
import React, {useState} from "react";
import {useQueryDocumentById} from "@/services/document/useQueryDocumentById";

interface PDFInputHandlerProps {
    documentId: string;
}

function PDFInputHandler({documentId}: PDFInputHandlerProps) {
    const {queryDocument} = useQueryDocumentById(Number(documentId));
    const [query, setQuery] = useState<string>("");
    
    return (
        <>
            <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any question..."/>
            <Button onClick={x => queryDocument({query})}>
                <Send className="text-white"/>
            </Button>
        </>
    );
}

export default PDFInputHandler;
