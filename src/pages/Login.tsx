import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import "./Login.css";

interface LoginProps extends RouteComponentProps {}

const Login: React.FC<LoginProps> = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  // if has token, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      history.push("/dashboard");
    }
  });

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        localStorage.setItem("token", data.token);
        history.push("/dashboard"); // Arahkan ke halaman dashboard setelah login berhasil
      } else {
        setShowToast({ show: true, message: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setShowToast({ show: true, message: "Login error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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

export default Login;
