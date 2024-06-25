import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
} from "@ionic/react";

const HistoryUser: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/borrowings-user/return",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setHistory(data.data); // Mengatur data riwayat peminjaman ke state history
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory(); // Memuat data riwayat peminjaman saat komponen dimuat
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HistoryUser</IonTitle>
          <IonButton slot="end" onClick={handleLogout} fill="clear">
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {history.map((item) => (
          <IonCard key={item.id}>
            <IonCardHeader>
              <IonCardTitle>{item.book}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel style={{ display: "block" }}>
                User: {item.user}
              </IonLabel>
              <IonLabel style={{ display: "block" }}>
                Borrowed At: {item.borrowed_at}
              </IonLabel>
              <IonLabel style={{ display: "block" }}>
                Returned At: {item.returned_at}
              </IonLabel>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default HistoryUser;
