# Data Models

## User

- Has many Games
- username (3 to 20 chars)
- password (hash & salt)

## Game

- id
- Title
- Release Date
- has Many Chapters
- has one Owner (User)

## Chapter

- Title
- Sort Number
- has Many Scenes

## Scenes

- Title
- Sort Number
- Image URL array.
- has many Dialog.
- has many Images.

## Dialog

- id
- Text
- Character (which character is speaking or is narrator).
- SceneAction (branching/choices/next scene/move to chapter)
- Belongs to a Character.
- Belongs to a Scene.
- Belongs to a Chapter.
- Belongs to a Game.
- Belongs to a User.

### Process flow

- User creates their account.
- User creates new game and provides details.
- User creates new Characters
- User creates new Chapter.
- User creates new Scene.
- User adds dialog to the scene.
- User edits scenes.
- User plays the scenes.
