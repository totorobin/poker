# language: fr
Fonctionnalité: Notifications
  En tant qu'utilisateur
  Je veux être informé des actions des autres participants
  Afin de suivre le déroulement de la partie

  Scénario: Alice est notifiée quand Bob change son nom
    Etant donné que l'utilisateur "Alice" se connecte à la room "notif-room" avec le nom pré-enregistré "Alice"
    Et que l'utilisateur "Bob" se connecte à la room "notif-room" et saisit son nom "Bob"
    Quand "Bob" change son nom en "Robert"
    Alors "Alice" doit voir une notification indiquant que "Bob" s'appelle maintenant "Robert"
