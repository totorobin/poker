# language: fr
Fonctionnalité: Choix de la langue
  En tant qu'utilisateur
  Je veux changer la langue de l'interface
  Afin de mieux comprendre l'application

  Scénario: Alice change la langue de l'interface
    Etant donné que l'utilisateur "Alice" se connecte à la room "lang-room" avec le nom pré-enregistré "Alice"
    Alors "Alice" doit voir l'interface en français
    Quand "Alice" change la langue
    Alors "Alice" doit voir l'interface en anglais
    Quand "Alice" change la langue
    Alors "Alice" doit voir l'interface en français
