import { useState } from "react";
import type { Book } from "../types/Book";
import { validateBookInput } from "../utils/bookValidation";

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

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json', // is this necessary? won't it work without it?
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
        <div>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
               <div>
                   <label>Title</label>
                   <input type="text" name="title" value={addBookData.title} required onChange={(e) => setAddBookData({...addBookData, title: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               <div>
                   <label>Author</label> 
                   <input type="text" name="author" value={addBookData.author} required onChange={(e) => setAddBookData({...addBookData, author: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               <div>
                   <label>Description</label> 
                   <input type="text" name="description" value={addBookData.description} required onChange={(e) => setAddBookData({...addBookData, description: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               {error && <div style={{color: 'red'}}>{error}</div>}
               <div>
                   <button type="submit">Add Book</button>
                   <button type="button" onClick={onCancelClick} style={{marginLeft: '10px'}}>Cancel</button>
               </div>
            </form>
        </div>
    );
}