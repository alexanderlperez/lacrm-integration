# LACRM Notes submission form for yourinterimpastor.com

## Installation

1. Create a firebase project: https://console.firebase.google.com/
2. Add Auth, authorize for target domain under the "Sign-in method" tab
3. Add under "Your apps" in Project Settings
3. Install Firebase CLI tools: `npm install -g firebase-tools`
4. Authenticate Firebase CLI tools: `firebase login`
5. Create Cloud Firestore Database: https://console.firebase.google.com/project/lacrm-integration/firestore
6. Update `src/firebaseConfig.js` with the config object generate from "Firebase SDK snippet -> Config" under "Your Apps"

NOTE: Firestore rules and indexes are included in the project 

TODO: setup Firebase Hosting for production

Dev/Running: 

1. Start the firebase emulator: `yarn run emulate` 
2. Start the project `yarn run start`
