import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {FilePenLine} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useUpdateDocumentById} from "@/services/document/useUpdateDocumentById";
import {useState} from "react";

interface PDFUpdateProps {
    documentId: number;
}

const PdfUpdate = ({documentId}: PDFUpdateProps) => {
    const {updateDocumentById, isLoading} = useUpdateDocumentById(documentId);
    const [documentName, setDocumentName] = useState("");
    const [popOverOpen, setPopOverOpen] = useState(false);

    const handleUpdateDocument = async () => {
        setPopOverOpen(false);
        setDocumentName("");
        await updateDocumentById({id: documentId, documentName});
    }

    return (
        <Popover open={popOverOpen} onOpenChange={() => setPopOverOpen(prevState => {
            if (isLoading) return prevState;
            return !prevState;
        })}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="tiny"
                    className={`${isLoading ? "text-gray-400 animate-bounce" : ""}`}
                >
                    <FilePenLine/>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="space-y-4 mr-4">
                <div>
                    <div className="my-2"> Update
                        document
                        name
                    </div>
                </div>
                <Input
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Document name to update"
                />
                <Button
                    onClick={handleUpdateDocument}
                    className="text-white w-full"
                > Update </Button>
            </PopoverContent>
        </Popover>
    )
}

export default PdfUpdate;