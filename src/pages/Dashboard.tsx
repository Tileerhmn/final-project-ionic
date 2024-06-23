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
import AddAuthor from "./AddAuthor";
import EditAuthor from "./EditAuthor";
import Categories from "../components/CategoryList";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import BorrowList from "./Borrow";
import EditBorrow from "./EditBorrow";
import AddBorrow from "./AddBorrow";
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
        <Route path="/dashboard/books/add" component={AddBook} />
        <Route path="/dashboard/books/:id/edit" component={EditBook} />
        <Route path="/dashboard/authors" component={Authors} />
        <Route path="/dashboard/authors/add" component={AddAuthor} />
        <Route path="/dashboard/authors/:id/edit" component={EditAuthor} />
        <Route path="/dashboard/categories" component={Categories} />
        <Route path="/dashboard/categories/add" component={AddCategory} />
        <Route path="/dashboard/categories/:id/edit" component={EditCategory} />
        <Route path="/dashboard/borrow" component={BorrowList} />
        <Route path="/dashboard/borrow/add" component={AddBorrow} />
        <Route path="/dashboard/borrow/:id/edit" component={EditBorrow} />
        <h1>Welcome to the Dashboard</h1>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
