# Yoga Pose Classifier

Application web qui utilise l'intelligence artificielle (Google Gemini) pour classifier automatiquement les postures de yoga.

## Caractéristiques

- Interface utilisateur intuitive et moderne avec React et Tailwind CSS
- Glisser-déposer d'images avec prévisualisation
- Capture de postures via la caméra avec mode automatique
- Classification des postures de yoga en temps réel grâce à l'API Gemini
- Historique des postures analysées avec possibilité de recharger
- Affichage détaillé des résultats incluant:
  - Nom de la posture
  - Niveau de confiance de la classification
  - Description de la posture
  - Bienfaits de la posture
  - Niveau de difficulté
  - Conseils pour réaliser correctement la posture

## Capture par caméra

L'application propose deux modes de capture:
- **Capture manuelle**: Prenez une photo de votre posture quand vous êtes prêt
- **Détection automatique**: Le système analyse automatiquement le flux vidéo et capture les postures détectées

## Configuration

### Prérequis

- Node.js 18+
- Une clé API Gemini (https://ai.google.dev/)

### Installation

1. Clonez ce dépôt
2. Installez les dépendances:
   ```
   cd yoga-classifier
   npm install
   ```
3. Créez un fichier `.env` à la racine du projet avec votre clé API:
   ```
   VITE_GEMINI_API_KEY=votre_clé_api_ici
   ```

### Démarrage

Pour lancer l'application en mode développement:

```
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## Comment ça marche

1. L'utilisateur télécharge une image ou prend une photo de posture de yoga
2. L'application envoie l'image à l'API Google Gemini
3. L'intelligence artificielle identifie la posture et fournit des informations détaillées
4. L'application affiche les résultats de manière visuellement attrayante
5. L'historique des analyses est sauvegardé localement pour référence future

## Technologies utilisées

- React
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API
- React Dropzone
- React Webcam
- LocalStorage pour l'historique

## Déploiement

Cette application est configurée pour un déploiement facile sur Vercel.

## License

MIT 