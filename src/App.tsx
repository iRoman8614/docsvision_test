import React from 'react';
import {PlacesAccordion} from "./components /placesAccordion/PlacesAccordion";
import {ItemList} from "./components /itemList/ItemList";
import styles from "./App.module.css"

const firebaseConfig = {
    apiKey: "AIzaSyD6DnGbVfdJlDJ_pEOUfDfTDJrA8j3lIs8",
    authDomain: "dv-inventory.firebaseapp.com",
    databaseURL: "https://dv-inventory.firebaseio.com",
    projectId: "dv-inventory",
    storageBucket: "dv-inventory.appspot.com",
    messagingSenderId: "130062240176",
    appId: "1:130062240176:web:ecbca5d29b37d25c6cee75"
}
if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig)
} else {
    window.firebase.app()
}
function App() {
    return (
        <div className={styles.root}>
            <PlacesAccordion />
            <ItemList />
        </div>
    )
}
export default App
