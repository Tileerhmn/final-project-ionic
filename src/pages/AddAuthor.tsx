import React, { useState } from "react";
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
import { useHistory } from "react-router-dom";

const AddAuthor: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const history = useHistory();

  const handleAddAuthor = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });
      if (response.ok) {
        setShowToast({ show: true, message: "Author added successfully" });
        history.push("/dashboard/authors");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to add author",
        });
      }
    } catch (error) {
      console.error("Error adding author:", error);
      setShowToast({ show: true, message: "Error adding author" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Author</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={"Adding author..."} />
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
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <div className="form-group">
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              className="form-input"
            ></IonInput>
          </IonItem>
        </div>
        <IonButton expand="block" onClick={handleAddAuthor}>
          Add Author
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddAuthor;
