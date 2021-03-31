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

Deploying:

** NOTE: make sure to save all Cloud Functions dependencies explicitly in the `functions/` folder with `npm install ...`

1. run `yarn run build`
2. Save the latest .js and .js.map from `dist/` to an accessible URL
3. run `yarn run deploy-functions` to deploy to firebase

### Integration

```
<style>#note { display: block; position: relative; margin: 0 auto; height: 300px; width: 350px; overflow: hidden;}
textarea { height: 100px; width: 300px
</style>

<div id="note">

<h2>Create a Note</h2>
<div id="root"></div>

</div>
<script async src="https://cdn.jsdelivr.net/gh/alexanderlperez/lacrm-integration@latest/dist/lacrm-integration.197c8d16.js"></script>
```
