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
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
}

const Books: React.FC<RouteComponentProps> = ({ history }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        console.log(data, "data");

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Books</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message={"Fetching books..."} />
        <IonList>
          {books.map((book) => (
            <IonItem
              key={book.id}
              button
              onClick={() => handleBookClick(book.id)}
            >
              <IonLabel>
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Books;
