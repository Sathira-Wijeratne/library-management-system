import { useState } from "react";
import type { Book } from "../types/Book";
import { validateBookInput } from "../utils/bookValidation";
import { Alert, Box, Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

interface AddBookFormProps {
    onCancel: () => void;
    onSuccess: (newBook:Book) => void;
}

export default function AddBookForm({ onCancel, onSuccess }: AddBookFormProps){
    const [addBookData, setAddBookData] = useState({
        title:'',
        author:'',
        description:''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateInput = () => {
        const errorMessage = validateBookInput(addBookData);
        if (errorMessage) {
            setError(errorMessage);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault();
        
        if (!validateInput()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(addBookData)
            });

            if (!response.ok) {
                if (response.status === 400) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Validation failed');
                }
                throw new Error(`Error, status : ${response.status}`);
            }

            // reset form
            setAddBookData({
                title: '',
                author: '',
                description: ''
            });
            setError(null);

            const newBook = await response.json();
            onSuccess(newBook);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error creating book:', err);
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
                borderBottom: '1px solid #e0e0e0',
                mb: 2
            }}>
                Add New Book
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
                            value={addBookData.title}
                            onChange={(e) => setAddBookData({ ...addBookData, title: e.target.value })}
                            required
                            fullWidth
                            disabled={loading}
                        />
                        <TextField
                            label="Author"
                            value={addBookData.author}
                            onChange={(e) => setAddBookData({ ...addBookData, author: e.target.value })}
                            required
                            fullWidth
                            disabled={loading}
                        />
                        <TextField
                            label="Description"
                            value={addBookData.description}
                            onChange={(e) => setAddBookData({ ...addBookData, description: e.target.value })}
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
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </>
    );
}