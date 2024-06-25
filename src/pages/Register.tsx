import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";

interface RegisterProps extends RouteComponentProps {}

const Register: React.FC<RegisterProps> = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
  });

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        history.push("/login");
      } else {
        setShowToast({
          show: true,
          message: data.message || "Register failed",
        });
      }
    } catch (error) {
      console.error("Error during register:", error);
      setShowToast({ show: true, message: "Register error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    history.push("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-container">
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonButton expand="full" onClick={handleRegister} disabled={loading}>
            Register
          </IonButton>
          <IonButton expand="full" onClick={handleLogin} disabled={loading}>
            Login
          </IonButton>
          <IonLoading isOpen={loading} message={"Please wait..."} />
          <IonToast
            isOpen={showToast.show}
            message={showToast.message}
            duration={2000}
            onDidDismiss={() => setShowToast({ show: false, message: "" })}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Register;
