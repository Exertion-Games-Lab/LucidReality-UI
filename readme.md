# LucidReality
This app is built using React-Native with Expo Go.

### Most Up-to-Date APK (17/04/2024)
[https://drive.google.com/file/d/1e1lXrTJhwLFHaqAUx6c1uNlxqkVA_Z15/view?usp=drive_link](https://drive.google.com/file/d/1Oaj1140MgJOzV3pPuywcWy7hI8Evl-C2/view?usp=drive_link)

**Folder layout:**
- **app Folder:**
	- This is the main folder with all the screens.
	- As per expo navigation, you can find a folder for each tab which inside contains all the screens that are relevant for the tab. You can tell it is a tab because the name is enclosed in brackets. Eg. (connect), (home), (journal)
	- The index.tsx file in each tab folder is the primary screen. 
	- Please refer to expo docs to learn more about how  _layout.tsx_ works, which is what is responsible for navigation within each tab/stack/other
		- https://docs.expo.dev/router/layouts/
- **APICalls Folder**
	- **commandSender.tsx** - Eventually refractor cognitiveTraining.tsx, lucidDream.tsx and nap.tsx to use functions from this file instead of within their own screens for maintainability.
	- **storage.tsx** - responsible for storing all variables needed to make calls to the server. Any updates from any other screens to the variables should be done using the saveAPIVariables function.
	```typescript
		export interface APIVariables { 
					baseURL: string; 
					port: number; 
					ledValue: number; 
					soundValue: number; 
					vrGame: string; 
					deviceType: 'portable' | 'lab'; 
					ledCommandNo: number; 
					audioCommandNo: number; 
					gvsCommandNo: number; }
	```

- **assets Folder**
	- **audio.tsx** - includes all the audio required for the app, this includes the AI generated recordings for each overnight screen
	- **images.tsx** - includes all images required by the app
- **constants Folder**
	- **Style.tsx** - All shared styles in here. Screens make use of stylesheets within their own screen files or they may use shared components from this file. Things like cards, containers etc. can be found here

**Stack layout (Navigation):**

	(home)-> index->overnight->introToLD->introToSystem->uninterruptedSleep->videoGuideHeadset->cognitiveTraining->playVR->stayAwake->lucidDream
		
  ...or..
  
	(home) -> nap

**To run this program using expo GO app for testing please follow the current steps:**
```
npm install
npx expo start
```
- Scan the generated QR code from the EXPO GO app
- If the authentication is wrong, delete the "eas" in app.json

**To build an apk:**
- First configure EAS file by following this link: https://docs.expo.dev/build/setup/
- Modify eas.json as per this link: https://docs.expo.dev/build-reference/apk/
- Run:
-     eas build -p android --profile preview //or the name of your profile instead of preview

