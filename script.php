<?php

    print_r($_POST); # Testausgabe der übergebenen Werte

    $datei = "spiel.json";

    file_put_contents($datei, "Test");

    class Spiel
    {
        public $spieler1;
        public $spieler2;
        public $token; # welcher Spieler ist dran.
        public $spielfeld1;
        public $spielfeld2;

        function __construct($spieler1, $spieler2, $token, $spielfeld1, $spielfeld2)
        {
            $this->spieler1 = $spieler1;
            $this->spieler2 = $spieler2;
            $this->token = $token;
            $this->spielfeld1 = $spielfeld1;
            $this->spielfeld2 = $spielfeld2;
        }
    }

?>
