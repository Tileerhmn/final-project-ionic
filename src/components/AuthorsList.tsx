// AuthorList.tsx

import React, { useState, useEffect } from "react";
import { IonContent, IonPage } from "@ionic/react";
import AuthorCard from "../components/AuthorsCard";

const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<{ name: string; email: string }[]>([]);

  useEffect(() => {
    // Fetch authors data from API
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      // Replace with actual API endpoint
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

  return (
    <IonPage>
      <IonContent>
        {authors.map((author, index) => (
          <AuthorCard key={index} name={author.name} email={author.email} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default AuthorList;
