import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

interface AuthorCardProps {
  name: string;
  email: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ name, email }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>Author</IonCardSubtitle>
        <IonCardTitle>{name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>Email: {email}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default AuthorCard;
