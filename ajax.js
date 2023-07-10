// Variablen
let zahler = 0;
let anzahl = 10; // Zeilen & Spalten
let index = 'a'; // Zeilenanfang
let spieleraktion = ""; // Klick des Spielers (ID des angeklicktgen Elements)

// Anzahl der Schiffe (mit Feldgröße)
let schiff2 = 4; // U-Boote
let schiff3 = 3; // Zerstörer
let schiff4 = 2; // Kreuzer
let schiff5 = 1; // Schlachtschiff

// Startzustand herstellen nach Laden der Seite
window.addEventListener("load", ladenErfolgreich);
function ladenErfolgreich()
{
    document.getElementById("start").addEventListener("click", timerStarten); // Timer setzen
    vorbereiten("spieler", feldauswahl); // was soll vorbereitet werden? "feldauswahl" / "spielzug" + welches Feld
    //vorbereiten("gegner", spielzug); // Testaufruf zur Überprüfung
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
            try
            {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP"); // Microsoft
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
        let antwort = this.responseText;
        console.log(antwort);
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
            //console.log("Index: "+index);
            let idFeld = feld + "." + index + zahl;
            //console.log(idFeld); // id-Ausgabe zum Test
            document.getElementById(idFeld).addEventListener("click", auswahl);
        }
        index = String.fromCharCode(index.charCodeAt(0) + 1);
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

    switch (wert)
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

    if (schiffVorhanden) // Statusmeldungen an Spieler
    {
        // benötigte Elemente in schiffsflache laden + sperrbereich füllen
        for (let zeichne = 0; wert > zeichne; zeichne++)
        {
            let IDsperreDavor = "";
            let IDsperreDanach = "";
            let ende = "";
            console.log("Start: " + start); // Testausgabe
            let IDzusatz = "";
            if (ausrichtung === "h") // horizontal
            {
                let temp = zeichne + parseInt(start.slice(1)); // zur vorbereitung der variablen Zahl der ID
                //console.log("Temp: " + temp); // Testausgabe
                IDzusatz = start.charAt(0) + temp;
                IDsperreDavor = String.fromCharCode(start.charCodeAt(0) - 1) + temp;
                IDsperreDanach = String.fromCharCode(start.charCodeAt(0) + 1) + temp;
                //console.log("von " + IDsperreDavor + " bis " + IDsperreDanach); // Testausgabe für davor und danach sperren
            }
            else // vertikal
            {
                let temp = String.fromCharCode(zeichne + start.charCodeAt(0));
                //console.log(temp); // Testausgabe
                IDzusatz = temp + start.slice(1);
            }
            //console.log("schiffsflache..."); // Testausgabe

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

        // Sperrbereich erweitern: eins nach vorne + eins nach hinten, falls möglich (document.getElementById=null, wenn nicht da)
        console.log("erstes Element: " + sperrbereich[0].id); // Testausgabe - erstes Element
        console.log("letztes Element: " + sperrbereich[sperrbereich.length - 1].id); // Testausgabe - letztes Element


        // horizontal (vertikal fehlt)
        let sperranfang = sperrbereich[0].id.split("."); // Sperrelement für Start
        let sperrende = sperrbereich[sperrbereich.length - 1].id.split("."); // Sperrelement für Ende
        let zusatzsperreAnfang = sperranfang[1].slice(1) - 1;
        let zusatzsperreEnde = parseInt(sperrende[1].slice(1)) + 1;
        //console.log("ZusatzsperreEnde: " + sperrende); // Testausgabe

        for (let zusatz = 0; zusatz < 3; zusatz++)
        {
            // linke Seite sperren
            let temp = String.fromCharCode(sperranfang[1].charCodeAt(0) + zusatz) + zusatzsperreAnfang;
            console.log("ID: " + "spieler." + temp); // Testausgabe
            let pruefen = document.getElementById("spieler." + temp);
            if (pruefen !== null)
            {
                sperrbereich.push(pruefen);
                //console.log("Test: "+pruefen); // Testausgabe
            }

            // rechte Seite sperren
            temp = String.fromCharCode(sperrende[1].charCodeAt(0) + zusatz) + (zusatzsperreEnde); // gefällt mir nicht
            pruefen = document.getElementById("spieler." + temp);
            console.log("neu Temp: " + temp);
            if (pruefen !== null)
            {
                sperrbereich.push(pruefen);
                console.log("Test: " + pruefen.id); // Testausgabe
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
                    break;
                case 4:
                    schiff4--;
                    break;
                case 3:
                    schiff3--;
                    break;
                case 2:
                    schiff2--;
            }
            for (const element of schiffsflache) // Schiff platzeren
            {
                element.innerHTML = "O";
                element.style.backgroundColor = "grey";
            }
            document.getElementById("status").innerHTML = schifftyp + " wurde platziert.";

            // Bereich drumherum sperren
            for (const element of sperrbereich) // Schiff platzeren
            {
                element.innerHTML = "X";
                element.style.backgroundColor = "yellow";
            }
            console.log(sperrbereich); // Testausgabe des Sperrbereichs

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

