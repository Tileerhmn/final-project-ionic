import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonTextarea,
  IonButton,
  IonLoading,
  IonToast,
  IonSelectOption,
  IonSelect,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  id: string;
}

interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  description: string;
  category_id: number;
  author_id: number;
}

const EditBook: React.FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  const [book, setBook] = useState<Book>({
    id: 0,
    isbn: "",
    title: "",
    author: "",
    category: "",
    description: "",
    category_id: 0,
    author_id: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchBookDetails();
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/books/${match.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBook({
          ...data.data,
          category_id: data.data.category_id,
          author_id: data.data.author_id,
        });
      } else {
        console.error("Failed to fetch book details");
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/authors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAuthors(data.data);
      } else {
        console.error("Failed to fetch authors");
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleUpdateBook = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/books/${book.isbn}`, // Sesuaikan dengan field yang digunakan untuk identifikasi buku (misalnya, isbn)
        {
          method: "POST", // Gunakan method PUT atau PATCH sesuai dengan kebutuhan API Anda
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            isbn: book.isbn,
            title: book.title,
            description: book.description,
            category_id: book.category_id,
            author_id: book.author_id,
          }),
        }
      );
      if (response.ok) {
        setShowToast({ show: true, message: "Book updated successfully" });
        history.push("/dashboard/books");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to update book",
        });
      }
    } catch (error) {
      console.error("Error updating book:", error);
      setShowToast({ show: true, message: "Error updating book" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Book</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={"Updating book..."} />
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Title</IonLabel>
            <IonInput
              value={book.title}
              onIonChange={(e) => setBook({ ...book, title: e.detail.value! })}
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Author</IonLabel>
            <IonInput
              value={book.author}
              disabled={true} // Jangan diubah di form edit jika hanya menampilkan informasi
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Select Author</IonLabel>
            <IonSelect
              value={book.author_id}
              onIonChange={(e) =>
                setBook({ ...book, author_id: +e.detail.value! })
              }
              className="form-input"
            >
              {authors.map((author) => (
                <IonSelectOption key={author.id} value={author.id}>
                  {author.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Category</IonLabel>
            <IonInput
              value={book.category}
              disabled={true} // Jangan diubah di form edit jika hanya menampilkan informasi
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Select Category</IonLabel>
            <IonSelect
              value={book.category_id}
              onIonChange={(e) =>
                setBook({ ...book, category_id: +e.detail.value! })
              }
              className="form-input"
            >
              {categories.map((category) => (
                <IonSelectOption key={category.id} value={category.id}>
                  {category.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonTextarea
              value={book.description}
              onIonChange={(e) =>
                setBook({ ...book, description: e.detail.value! })
              }
              className="form-input"
            ></IonTextarea>
          </IonItem>
        </div>
        <IonButton expand="block" onClick={handleUpdateBook}>
          Update Book
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditBook;
