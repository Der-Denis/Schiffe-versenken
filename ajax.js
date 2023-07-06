// Variablen
let zahler = 0;
let anzahl = 10;
let index = 'a';

// Startzustand herstellen nach Laden der Seite
window.addEventListener("load", ladenErfolgreich);
function ladenErfolgreich()
{
    document.getElementById("start").addEventListener("click", timerStarten); // Timer setzen
    plazierungVorbereiten();
    //spielzugVorbereitung(); // Testaufruf zur Überprüfung
}

function timerStarten()
{
    if (document.getElementById("spieler").value !== "")
    {
        document.getElementById("spieler").readOnly = true; // Feld für Spielernamen sperren
        document.getElementById("start").removeEventListener("click", timerStarten); // nur 1x Spiel beginnen
        setInterval(verbinden, 5000); // alle 5 Sekunden
    }
    else
    {
        alert("Spielernamen eingeben!");
    }
}

// Spielersuche zum Registrieren in Datei zum Aufbau des Spiels
function verbinden()
{
    console.log(zahler);
    zahler++;

    // Anfang - Browserweiche
    try
    {
        // Eintrag von Verbindungsdaten in xhttp
        xhttp = new XMLHttpRequest(); // Firefox
    }
    catch (error)
    {
        try
        {
            xhttp = new ActiveXObject("Msxml2.XMLHTTP"); // Microsoft
        }
        catch (error)
        {
            return;
        }
    }
    // Ende - Browserweiche

    // liest ständig die Rückmeldungen
    xhttp.onreadystatechange = ajax;

    // Verbindung wird geöffnet mit method="POST"
    xhttp.open("POST", "script.php");

    // Vorlage für Formular erstellen + Daten mit "append" anheften
    let formDaten = new FormData();
    formDaten.append("spieler", document.getElementById("spieler").value);

    // Anfrage wird gesendet
    xhttp.send(formDaten);
}

// Antwort des php-Skripts

function ajax()
{
    // readyState = 4 -> Rückmeldung vollständig ; status = 200 -> Rückmeldung fehlerfrei
    if (this.readyState == 4 && this.status == 200)
    {
        let antwort = this.responseText;
        console.log(antwort);
    }
}

// Spalzierung der Schiffe

function plazierungVorbereiten() // fügt alle benötigten EventListener zu
{
    //console.log("Plazierung wird vorbereitet..."); // Testausgabe
    
    // Für jede Reihe ( A - J )
    for(let zahlReihe = 1; zahlReihe <= anzahl; zahlReihe++)
    {
        // Reihe A
        for (let zahl = 1; zahl <= anzahl; zahl++)
        {
            //console.log("Index: "+index);
            let idFeld = "spieler." + index + zahl;
            //console.log(idFeld); // id-Ausgabe zum Test
            document.getElementById(idFeld).addEventListener("click", platzieren);
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1);
    }
}

// Logik der Platzierung mit Einhaltung der Regeln

function platzieren()
{
    console.log(this.id);
    // id des Elements
}

// Spielzüge

function spielzugVorbereitung() // noch zu testen
{
    //console.log("Züge werden vorbereitet..."); // Testausgabe
    index = 'a'; // Zurücksetzen des Indexes
    
    // Für jede Reihe ( A - J )
    for(let zahlReihe = 1; zahlReihe <= anzahl; zahlReihe++)
    {
        // Reihe A
        for (let zahl = 1; zahl <= anzahl; zahl++)
        {
            //console.log("Index: "+index);
            let idFeld = "gegner." + index + zahl;
            //console.log(idFeld); // id-Ausgabe zum Test
            document.getElementById(idFeld).addEventListener("click", spielzug);
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1);
    }
}

// Logik der Spielzüge

function spielzug()
{
    console.log(this.id);
}
