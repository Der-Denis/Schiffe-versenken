window.addEventListener("load", ladenErfolgreich);

function ladenErfolgreich()
{
    document.getElementById("start").addEventListener("click", timerStarten); // Timer setzen
}

let zahl=0;

function timerStarten()
{
    document.getElementById("start").removeEventListener("click", timerStarten); // nur 1x Spiel beginnen
    setInterval(ajaxAusfuehren, 5000); // alle 5 Sekunden
}

function ajaxAusfuehren()
{
    console.log(zahl);
    zahl++;
}
