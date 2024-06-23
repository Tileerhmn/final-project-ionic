import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";

interface Borrow {
  id: number;
  title: string; // Assuming book title
  username: string; // Assuming user name
}

const AddBorrow: React.FC<RouteComponentProps> = ({ history }) => {
  const [bookIsbn, setBookIsbn] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [books, setBooks] = useState<Borrow[]>([]);
  const [users, setUsers] = useState<Borrow[]>([]);

  useEffect(() => {
    fetchBooksAndUsers();
  }, []);

  const fetchBooksAndUsers = async () => {
    try {
      // Fetch books
      const booksResponse = await fetch("http://127.0.0.1:8000/api/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!booksResponse.ok) {
        throw new Error("Failed to fetch books");
      }
      const booksData = await booksResponse.json();
      setBooks(booksData.data);

      // Fetch users
      const usersResponse = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await usersResponse.json();
      setUsers(usersData.data);
    } catch (error) {
      console.error("Error fetching books and users:", error);
    }
  };

  const handleAddBorrow = async () => {
    if (!bookIsbn || !userId) {
      setShowToast({ show: true, message: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/borrowings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          book_id: bookIsbn,
          user_id: userId,
        }),
      });
      if (response.ok) {
        console.log(response);

        setShowToast({ show: true, message: "Borrow added successfully" });
        history.push("/dashboard/borrow");
      } else {
        const data = await response.json();
        setShowToast({
          show: true,
          message: data.message || "Failed to add borrow",
        });
      }
    } catch (error) {
      console.error("Error adding borrow:", error);
      setShowToast({ show: true, message: "Error adding borrow" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
        <div className="ion-padding">
          <h1>Add Borrow</h1>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Select Book</IonLabel>
              <IonSelect
                value={bookIsbn}
                placeholder="Select Book"
                onIonChange={(e) => setBookIsbn(e.detail.value)}
              >
                {books.map((book) => (
                  <IonSelectOption
                    key={book.id}
                    value={book.title} // Assuming book title is unique and using it as value
                  >
                    {book.title}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Select User</IonLabel>
              <IonSelect
                value={userId}
                placeholder="Select User"
                onIonChange={(e) => setUserId(e.detail.value)}
              >
                {users.map((user) => (
                  <IonSelectOption key={user.id} value={user.id.toString()}>
                    {user.username}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleAddBorrow}>
            Add Borrow
          </IonButton>
          <IonLoading isOpen={loading} message="Adding borrow..." />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddBorrow;
