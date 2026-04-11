# language: fr
Fonctionnalité: Réglages de la room
  En tant qu'administrateur d'une room
  Je veux pouvoir modifier les réglages de la room
  Afin de personnaliser l'expérience de vote

  Contexte:
    Etant donné que l'utilisateur "Alice" se connecte à la room "settings-test" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "settings-test" et saisit son nom "Bob"

  Scénario: Changement de deck de cartes
    Quand "Alice" ouvre les réglages de la room
    Et "Alice" sélectionne le deck de cartes "Linéaire"
    Et "Alice" valide les réglages
    Alors "Alice" doit voir les cartes "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10" disponibles pour le vote
    Et "Bob" doit voir les cartes "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10" disponibles pour le vote

  Scénario: Restriction des actions à l'administrateur
    Quand "Alice" ouvre les réglages de la room
    Et "Alice" active l'option "Actions réservées à l'admin"
    Et "Alice" valide les réglages
    Alors "Alice" doit pouvoir révéler les votes
    Et "Bob" ne doit pas pouvoir révéler les votes

  Scénario: Blocage des votes après révélation
    Quand "Alice" ouvre les réglages de la room
    Et "Alice" active l'option "Bloquer les votes une fois les cartes révélées"
    Et "Alice" valide les réglages
    Et "Alice" révèle les votes
    Alors "Bob" ne doit pas pouvoir voter pour la carte "5"
