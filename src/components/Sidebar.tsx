// Sidebar.tsx

import React from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { bookOutline, peopleOutline, layersOutline } from "ionicons/icons";

interface SidebarProps extends RouteComponentProps {}

const Sidebar: React.FC<SidebarProps> = ({ history }) => {
  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem button onClick={() => navigateTo("/dashboard/books")}>
            <IonIcon icon={bookOutline} slot="start" />
            <IonLabel>Books</IonLabel>
          </IonItem>
          <IonItem button onClick={() => navigateTo("/dashboard/authors")}>
            <IonIcon icon={peopleOutline} slot="start" />
            <IonLabel>Authors</IonLabel>
          </IonItem>
          <IonItem button onClick={() => navigateTo("/dashboard/categories")}>
            <IonIcon icon={layersOutline} slot="start" />
            <IonLabel>Categories</IonLabel>
          </IonItem>
          {/* detail Peminjaman */}
          <IonItem button onClick={() => navigateTo("/dashboard/borrow")}>
            <IonIcon icon={layersOutline} slot="start" />
            <IonLabel>Borrow</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Sidebar);
