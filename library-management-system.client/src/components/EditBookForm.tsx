import { useState } from "react";
import type { Book } from "../types/Book";
import { validateBookInput } from "../utils/bookValidation";
import { Alert, Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import AuthService from '../utils/authService';

// Props interface for the EditBookForm component
interface EditBookFormProps {
    book: Book;
    onCancel: () => void;
    onSuccess: (newBook: Book) => void;
}

export default function EditBookForm({ book, onCancel, onSuccess }: EditBookFormProps) {
    // states
    const [editBookData, setEditBookData] = useState(book);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // functions
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
            const response = await AuthService.authenticatedFetch(`/api/Books/${editBookData.id}`, {
                method: "PUT",
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
            <DialogTitle sx={{ 
                fontWeight: 600,
                mb: 2
            }}>
                Edit Book
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
                <DialogActions sx={{ p: 2}}>
                    <Button 
                        onClick={onCancelClick} 
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                    >
                        {loading ? 'Editing...' : 'Update'}
                    </Button>
                </DialogActions>
            </form>
        </>
    );
}