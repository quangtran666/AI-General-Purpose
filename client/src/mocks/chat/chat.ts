export interface Citation {
    pageNumber: number;
    excerpt: string;
}

export interface Chat {
    id: number;
    role: "AI" | "USER";
    message: string;
    citations: Citation[];
}