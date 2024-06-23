import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonLoading,
  IonToast,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  id: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
}

const EditAuthor: React.FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  const [author, setAuthor] = useState<Author>({
    id: 0,
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchAuthorDetails();
  }, []);

  const fetchAuthorDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/authors/${match.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAuthor(data.data);
      } else {
        console.error("Failed to fetch author details");
      }
    } catch (error) {
      console.error("Error fetching author details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAuthor = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/authors/${match.params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: author.name,
            email: author.email,
          }),
        }
      );

      console.log(response);
      console.log(author.name);

      if (response.ok) {
        setShowToast({ show: true, message: "Author updated successfully" });
        history.push("/dashboard/authors");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to update author",
        });
      }
    } catch (error) {
      console.error("Error updating author:", error);
      setShowToast({ show: true, message: "Error updating author" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Author</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={"Updating author..."} />
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput
              value={author.name}
              onIonChange={(e) =>
                setAuthor({ ...author, name: e.detail.value! })
              }
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={author.email}
              onIonChange={(e) =>
                setAuthor({ ...author, email: e.detail.value! })
              }
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <IonButton expand="block" onClick={handleUpdateAuthor}>
          Update Author
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditAuthor;
