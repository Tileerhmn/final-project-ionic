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

const EditCategory: React.FC<RouteComponentProps<MatchParams>> = ({
  history,
  match,
}) => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/categories/${match.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setName(data.data.name);
      } else {
        console.error("Failed to fetch category details");
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/categories/${match.params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      if (response.ok) {
        setShowToast({ show: true, message: "Category updated successfully" });
        history.push("/dashboard/categories");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to update category",
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setShowToast({ show: true, message: "Error updating category" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Category</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={"Updating category..."} />
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
        <IonButton expand="block" onClick={handleUpdateCategory}>
          Update Category
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditCategory;
