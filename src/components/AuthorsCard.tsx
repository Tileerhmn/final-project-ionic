import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

interface AuthorCardProps {
  id: number;
  name: string;
  email: string;
  onDelete: (id: number) => void; // Handler untuk aksi delete
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  id,
  name,
  email,
  onDelete,
}) => {
  const history = useHistory();

  const handleEdit = () => {
    history.push(`authors/${id}/edit`);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <IonCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          placeItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <div>
          <IonCardHeader>
            <IonCardSubtitle>Author</IonCardSubtitle>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Email: {email}</p>
          </IonCardContent>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <IonButton color="warning" onClick={handleEdit}>
            Edit
          </IonButton>
          <IonButton color="danger" onClick={handleDelete}>
            Delete
          </IonButton>
        </div>
      </div>
    </IonCard>
  );
};

export default AuthorCard;
