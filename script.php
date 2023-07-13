<?php
    #print_r($_POST); # Testausgabe der übergebenen Werte

    $datei = "spiel.json";

    /* for($i = 0 ; $i<100;$i++)
    {
        echo rand(0,1); # Testversuch
    } */

    if(null !== $_POST["aufstellung"]) # Spieler will sich registrieren
    {
        registrierung($datei);
    }
    else if($_POST["spielzug"] !== null) # Spielzug setzen
    {
        
    }
    else #Spieler1 will Spieler2 Namen ODER tokenabfrage
    {
        $spieldaten = file_get_contents($datei); # Dateiauslesen
        $json = json_decode($spieldaten); # JSON String decodieren -> Objekt
        echo $json->spieler2; # Spieler2 zurückgeben (Namen)
    }
    
    function registrierung($datei) # Registrierung in spiel.json - Datei
    {
        if(!file_exists($datei)) # Datei existiert nicht -> Spieler1 mit Aufstellung1 reinschreiben
        {
            $json = json_decode($_POST["aufstellung"]); # JSON String decodieren -> Array
            $spiel = new Spiel($_POST["spieler"], null, null, $json, null); # Objekt Spiel erzeugen mit Parametern
            $json = json_encode($spiel); # JSON String generieren
            #print_r($spiel); # Testausgabe
            file_put_contents($datei, $json); # in Datei schreiben
            echo "Spieler1 registriert."; # Ausgabe für JS
        }
        else # Spieler2 will sich registrieren
        {
            $spieldaten = file_get_contents($datei); # Dateiauslesen
            $json = json_decode($spieldaten); # JSON String decodieren -> Objekt

            # echo "Spieler1: ".$json->spieler1."\n"; # Wertzugriff mit Schlüssel -> Testausgabe
            $spiel = new Spiel($json->spieler1, $json->spieler2, $json->token, $json->aufstellung1, $json->aufstellung2); # Spielobjekt neu erzeugt mit Parametern
            
            if($json->spieler2 !== null)
            {
                echo "Spiel bereits im Gange."; # Ausgabe für JS
                return;
            }
            else
            {
                $spiel->spieler2 = $_POST["spieler"];
                $json = json_decode($_POST["aufstellung"]); # String in Array umwandeln
                $spiel->aufstellung2 = $json; # Array eintragen
                #print_r($spiel); # Testausgabe
                echo "Spieler2 registriert. Gegner: "; # Ausgabe für JS
                echo $spiel->spieler1; # Spieler 1 braucht Info über Spieler 2 !!! -> JS
                #$spiel->token = "test123"; # Testeintrag in JSON
                
                if(rand(0,1) === 0) # Zufallsentscheid, wer anfängt von 0 bis 1 (Ganzzahl)
                {
                    $spiel->token=$spiel->spieler1;
                }
                else
                {
                    $spiel->token=$spiel->spieler2;
                }
                $spiel->token.=";"; // danach kommt letzter gemachter Zug
                $json = json_encode($spiel); # JSON String generieren
                file_put_contents($datei, $json); # in Datei schreiben
                #echo rand(0,1); # Spieler bestimmen der anfängt
            }
        }
    }

    class Spiel # Vorlage für die Speicherung in JSON-Format
    {
        public $spieler1;
        public $spieler2;
        public $token; # 1. Stelle: Spieler der dran ist; 2. Stelle: letzter Spielzug ("Spieler1" oder "Spieler2" -> IDs)
        public $aufstellung1;
        public $aufstellung2;

        function __construct($spieler1, $spieler2, $token, $aufstellung1, $aufstellung2)
        {
            $this->spieler1 = $spieler1;
            $this->spieler2 = $spieler2;
            $this->token = $token;
            $this->aufstellung1 = $aufstellung1;
            $this->aufstellung2 = $aufstellung2;
        }
    }

?>
