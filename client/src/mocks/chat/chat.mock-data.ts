import { Chat, Citation } from "./chat";

const mockCitations: Citation[] = [
    {
        pageNumber: 1,
        excerpt: "The artificial intelligence revolution began in the early 21st century..."
    },
    {
        pageNumber: 15,
        excerpt: "Machine learning algorithms have transformed the way we process data..."
    },
    {
        pageNumber: 23,
        excerpt: "Deep learning networks can now recognize patterns with remarkable accuracy..."
    }
];

export const mockChats: Chat[] = [
    {
        id: 1,
        role: "USER",
        message: "Can you explain what is artificial intelligence?",
        citations: []
    },
    {
        id: 2,
        role: "AI",
        message: "Artificial Intelligence is a branch of computer science that aims to create intelligent machines. Based on current research...",
        citations: [mockCitations[0], mockCitations[1]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
    {
        id: 3,
        role: "USER",
        message: "How does deep learning work?",
        citations: []
    },
    {
        id: 4,
        role: "AI",
        message: "Deep learning is a subset of machine learning that uses neural networks...",
        citations: [mockCitations[2]]
    },
];