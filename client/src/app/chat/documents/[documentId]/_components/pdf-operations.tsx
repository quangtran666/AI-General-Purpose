import PdfUpdate from "@/app/chat/documents/[documentId]/_components/pdf-update";
import PdfDelete from "@/app/chat/documents/[documentId]/_components/pdf-delete";

interface PdfOperationsProps {
    documentId: string;
}

const PdfOperations = ({documentId}: PdfOperationsProps) => {
    return (
        <div className="flex gap-2">
            <PdfUpdate documentId={Number(documentId)}/>
            <PdfDelete documentId={Number(documentId)}/>
        </div>
    )
}

export default PdfOperations