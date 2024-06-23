import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface Borrow {
  id: number;
  book: string;
  user: string;
  borrowed_at: string;
  returned_at: string | null;
}

const BorrowList: React.FC<RouteComponentProps> = ({ history }) => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/borrowings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch borrows");
      }
      const data = await response.json();
      setBorrows(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrows:", error);
      setLoading(false);
    }
  };

  const handleAddBorrow = () => {
    history.push("/dashboard/borrows/add");
  };

  const handleEditBorrow = (id: number) => {
    history.push(`/dashboard/borrow/${id}/edit`);
  };

  const handleDeleteBorrow = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/borrowings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setShowToast({ show: true, message: "Borrow deleted successfully" });
        setBorrows(borrows.filter((borrow) => borrow.id !== id));
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to delete borrow",
        });
      }
    } catch (error) {
      console.error("Error deleting borrow:", error);
      setShowToast({ show: true, message: "Error deleting borrow" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Loading borrows..." />;
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
          <h1>Borrows</h1>
          <button
            onClick={handleAddBorrow}
            style={{
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "green",
            }}
          >
            Add Borrow
          </button>
        </div>
        <IonList>
          {borrows.map((borrow) => (
            <IonItem key={borrow.id}>
              <IonLabel>
                <h2>Book: {borrow.book}</h2>
                <p>User: {borrow.user}</p>
                <p>Borrowed At: {borrow.borrowed_at}</p>
                <p>Returned At: {borrow.returned_at || "Not returned yet"}</p>
              </IonLabel>
              <IonButton
                onClick={() => handleEditBorrow(borrow.id)}
                color="primary"
                size="small"
              >
                Edit
              </IonButton>
              <IonButton
                onClick={() => handleDeleteBorrow(borrow.id)}
                color="danger"
                size="small"
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

export default BorrowList;
