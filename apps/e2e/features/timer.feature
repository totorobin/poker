# language: fr
Fonctionnalité: Gestion du timer
  En tant qu'utilisateur
  Je veux utiliser un timer
  Afin de limiter le temps de réflexion

  Scénario: Alice démarre un timer et tout le monde le voit
    Etant donné que l'utilisateur "Alice" se connecte à la room "timer-room" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "timer-room" avec le nom pré-enregistré "Bob"
    Quand "Alice" règle le timer sur "00:00:10"
    Et "Alice" démarre le timer
    Alors "Alice" et "Bob" doivent voir le timer tourner
    Et quand le temps est écoulé "Alice" et "Bob" doivent voir une notification "Temps écoulé !"
