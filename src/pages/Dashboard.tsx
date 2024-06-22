import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Books from "../components/Books";
import Authors from "../components/AuthorsList";
import Categories from "../components/CategoryList";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const handleLogout = () => {
    // Lakukan logout, misalnya menghapus token dari localStorage
    localStorage.removeItem("token");
    // Navigasi kembali ke halaman login
    window.location.replace("/login");
  };

  return (
    <IonPage>
      <Sidebar />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
          <IonButton slot="end" onClick={handleLogout} fill="clear">
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent id="main-content">
        <Route path="/dashboard/books" component={Books} />
        <Route path="/dashboard/authors" component={Authors} />
        <Route path="/dashboard/categories" component={Categories} />
        <h1>Welcome to the Dashboard</h1>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
