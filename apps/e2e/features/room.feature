# language: fr
Fonctionnalité: Connexion à une room
  En tant qu'utilisateur
  Je veux me connecter à une room
  Afin de jouer avec d'autres personnes

  Scénario: Deux utilisateurs se rejoignent dans la même room
    Etant donné que l'utilisateur "Alice" se connecte à la room "test"
    Et que l'utilisateur "Bob" se connecte à la room "test"
    Alors "Alice" doit voir que "Bob" est présent dans la room
    Et "Bob" doit voir que "Alice" est présent dans la room
