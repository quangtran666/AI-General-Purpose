import {Button} from "@/components/ui/button";
import {BookX} from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React, {useState} from "react";
import {useDeleteDocumentById} from "@/services/document/useDeleteDocumentById";

interface PDFDeleteProps {
    documentId: number;
}

const PdfDelete = ({documentId}: PDFDeleteProps) => {
    const {deleteDocumentById, isLoading} = useDeleteDocumentById(documentId);
    const [popOverOpen, setPopOverOpen] = useState(false);

    const handleDeleteDocument = async () => {
        setPopOverOpen(false);
        await deleteDocumentById();
    }

    return (
        <AlertDialog open={popOverOpen} onOpenChange={() => {
            setPopOverOpen(prevState => {
                if (isLoading) return prevState;
                return !prevState;
            })
        }}>
            <AlertDialogTrigger asChild className="mr-4">
                <Button
                    variant="ghost"
                    size="tiny"
                    className={`${isLoading ? "text-gray-400 animate-bounce" : ""}`}
                >
                    <BookX/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-2 mr-4">
                <AlertDialogHeader>
                    <AlertDialogTitle className="my-2">Delete current document</AlertDialogTitle>
                    <div className="border-1 p-3 rounded-lg text-sm text-gray-300">
                        Click button below to delete current document
                        <div className="list-disc ml-4">
                            <div>- Double check you are sure you want to delete</div>
                            <div>- Once deleted you cannot recover it</div>
                        </div>
                    </div>
                </AlertDialogHeader>
                <Button
                    onClick={handleDeleteDocument}
                    className="text-white w-full bg-red-500"
                > Delete </Button>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PdfDelete;