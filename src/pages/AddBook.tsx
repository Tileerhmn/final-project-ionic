import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface AddBookProps extends RouteComponentProps {}

const AddBook: React.FC<AddBookProps> = ({ history }) => {
  const [isbn, setIsbn] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

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

  const handleAddBook = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("isbn", isbn);
      formData.append("title", title);
      if (image) {
        formData.append("image", image);
      }
      formData.append("description", description);
      formData.append("category_id", categoryId);
      formData.append("author_id", authorId);

      const response = await fetch("http://127.0.0.1:8000/api/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowToast({ show: true, message: "Book added successfully" });
        history.push("/dashboard/books");
      } else {
        setShowToast({
          show: true,
          message: data.message || "Failed to add book",
        });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setShowToast({ show: true, message: "Error adding book" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Book</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={loading} message={"Adding book..."} />
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <IonItem>
          <IonLabel position="floating">ISBN</IonLabel>
          <IonInput
            value={isbn}
            onIonChange={(e) => setIsbn(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Title</IonLabel>
          <IonInput
            value={title}
            onIonChange={(e) => setTitle(e.detail.value!)}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Image (max 2MB)</IonLabel>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={(e) => setDescription(e.detail.value!)}
          ></IonTextarea>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Category</IonLabel>
          <IonSelect
            value={categoryId}
            placeholder="Select category"
            onIonChange={(e) => setCategoryId(e.detail.value!)}
          >
            {categories.map((category) => (
              <IonSelectOption key={category.id} value={category.id}>
                {category.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Author</IonLabel>
          <IonSelect
            value={authorId}
            placeholder="Select author"
            onIonChange={(e) => setAuthorId(e.detail.value!)}
          >
            {authors.map((author) => (
              <IonSelectOption key={author.id} value={author.id}>
                {author.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButton expand="block" onClick={handleAddBook}>
          Add Book
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddBook;
