import { useState } from "react";
import type { Book } from "../types/Book";
import { validateBookInput } from "../utils/bookValidation";
import { Alert, Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface EditBookFormProps {
    book: Book;
    onCancel: () => void;
    onSuccess: (newBook: Book) => void;
}

export default function EditBookForm({ book, onCancel, onSuccess }: EditBookFormProps) {
    const [editBookData, setEditBookData] = useState(book);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateInput = () => {
        const errorMessage = validateBookInput(editBookData);
        if (errorMessage) {
            setError(errorMessage);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInput()) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/Books/${editBookData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editBookData)
            });

            if (response.ok) {
                onSuccess(editBookData);
            } else if (response.status === 409) {
                setError("Update could not be done due to concurrency conflict.");
            } else if (response.status === 404) {
                setError("Book not found.");
            } else if (response.status === 400) {
                setError("Invalid data sent.");
            } else {
                setError("An unexpected error occurred while updating the book.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error updating book:', err);
        }
    }

    const onCancelClick = () => {
        setError(null);
        onCancel();
    }

    return (
        <>
            <DialogTitle>Edit Book</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Title"
                            value={editBookData.title}
                            onChange={(e) => setEditBookData({ ...editBookData, title: e.target.value })}
                            required
                            fullWidth
                            disabled={loading}
                        />
                        <TextField
                            label="Author"
                            value={editBookData.author}
                            onChange={(e) => setEditBookData({ ...editBookData, author: e.target.value })}
                            required
                            fullWidth
                            disabled={loading}
                        />
                        <TextField
                            label="Description"
                            value={editBookData.description}
                            onChange={(e) => setEditBookData({ ...editBookData, description: e.target.value })}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            disabled={loading}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancelClick} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Editing...' : 'Update'}
                    </Button>
                </DialogActions>
            </form>
        </>
    );
}