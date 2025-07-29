import { useState } from "react";
import type { Book } from "../types/Book";
import { validateBookInput } from "../utils/bookValidation";

interface EditBookFormProps{
    book : Book;
    onCancel : () => void;
    onSuccess : (newBook : Book) => void;
}

export default function EditBookForm({book, onCancel, onSuccess} : EditBookFormProps){
    const [editBookData, setEditBookData] = useState(book);
    const [error, setError] = useState<string | null>(null);

    const validateInput = () => {
        const errorMessage = validateBookInput(editBookData);
        if(errorMessage) {
            setError(errorMessage);
            return false;
        }

         return true;
    };

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        if(!validateInput()) return;

        try{
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
        } catch(err){
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error updating book:', err);
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
                   <input type="text" name="title" value={editBookData.title} required onChange={(e) => setEditBookData({...editBookData, title: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               <div>
                   <label>Author</label> 
                   <input type="text" name="author" value={editBookData.author} required onChange={(e) => setEditBookData({...editBookData, author: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               <div>
                   <label>Description</label> 
                   <input type="text" name="description" value={editBookData.description} required onChange={(e) => setEditBookData({...editBookData, description: e.target.value})} style={{marginLeft: '10px'}}/> 
               </div>
               {error && <div style={{color: 'red'}}>{error}</div>}
               <div>
                   <button type="submit">Edit Book</button>
                   <button type="button" onClick={onCancelClick} style={{marginLeft: '10px'}}>Cancel</button>
               </div>
            </form>
        </div>
    );
}