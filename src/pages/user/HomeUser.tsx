import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonToast,
} from "@ionic/react";

const HomeUser: React.FC = () => {
  const [books, setBooks] = useState([
    {
      isbn: "",
      image: "",
      title: "",
      description: "",
      author: "",
      category: "",
    },
  ]);

  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/book-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);

      setBooks(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBorrow = async (isbn: String) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/borrowings-user/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: isbn,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setShowToast({ show: true, message: "Buku berhasil dipinjam" });
      } else {
        setShowToast({ show: true, message: "Gagal meminjam buku" });
      }
      fetchBooks();
    } catch (error) {
      console.error(error);
      setShowToast({ show: true, message: "Terjadi kesalahan" });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home </IonTitle>
          <IonButton slot="end" onClick={handleLogout} fill="clear">
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            padding: "20px",
          }}
        >
          {books.map((book, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 calc(50% - 10px)",
                boxSizing: "border-box",
                marginBottom: "20px",
              }}
            >
              <IonCard>
                <IonImg src={book.image} />
                <IonCardHeader>
                  <IonCardTitle>{book.title}</IonCardTitle>
                  {/* <IonCardSubtitle></IonCardSubtitle> */}
                </IonCardHeader>
                <IonCardContent>
                  <p style={{ paddingBlock: "10px" }}>{book.description}</p>
                  <p style={{ paddingBlock: "10px" }}>{book.author}</p>
                  <p style={{ paddingBlock: "10px" }}>{book.category}</p>
                  <IonButton
                    expand="full"
                    onClick={(e) => handleBorrow(book.isbn)}
                  >
                    Pinjam
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          ))}
        </div>
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: "" })}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomeUser;
