# language: fr
Fonctionnalité: Gestion du thème
  En tant qu'utilisateur
  Je veux personnaliser l'apparence
  Afin d'avoir une meilleure expérience

  Scénario: Alice change la couleur du thème
    Etant donné que l'utilisateur "Alice" se connecte à la room "theme-room" avec le nom pré-enregistré "Alice"
    Quand "Alice" change la couleur du thème en "rouge"
    Alors le thème de "Alice" doit être "rouge"

  Scénario: Alice change le verso des cartes
    Etant donné que l'utilisateur "Alice" se connecte à la room "theme-room" avec le nom pré-enregistré "Alice"
    Quand "Alice" choisit le 2ème verso de carte
    Alors les cartes de "Alice" doivent avoir le nouveau verso
