<?php
	#print_r($_POST); # Testausgabe der übergebenen Werte

	$datei = "spiel.json";

	/* for($i = 0; $i<100; $i++)
	{
	echo rand(0,1); # Testversuch für Zufallszahl
	} */

	if (isset($_POST["aufstellung"])) # Spieler will sich registrieren
	{
		registrierung($datei);
	}
	else if (isset($_POST["spielzug"])) # Spielzug setzen
	{
		#echo "Spielzug: ".$_POST["spielzug"]."\n"; # Testausgabe
		$spieldaten = file_get_contents($datei); # Dateiauslesen
		$json = json_decode($spieldaten); # JSON String decodieren -> Objekt
		$spiel = new Spiel($json->spieler1, $json->spieler2, $json->token, $json->aufstellung1, $json->aufstellung2); # Spielobjekt neu erzeugt mit Parametern
		$check = explode(";", $spiel->token);
		
		if ($check[0] === "Spieler1") # Spieler1 dran -> Tokenwechsel
		{
			#echo $_POST["spielzug"].$_POST["spielerID"]."???\n"; # Testausgabe
			#print_r($array); # Testausgabe
			#echo $_POST["spielzug"]; # Testausgabe
			$spiel->token = "Spieler2"; # Wechsel des Tokens an ID 2. Spieler
		}
		else if ($check[0] === "Spieler2") # Spieler2 dran -> Tokenwechsel
		{
			#echo $_POST["spielzug"].$_POST["spielerID"]."!!!\n"; # Testausgabe
			#print_r($array); # Testausgabe
			#echo $_POST["spielzug"]; # Testausgabe
			$spiel->token = "Spieler1"; # Wechsel des Tokens an ID 1. Spieler
		}
		
		$auswertung = auswerten($_POST["spielerID"], $_POST["spielzug"], $spiel, $datei); # Arraybearbeitung
		$spiel->token .= ";" . $_POST["spielzug"];
		echo $auswertung;
		#echo "Spielzug erfolgt."; # Testausgabe
		# Auswertung ob (W)asser / (T)reffer / (V)ersenkt
		
		$json = json_encode($spiel); # JSON String generieren
		file_put_contents($datei, $json); # in Datei schreiben
	}
	else if (isset($_POST["spielerID"])) # Tokenabfrage
	{
		$spieldaten = file_get_contents($datei); # Dateiauslesen
		$json = json_decode($spieldaten); # JSON String decodieren -> Objekt
		echo $json->token; # Token zurückgeben (SpielerID;Spielzug)
	}
	else # Spieler1 will Spieler2 Namen
	{
		$spieldaten = file_get_contents($datei); # Dateiauslesen
		$json = json_decode($spieldaten); # JSON String decodieren -> Objekt
		echo $json->spieler2; # Spieler2 zurückgeben (Namen)
	}

	function registrierung($datei) # Registrierung in spiel.json - Datei
	{
		if (!file_exists($datei)) # Datei existiert nicht -> Spieler1 mit Aufstellung1 reinschreiben
		{
			$json = json_decode($_POST["aufstellung"]); # JSON String decodieren -> Array
			$spiel = new Spiel($_POST["spieler"], null, null, $json, null); # Objekt Spiel erzeugen mit Parametern
			$json = json_encode($spiel); # JSON String generieren
			#print_r($spiel); # Testausgabe
			file_put_contents($datei, $json); # in Datei schreiben
			echo "Spieler1;registriert."; # Ausgabe für JS
		}
		else # Spieler2 will sich registrieren
		{
			$spieldaten = file_get_contents($datei); # Dateiauslesen
			$json = json_decode($spieldaten); # JSON String decodieren -> Objekt
			
			# echo "Spieler1: ".$json->spieler1."\n"; # Wertzugriff mit Schlüssel -> Testausgabe
			$spiel = new Spiel($json->spieler1, $json->spieler2, $json->token, $json->aufstellung1, $json->aufstellung2); # Spielobjekt neu erzeugt mit Parametern
			
			if ($json->spieler2 !== null)
			{
				echo "Spiel bereits im Gange."; # Ausgabe für JS
			}
			else
			{
				$spiel->spieler2 = $_POST["spieler"];
				$json = json_decode($_POST["aufstellung"]); # String in Array umwandeln
				$spiel->aufstellung2 = $json; # Array eintragen
				#print_r($spiel); # Testausgabe
				echo "Spieler2;registriert.;Gegner;"; # Ausgabe für JS, getrennt durch ";"
				echo $spiel->spieler1 . ";"; # Spieler 1 Namen zurückgeben
				#$spiel->token = "test123"; # Testeintrag in JSON
				
				if (rand(0, 1) === 0) # Zufallsentscheid, wer anfängt von 0 bis 1 (Ganzzahl)
				{
					$spiel->token = "Spieler1"; # ID 1. Spieler
				}
				else
				{
					$spiel->token = "Spieler2"; # ID 2. Spieler
				}
				$spiel->token .= ";"; # danach kommt letzter gemachter Zug, bei Erstzug leer
				
				echo $spiel->token; # Rückgabe des Tokens
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
			$this->spieler1 = $spieler1; # Spielername
			$this->spieler2 = $spieler2; # Spielername
			$this->token = $token;
			$this->aufstellung1 = $aufstellung1; # Schiffe
			$this->aufstellung2 = $aufstellung2; # Schiffe
		}
	}

	function auswerten($SID, $spielzug, $spiel, $datei) # SID = spielerID
	{
		# Logik mit return der Meldung
		#echo "Spielzug: ".$spielzug; # Testausgabe
		#print_r($schiffsammlung); # Testausgabe
		$status = "W"; # (W)asser
		$schiffsammlung;
		
		if ($SID === "Spieler1") # Spieler1 schießt auf Aufstellung von Spieler2
		{
			$schiffsammlung = $spiel->aufstellung2;
		}
		else # Spieler2 schießt auf Aufstellung von Spieler1
		{
			$schiffsammlung = $spiel->aufstellung1;
		}
		
		$leer = true;
		
		foreach ($schiffsammlung as &$schiff) # & => Referenz
		{
			foreach ($schiff as &$feld) # & => Referenz
			{
				# prüfen ob getroffen; übergebe Array-Index -> $treffer
				if (($treffer = array_search($spielzug, $schiff)) !== false)
				{
					#print_r($schiff); # Testausgabe
					#echo "Treffer: ".$treffer; # Testazsgabe
					unset($schiff[$treffer]); # Feld aus Schiff-Array nehmen
					$schiff = array_values($schiff); # Entfernen von Index (alle)
					$status = "T"; # (T)reffer
					
					if (count($schiff) === 0) # prüfen ob keine mehr beschießbaren Felder
					{
						$status = "V"; # (V)ersenkt
					}
					#print_r($schiff); # Testausgabe
				}
			}
			if ($leer) # solange leer ist überprüfe, ob Schiff leer
			{
				$leer = empty($schiff); # nicht leeres Schiff gefunden
			}
			#print_r($schiffsammlung); # Testausgabe
		}
		
		if ($leer)
		{
			$status = "G"; # (G)ewonnen
		}
		
		if ($SID === "Spieler1") # Aktualisierung der Schiffsammlung Spieler2
		{
			$spiel->aufstellung2 = $schiffsammlung;
		}
		else # Aktualisierung der Schiffsammlung Spieler1
		{
			$spiel->aufstellung1 = $schiffsammlung;
		}
		
		$json = json_encode($spiel); # JSON String generieren
		file_put_contents($datei, $json); # in Datei schreiben
		
		return $status;
	}
?>
