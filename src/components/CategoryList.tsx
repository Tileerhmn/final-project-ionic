import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonButton,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

const CategoryList: React.FC<RouteComponentProps> = ({ history }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    history.push("/dashboard/categories/add");
  };

  const handleEditCategory = (id: number) => {
    history.push(`/dashboard/categories/${id}/edit`);
  };

  const handleDeleteCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setShowToast({ show: true, message: "Category deleted successfully" });
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to delete category",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setShowToast({ show: true, message: "Error deleting category" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Loading categories..." />;
  }

  return (
    <IonPage>
      <IonContent>
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            placeItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
          }}
        >
          <h1>Category</h1>
          <button
            onClick={handleAddCategory}
            style={{
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "green",
            }}
          >
            ADD Category
          </button>
        </div>
        <IonList>
          {categories.map((category) => (
            <IonItem key={category.id}>
              <IonLabel>{category.name}</IonLabel>
              <IonButton
                onClick={() => handleEditCategory(category.id)}
                color="warning"
              >
                Edit
              </IonButton>
              <IonButton
                onClick={() => handleDeleteCategory(category.id)}
                color="danger"
              >
                Delete
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CategoryList;
