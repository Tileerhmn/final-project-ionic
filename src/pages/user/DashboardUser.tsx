import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import { homeOutline, bookOutline, timeOutline } from "ionicons/icons";
import HomeUser from "./HomeUser";
import BorrowUser from "./BorrowUser";
import HistoryUser from "./HistoryUser";

const DashboardUser: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/dashboard-user/home" component={HomeUser} exact={true} />
        <Route
          path="/dashboard-user/borrow"
          component={BorrowUser}
          exact={true}
        />
        <Route
          path="/dashboard-user/history"
          component={HistoryUser}
          exact={true}
        />
        <Redirect exact from="/dashboard-user" to="/dashboard-user/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/dashboard-user/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="borrow" href="/dashboard-user/borrow">
          <IonIcon icon={bookOutline} />
          <IonLabel>Borrow</IonLabel>
        </IonTabButton>
        <IonTabButton tab="history" href="/dashboard-user/history">
          <IonIcon icon={timeOutline} />
          <IonLabel>History</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default DashboardUser;
