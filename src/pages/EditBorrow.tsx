import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface Borrow {
  id: number;
  title: string;
  user_id: number;
  isbn: string;
  username: string;
  borrowed_at: string;
  returned_at: string | null;
}

interface EditBorrowProps extends RouteComponentProps<{ id: string }> {}

const EditBorrow: React.FC<EditBorrowProps> = ({ history, match }) => {
  const borrowId = parseInt(match.params.id);

  const [borrow, setBorrow] = useState<Borrow>({
    id: 0,
    title: "",
    username: "",
    isbn: "",
    user_id: 0,
    borrowed_at: "",
    returned_at: null,
  });
  const [books, setBooks] = useState<{ isbn: string; title: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  useEffect(() => {
    fetchBorrowDetails();
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBorrowDetails = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/borrowings/${borrowId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch borrow details");
      }
      const data = await response.json();
      console.log(data.data, "boro");

      const borrowData: Borrow = {
        id: data.data.id,
        title: data.data.book,
        username: data.data.user,
        isbn: data.data.isbn,
        user_id: data.data.user_id,
        borrowed_at: data.data.borrowed_at,
        returned_at: data.data.returned_at,
      };
      setBorrow(borrowData);
      console.log(borrow, "borrow");

      setLoading(false);
    } catch (error) {
      console.error("Error fetching borrow details:", error);
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data.data);
      console.log(books, "books");
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data);
      console.log(users, "users");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdateBorrow = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/borrowings/${borrow.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            book_id: borrow.isbn, // Menggunakan book_title sebagai book_id
            user_id: borrow.user_id,
          }),
        }
      );

      console.log(borrow.user_id, "res");

      if (response.ok) {
        setShowToast({ show: true, message: "Borrow updated successfully" });
        history.push("/dashboard/borrow");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to update borrow",
        });
      }
    } catch (error) {
      console.error("Error updating borrow:", error);
      setShowToast({ show: true, message: "Error updating borrow" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IonLoading isOpen={loading} message="Loading borrow details..." />;
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
          <h1>Edit Borrow</h1>
        </div>
        <IonList>
          <IonItem>
            <IonLabel>Book Title</IonLabel>
            <IonSelect
              value={borrow.isbn}
              onIonChange={(e) =>
                setBorrow({ ...borrow, isbn: e.detail.value })
              }
            >
              {books.map((book) => (
                <IonSelectOption key={book.isbn} value={book.isbn}>
                  {book.title}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>User Name</IonLabel>
            <IonSelect
              value={borrow.user_id}
              onIonChange={(e) =>
                setBorrow({ ...borrow, user_id: e.detail.value })
              }
            >
              {users.map((user) => (
                <IonSelectOption key={user.id} value={user.id}>
                  {user.username}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Borrowed At</IonLabel>
            <IonLabel>{borrow.borrowed_at}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Returned At</IonLabel>
            <IonLabel>{borrow.returned_at || "Not returned yet"}</IonLabel>
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={handleUpdateBorrow}>
          Update Borrow
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditBorrow;
