// Book data interface for validation
export interface BookData {
    title: string;
    author: string;
    description: string;
}

export const validateBookInput = (bookData: BookData): string | null => {
    const titleRegex = /^[a-zA-Z0-9\s\-\.\,\;\:\!\?\'\/\"]+$/;
    const authorRegex = /^[a-zA-Z\s\-\.]+$/;
    const descriptionRegex = /^[a-zA-Z0-9\s\-\.\,\:\;\!\?\'\"\(\)]+$/;

    if (bookData.title.length > 100) {
        return "Title must be 100 characters or less.";
    }
    if (!titleRegex.test(bookData.title)) {
        return "Title can only contain letters, numbers, spaces, and basic punctuations.";
    }
    if (bookData.author.length > 100) {
        return "Author name must be 100 characters or less.";
    }
    if (!authorRegex.test(bookData.author)) {
        return "Author name can only contain letters, spaces, hyphens, and periods";
    }
    if (bookData.description.length > 250) {
        return "Description must be 250 characters or less.";
    }
    if (!descriptionRegex.test(bookData.description)) {
        return "Description can only contain letters, numbers, spaces, hyphens, and basic punctuation.";
    }
    return null;
};
