import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface Book {
  isbn: number;
  title: string;
  author: string;
  category: string;
  description: string;
}

const Books: React.FC<RouteComponentProps> = ({ history }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.data);
      } else {
        console.error("Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: number) => {
    history.push(`/dashboard/books/${bookId}`);
  };

  const handleAddBook = () => {
    history.push("/dashboard/books/add"); // Navigasi ke halaman tambah buku
  };

  const handleEditBook = (bookId: number) => {
    history.push(`/dashboard/books/${bookId}/edit`);
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setShowToast({ show: true, message: "Book deleted successfully" });
        fetchBooks(); // Ambil ulang daftar buku setelah penghapusan
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to delete book",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setShowToast({ show: true, message: "Error deleting book" });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Books</IonTitle>
          <IonButton slot="end" onClick={handleAddBook}>
            Add Book
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message={"Fetching books..."} />
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <IonList>
          {books.map((book) => (
            <IonItem key={book.isbn}>
              <IonLabel>
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
              </IonLabel>
              <IonButton onClick={() => handleEditBook(book.isbn)}>
                Edit
              </IonButton>
              <IonButton onClick={() => handleDeleteBook(book.isbn)}>
                Delete
              </IonButton>
              <IonButton onClick={() => handleBookClick(book.isbn)}>
                View
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Books;
