// Variablen
let zahler = 0;
let anzahl = 10; // für Zeilen & Spalten
let index = 'a'; // Zeilenanfang
let spieleraktion = ""; // Klick des Spielers (ID des angeklicktgen Elements)

// Anzahl der Schiffe (mit Feldgröße)
let schiff2 = 4; // U-Boote
let schiff3 = 3; // Zerstörer
let schiff4 = 2; // Kreuzer
let schiff5 = 1; // Schlachtschiff

// Antwort des Servers
let antwort

// Startzustand herstellen nach Laden der Seite
window.addEventListener("load", ladenErfolgreich);
function ladenErfolgreich()
{
    //document.getElementById("start").addEventListener("click", timerStarten); // Timer setzen // Testaufruf zur Überprüfung
    vorbereiten("spieler", feldauswahl); // was soll vorbereitet werden? "feldauswahl" / "spielzug" + welches Feld
    //vorbereiten("gegner", spielzug); // Testaufruf zur Überprüfung
}

function timerStarten() // Verbindungsaufbau für Spiel starten
{
    if (document.getElementById("spieler").value !== "") // Spielernamen eigegeben?
    {
        document.getElementById("spieler").readOnly = true; // Feld für Spielernamen sperren
        document.getElementById("start").removeEventListener("click", timerStarten); // nur 1x Spiel beginnen
        //setInterval(verbinden, 5000); // alle 5 Sekunden
        
    }
    else
    {
        alert("Spielernamen eingeben!"); // Meldung, dies nachzuholen
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
            try
            {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (error)
            {
                return;
            }
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
        antwort = this.responseText;
        // function für weiteren Ablauf
    }
}

// Spalzierung der Schiffe (feld="spieler"; auswahl=feldauswahl) / Spielzüge (feld="gegner"; auswahl=spielzug)
function vorbereiten(feld, auswahl) // Parameter
{
    //console.log("Plazierung wird vorbereitet..."); // Testausgabe
    index = 'a'; // Zurücksetzen des Indexes

    // Für jede Reihe ( A - J )
    for (let zahlReihe = 1; zahlReihe <= anzahl; zahlReihe++)
    {
        // jeweilige Reihe
        for (let zahl = 1; zahl <= anzahl; zahl++)
        {
            //console.log("Index: "+index); // Testausgabe
            let idFeld = feld + "." + index + zahl;
            //console.log("idFeld add: " + idFeld); // id-Ausgabe zum Test
            document.getElementById(idFeld).addEventListener("click", auswahl);
            //console.log(auswahl); // Testausgabe
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1); // nächster Buchstabe
    }
}

// Logik der Platzierung mit Einhaltung der Regeln

function feldauswahl()
{
    //console.log(this.id); // id des Elements (Testausgabe)
    let id = this.id;
    const schiffsflache = id.split(".");
    let aktion = schiffsflache[1];
    //console.log(aktion); // Testausgabe für das reine Feld

    if (spieleraktion === "") // Speicherung des ersten Klicks
    {
        spieleraktion = aktion;
    }
    else // Logik für 2. Auswahl
    {
        //console.log(spieleraktion + "." + aktion);

        // Überprüfung ob gerade
        if (spieleraktion.charAt(0) === aktion.charAt(0) || spieleraktion.slice(1) === aktion.slice(1))
        {
            //console.log("Schiff gerade"); // Testausgabe
            let lang = 0;
            let anfang = "";
            let richtung = "";
            let fix = ""; // Ziffer oder Zahl, je nach dem, was gleich

            if (spieleraktion.charAt(0) === aktion.charAt(0))
            {
                fix = "zeile";
                lang = aktion.slice(1) - spieleraktion.slice(1); // Berechnung
                richtung = "h"; // Anpassung der Ausrichtung
            }
            else
            {
                fix = "spalte";
                lang = spieleraktion.charCodeAt(0) - aktion.charCodeAt(0); // Berechnung
                richtung = "v"; // Anpassung der Ausrichtung
            }
            lang = korrigiereLang(lang); // Schifflänge korrigieren wegen Rechnung + Vorzeichen
            //console.log("Länge: "+lang); // Testausgabe
            //console.log("Richtung: "+richtung); // Testausgabe
            if (6 > lang && lang > 1)
            {
                //let temp = null; // temporäres Zahl oder Buchstabe zur Überprüfung (Zeile / Spalte)

                /* Testausgaben zur Fehlerüberprüfung der Logik
                console.log("Spieleraktion: " + spieleraktion + ", Aktion: " + aktion);
                console.log("Character: ");
                console.log(spieleraktion.charAt(0) <= aktion.charAt(0));
                console.log("Integer: ");
                console.log(parseInt(spieleraktion.slice(1)) <= parseInt(aktion.slice(1)));
                */
                if (spieleraktion.charAt(0) <= aktion.charAt(0) && (parseInt(spieleraktion.slice(1)) <= parseInt(aktion.slice(1))))
                {
                    //console.log("if"); // Testausgabe
                    anfang = spieleraktion; // erste Aktion
                }
                else
                {
                    //console.log("else"); // Testausgabe
                    anfang = aktion; // zweite Aktion
                }

                //console.log("Anfang: " + anfang); // Testausgabe
                platziereSchiff(anfang, lang, richtung); // Übergabe der benötigten Werte
            }
            else
            {
                alert("Gewählte Schiffgröße existiert nicht!\nLänge: " + lang); // Meldung an Spieler
            }
        }
        else
        {
            alert("Schiffe können nicht diagonal platziert werden!"); // Meldung an Spieler
        }

        spieleraktion = ""; // Spieleraktion wird zurückgesetzt (1. klick)
    }
}

// Logik der Spielzüge

function spielzug()
{
    console.log(this.id);
}

// Korrektur der berechneten Schiffslänge

function korrigiereLang(wert)
{
    if (wert < 0) // Wert negativ
    {
        wert /= -1; // Vorzeichenumkehr zu +
    }
    return ++wert; // +1 für Korrektur
}

// Darstellung der Schiffe auf dem Spielfeld

function platziereSchiff(start, wert, ausrichtung)
{
    // start = Schleifenanfang (links oben), wert = Länge, ausrichtung vertikal / horizontal (v/h)
    //console.log("Start: " + start + ", Wert: " + wert + ", Ausrichtung: " + ausrichtung); // Testausgabe zur Überprüfung der Werte

    let schifftyp = "";
    let schiffVorhanden = false;
    let schiffsflache = []; // Vorlage zur Reservierung des benötigten Bereichs für das Schiff
    let sperrbereich = []; // Vorlage zur Sperrung der Bereiche nebenan
    //console.log("Ausrichtung: " + ausrichtung); // Testausgabe

    switch (wert) // Schifftyp festlegen + Prüfung ob vorhanden (Bestand > 0)
    {
        case 5:
            schifftyp = "Schlachtschiff";
            if (schiff5 > 0)
            {
                schiffVorhanden = true;
            }
            break;
        case 4:
            schifftyp = "Kreuzer";
            if (schiff4 > 0)
            {
                schiffVorhanden = true;
            }
            break;
        case 3:
            schifftyp = "Zerstörer";
            if (schiff3 > 0)
            {
                schiffVorhanden = true;
            }
            break;
        case 2:
            schifftyp = "U-Boot";
            if (schiff2 > 0)
            {
                schiffVorhanden = true;
            }
    }

    if (schiffVorhanden) // wenn Schifftyp Anzahl > 0
    {
        // benötigte Elemente in schiffsflache laden + sperrbereich neben Schiff befüllen
        for (let zeichne = 0; wert > zeichne; zeichne++)
        {
            let IDsperreDavor = "";
            let IDsperreDanach = "";
            //console.log("Start: " + start); // Testausgabe
            let IDzusatz = "";
            if (ausrichtung === "h") // horizontal
            {
                let temp = zeichne + parseInt(start.slice(1)); // zur vorbereitung der variablen Zahl der ID
                //console.log("Temp: " + temp); // Testausgabe
                IDzusatz = start.charAt(0) + temp; // für die Fläche des Schiffs
                //console.log("IDzusatz: " + IDzusatz);
                IDsperreDavor = String.fromCharCode(start.charCodeAt(0) - 1) + temp;
                IDsperreDanach = String.fromCharCode(start.charCodeAt(0) + 1) + temp;
                //console.log("von " + IDsperreDavor + " bis " + IDsperreDanach); // Testausgabe für davor und danach sperren
            }
            else // vertikal
            {
                let temp = String.fromCharCode(zeichne + start.charCodeAt(0)); // zur vorbereitung des variablen Buchstabens der ID
                //console.log("Temp: " + temp); // Testausgabe
                IDzusatz = temp + start.slice(1); // für die Fläche des Schiffs
                //console.log("IDzusatz: " + IDzusatz);
                IDsperreDavor = temp + (start.slice(1) - 1);
                IDsperreDanach = temp + (parseInt(start.slice(1)) + 1);
                //console.log("von " + IDsperreDavor + " bis " + IDsperreDanach); // Testausgabe für davor und danach sperren
            }
            //console.log("schiffsflache..."); // Testausgabe

            // nur existierende Elemente in Array schreiben
            let pruefen = document.getElementById("spieler." + IDsperreDavor);
            if (pruefen !== null)
            {
                sperrbereich.push(pruefen);
            }
            pruefen = document.getElementById("spieler." + IDsperreDanach);
            if (pruefen !== null)
            {
                sperrbereich.push(pruefen);
            }
            schiffsflache.push(document.getElementById("spieler." + IDzusatz));
        }

        let schiffanfang = schiffsflache[0].id.split("."); // Sperrelement für Start
        let schiffende = schiffsflache[schiffsflache.length - 1].id.split("."); // Sperrelement für Ende

        // Sperrbereich erweitern: eins nach vorne + eins nach hinten (Schiff), falls möglich (document.getElementById(x) == null, wenn nicht da)

        if (ausrichtung === "h") // horizontale Ausrichtung
        {
            // Verschiebung nach vorne bzw. hinten (vom Schiff aus) -> Anpassung des fixen Wertes (Zahl)
            let zusatzsperreAnfang = schiffanfang[1].slice(1) - 1; // Zahl von
            let zusatzsperreEnde = parseInt(schiffende[1].slice(1)) + 1; // Zahl bis
            //console.log("ZusatzsperreAnfang: " + zusatzsperreAnfang); // Testausgabe
            //console.log("ZusatzsperreEnde: " + zusatzsperreEnde); // Testausgabe

            for (let zusatz = -1; zusatz < 2; zusatz++) // Verschiebung nach oben -> -1
            {
                // linke Seite sperren
                let temp = String.fromCharCode(schiffanfang[1].charCodeAt(0) + zusatz) + zusatzsperreAnfang; // Erzeugung der ID links
                //console.log("ID: " + "spieler." + temp); // Testausgabe
                let pruefen = document.getElementById("spieler." + temp);
                if (pruefen !== null)
                {
                    sperrbereich.push(pruefen);
                    //console.log("Test: "+pruefen); // Testausgabe
                }
                pruefen = null; // zurücksetzen

                // rechte Seite sperren
                temp = String.fromCharCode(schiffende[1].charCodeAt(0) + zusatz) + zusatzsperreEnde; // Erzeugung der ID rechts
                pruefen = document.getElementById("spieler." + temp);
                //console.log("neu Temp: " + temp);
                if (pruefen !== null)
                {
                    sperrbereich.push(pruefen);
                    //console.log("Test: " + pruefen.id); // Testausgabe
                }
            }
        }
        else // vertikale Ausrichtung
        {
            // Verschiebung nach vorne bzw. hinten (vom Schiff aus) -> Anpassung des fixen Wertes (Buchstabe)
            let zusatzsperreAnfang = String.fromCharCode(schiffanfang[1].charCodeAt(0) - 1); // Buchstabe von
            let zusatzsperreEnde = String.fromCharCode(schiffende[1].charCodeAt(0) + 1); // Buchstabe bis
            //console.log("ZusatzsperreAnfang: " + zusatzsperreAnfang); // Testausgabe
            //console.log("ZusatzsperreEnde: " + zusatzsperreEnde); // Testausgabe

            for (let zusatz = -1; zusatz < 2; zusatz++) // Verschiebung nach links -> -1
            {
                // linke Seite sperren
                let temp = zusatzsperreAnfang + (parseInt(schiffanfang[1].slice(1)) + zusatz); // Erzeugung der ID oben
                //console.log("ID: " + "spieler." + temp); // Testausgabe
                let pruefen = document.getElementById("spieler." + temp);
                if (pruefen !== null)
                {
                    sperrbereich.push(pruefen);
                    //console.log("Test: "+pruefen); // Testausgabe
                }
                pruefen = null; // zurücksetzen

                // rechte Seite sperren
                temp = zusatzsperreEnde + (parseInt(schiffende[1].slice(1)) + zusatz); // Erzeugung der ID unten
                pruefen = document.getElementById("spieler." + temp);
                //console.log("neu Temp: " + temp);
                if (pruefen !== null)
                {
                    sperrbereich.push(pruefen);
                    //console.log("Test: " + pruefen.id); // Testausgabe
                }
                //console.log("------------"); // Testausgabe (Trennung der Schleifendurchläufen)
            }
        }

        let check = true; // alle Felder müssen frei sein
        for (let element of schiffsflache) // Prüfen ob Felder frei für Platzierung
        {
            //console.log(element); // Testausgabe
            if (element.innerHTML === "X" || element.innerHTML === "O")
            {
                check = false; // unfreies Feld gefunden
                break; // Schleifenabbruch
            }
        }

        if (check) // wenn frei
        {
            switch (wert) // Schiff entnehmen für Platzierung
            {
                case 5:
                    schiff5--;
                    document.getElementById("schiff5").innerHTML = parseInt(document.getElementById("schiff5").innerHTML) + 1;
                    break;
                case 4:
                    schiff4--;
                    document.getElementById("schiff4").innerHTML = parseInt(document.getElementById("schiff4").innerHTML) + 1;
                    break;
                case 3:
                    schiff3--;
                    document.getElementById("schiff3").innerHTML = parseInt(document.getElementById("schiff3").innerHTML) + 1;
                    break;
                case 2:
                    schiff2--;
                    document.getElementById("schiff2").innerHTML = parseInt(document.getElementById("schiff2").innerHTML) + 1;
            }
            for (const element of schiffsflache) // Schiff platzeren
            {
                element.innerHTML = "O";
                element.style.backgroundColor = "grey";
            }
            document.getElementById("status").innerHTML = schifftyp + " wurde platziert.";

            // Bereich drumherum sperren
            for (const element of sperrbereich) // Sperrfläche um das Schiff drum herum platzieren
            {
                element.innerHTML = "X";
                element.style.backgroundColor = "yellow";
            }
            //console.log(sperrbereich); // Testausgabe des Sperrbereichs

            if (schiff5 === 0 && schiff4 === 0 && schiff3 === 0 && schiff2 === 0) // Abfrage ob Schiffe übrig zum platzieren
            {
                wasser();
            }

        }
        else // mindestens ein Feld belegt
        {
            document.getElementById("status").innerHTML = schifftyp + " konnte aufgrund einer Kollision nicht platziert werden!";
        }

        //console.log(check); // Testausgabe
    }
    else
    {
        document.getElementById("status").innerHTML = "Kein " + schifftyp + " mehr verfügbar!";
    }
}

function wasser() // wandelt Sperrflächen zu Wasserflächen um & entfernt die Evenlistener für die Platzierung der Schiffe
{
    //console.log("Wasser wird verschüttet..."); // Testausgabe
    index = 'a'; // Zurücksetzen des Indexes

    // Für jede Reihe ( A - J )
    for (let zahlReihe = 1; zahlReihe <= anzahl; zahlReihe++)
    {
        // jeweilige Reihe
        for (let zahl = 1; zahl <= anzahl; zahl++)
        {
            //console.log("Index: "+index); // Testausgabe
            let idFeld = "spieler." + index + zahl;
            //console.log(idFeld); // id-Ausgabe zum Test
            if (document.getElementById(idFeld).innerHTML !== "O") // kein Schiff platziert
            {
                document.getElementById(idFeld).innerHTML = "W"; // Wasserzeichen
                document.getElementById(idFeld).style.backgroundColor = "aqua"; // Wasserhintergrundfarbe
            }
            //console.log("idFeld remove: " + idFeld);
            document.getElementById(idFeld).removeEventListener("click", feldauswahl); // entferne die Auswahlmöglichkeit auf dem eigenen Spielfeld
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1); // nächster Buchstabe
    }
    setTimeout(meldungNachPlatzierung, 200); // damit Meldung erst nach den platzieren des letzten Schiffs auftaucht (200ms)
}

function meldungNachPlatzierung() // gibt die Bestätigung für den Spieler aus, dass alle Schiffe platziert wurden.
{
    alert("Es wurden alle Schiffe platziert.");
    document.getElementById("start").addEventListener("click", timerStarten); // Spiel bereit zum Starten -> Verbinden mit Server
}

function spielfeldLaden() // array aus dem Spielfeldes zurückgeben ("id=wert")
{
    index = 'a'; // Zurücksetzen des Indexes
    let spielfeld = [];

    // Für jede Reihe ( A - J )
    for (let zahlReihe = 1; zahlReihe <= anzahl; zahlReihe++)
    {
        // jeweilige Reihe
        for (let zahl = 1; zahl <= anzahl; zahl++)
        {
            //console.log("Index: "+index); // Testausgabe
            let idFeld = "spieler." + index + zahl;
            //console.log(idFeld); // id-Ausgabe zum Test
            spielfeld.push(idFeld + "=" + document.getElementById(idFeld).innerHTML)
            //console.log("idFeld remove: " + idFeld);
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1); // nächster Buchstabe
    }

    return spielfeld;
}
