# language: fr
Fonctionnalité: Connexion à une room
  En tant qu'utilisateur
  Je veux me connecter à une room
  Afin de jouer avec d'autres personnes

  Scénario: Trois utilisateurs se rejoignent dans la même room avec différents modes d'identification
    Etant donné que l'utilisateur "Alice" se connecte à la room "test" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "test" et saisit son nom "Bob"
    Et que l'utilisateur "Charlie" se connecte à la room "test" avec le nom généré par défaut
    Alors "Alice" doit voir que "Bob" et "Charlie" sont présents dans la room
    Et "Bob" doit voir que "Alice" et "Charlie" sont présents dans la room
    Et "Charlie" doit voir que "Alice" et "Bob" sont présents dans la room

  Scénario: Alice crée une nouvelle salle depuis l'accueil
    Etant donné que l'utilisateur "Alice" navigue vers l'accueil avec le nom pré-enregistré "Alice"
    Quand "Alice" clique sur le bouton de création de salle
    Alors "Alice" doit être redirigée vers une nouvelle salle

  Scénario: Bob quitte la salle
    Etant donné que l'utilisateur "Alice" se connecte à la room "leave-room" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "leave-room" et saisit son nom "Bob"
    Quand "Bob" quitte la salle
    Alors "Alice" ne doit plus voir "Bob" dans la room

  Scénario: Les utilisateurs votent, révèlent, cachent et effacent les votes
    Etant donné que l'utilisateur "Alice" se connecte à la room "poker-test" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "poker-test" et saisit son nom "Bob"
    Et que l'utilisateur "Charlie" se connecte à la room "poker-test" avec le nom généré par défaut
    Quand "Alice" vote pour la carte "5"
    Et "Bob" vote pour la carte "13"
    Et "Charlie" vote pour la carte "2"
    Alors "Alice" doit voir que "Bob" et "Charlie" ont voté
    Quand "Alice" révèle les votes
    Alors "Alice" doit voir que "Bob" a voté "13" et "Charlie" a voté "2"
    Quand "Alice" cache les votes
    Alors "Alice" doit voir que les votes de "Bob" et "Charlie" sont cachés
    Quand "Alice" efface les votes
    Alors "Alice" doit voir que personne n'a voté
