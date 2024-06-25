import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";

const BorrowUser: React.FC = () => {
  const [borrowings, setBorrowings] = useState<any[]>([]); // State untuk menyimpan data pinjaman
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" }); // State untuk menampilkan toast

  const fetchBorrowings = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/borrowings-user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setBorrowings(data.data); // Mengatur data pinjaman ke state borrowings
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBorrowings(); // Memuat data pinjaman saat komponen dimuat
  }, []);

  const handleReturnBook = async (borrowingId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/borrowings-user/return`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book_id: borrowingId }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setShowToast({ show: true, message: "Buku berhasil dikembalikan" });
        fetchBorrowings(); // Memuat ulang data pinjaman setelah berhasil mengembalikan
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Borrow</IonTitle>
          <IonButton slot="end" fill="clear" routerLink="/dashboard">
            Back to Dashboard
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {borrowings.map((borrowing) => (
          <IonCard key={borrowing.id}>
            <IonCardHeader>
              <IonCardTitle>{borrowing.book}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel style={{ display: "block" }}>
                User: {borrowing.user}
              </IonLabel>
              <IonLabel style={{ display: "block" }}>
                Borrowed At: {borrowing.borrowed_at}
              </IonLabel>
              <IonLabel style={{ display: "block" }}>
                Returned At: still borrowed
              </IonLabel>
              <IonButton
                expand="full"
                onClick={() => handleReturnBook(borrowing.isbn)}
              >
                Return Book
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
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

export default BorrowUser;
