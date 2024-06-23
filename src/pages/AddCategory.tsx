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

const AddCategory: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const history = useHistory();

  const handleAddCategory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setShowToast({ show: true, message: "Category added successfully" });
        history.push("/dashboard/categories");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to add category",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setShowToast({ show: true, message: "Error adding category" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Category</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={"Adding category..."} />
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
        <IonButton expand="block" onClick={handleAddCategory}>
          Add Category
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddCategory;
