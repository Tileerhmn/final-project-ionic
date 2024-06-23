import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AuthorCard from "./AuthorsCard"; // Sesuaikan dengan path ke file AuthorCard
import { RouteComponentProps } from "react-router-dom";

interface Author {
  id: number;
  name: string;
  email: string;
}

const AuthorList: React.FC<RouteComponentProps> = ({ history }) => {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    fetchAuthors();
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/authors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setAuthors(authors.filter((author) => author.id !== id));
      } else {
        console.error("Failed to delete author");
      }
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleAddAuthors = () => {
    history.push("/dashboard/authors/add");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              placeItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
            }}
          >
            <h1>Authors</h1>
            <button
              onClick={handleAddAuthors}
              style={{
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "green",
              }}
            >
              ADD Authors
            </button>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {authors.map((author) => (
          <AuthorCard key={author.id} {...author} onDelete={handleDelete} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default AuthorList;
