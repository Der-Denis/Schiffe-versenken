<?php

    print_r($_POST); # Testausgabe der übergebenen Werte

    $datei = "spiel.json";

    file_put_contents($datei, "Test");

    class Spiel
    {
        public $spieler1;
        public $spieler2;
        public $token; # welcher Spieler ist dran.
        public $spielfeld;

        function __construct($spieler1, $spieler2, $token, $spielfeld)
        {
            $this->spieler1 = $spieler1;
            $this->spieler2 = $spieler2;
            $this->token = $token;
            $this->spielfeld = $spielfeld;
        }
    }

?>
