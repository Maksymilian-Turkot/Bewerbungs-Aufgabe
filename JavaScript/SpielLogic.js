class Spiel {
    constructor(){
        this.spielFeld = document.getElementById('Spielfeld');
        this.Feld;

        this.starten = function() {
            this.spielerEinsZug = true;
            this.zug = 0;
            this.feldGrosse = 4;
            this.maxZuge = this.feldGrosse * this.feldGrosse;
            // Entfernt Alle Alten buttons oder ausgewählten Felder
            while (this.spielFeld.children.length > 0) {
                this.spielFeld.children[0].remove()
            }

            // füllt alle spielFelder mit undefined damit später das spiel Feld einfach geprüft werden kann
            // dazu erstellen wir neue Buttons um die Auswahl dieses Feldes frei zu geben.
            this.Feld = [];
            for (let i = 0; i < this.feldGrosse; i++) {
                this.Feld[i] = [];
                for (let j = 0; j < this.feldGrosse; j++) {
                    this.Feld[i][j] = undefined;
                    let neuerKnopf = document.createElement("button")
                    neuerKnopf.value = [i, j];
                    neuerKnopf.onclick = function() {
                        Auswahl(neuerKnopf);
                    }
                    Spielfeld.append(neuerKnopf);
                } 
            }  

            this.spielerWechseln = function() {
                this.spielerEinsZug = !this.spielerEinsZug;
                
            }

            this.jetzigerSpieler = function() {
                if (this.spielerEinsZug) {
                    return spieler1
                } else {
                    return spieler2
                }
            }
        }
    }   
}

class Spieler {
    constructor(Zeichen) {
        this.zeichen = Zeichen;
        this.felder = [];
    }
}

const debug = false;
const spiel = new Spiel()

const spieler1 = new Spieler("X")
const spieler2 = new Spieler("O")

spiel.starten()

// Beim druck des Knopfes wird jeweils die onclick Methode ausgelost, die gibt uns den jeweiligen Element
function Auswahl(element) {
    feldAuswechseln(element);
    spiel.zug++;
    if (spiel.zug >= 5) {
       if (!spielZuStand()) {
        spiel.spielerWechseln()
        spielerTextWechsel();
       }
    } else {
        spiel.spielerWechseln()
        spielerTextWechsel();
    }
    
}

// Wechselt das Button aus für ein <h3>, die Auswahl deutlich zu machen.

// Zusätzliche Speicherung der einzeln Spieler Felder beim Spieler ist im diesen fall nicht nötig, aber wurde zukünftig helfen bei 
// einer implementation eine Undo / Zurück nahmen Knopfes.
function feldAuswechseln(element) {
    let Auswahl = document.createElement("h3");
        spiel.Feld[element.value[0]][element.value[2]] = spiel.jetzigerSpieler().zeichen;
        Auswahl.innerText = spiel.jetzigerSpieler().zeichen;
        spiel.jetzigerSpieler().felder.push(element.value);

    element.replaceWith(Auswahl);
}

// Wechselt von spieler zu spieler. Ändert das <h1> element um deutlich zu machen welcher der beiden spieler Dran ist.
function spielerTextWechsel() {
    let zugText = document.getElementById("spiel").children[0];
        zugText.innerText = spiel.jetzigerSpieler().zeichen;

}
function spielZuStand() {
    if (debug) {
        console.log("\t\t Prufung für ",spiel.jetzigerSpieler().zeichen, ":")
    }
    if (zeilenPruefung() || spaltenPruefung() || diagonalPruefung()) {
        gewonnen();
        return true;
    } else if (spiel.zug == spiel.maxZuge) {
        unentschieden();
        return true;
    }  else {
        return false;
    }
}


function zeilenPruefung() {
    let counter = 0;
    if (debug) {
        console.log("Zeilen überprüfung: \n")
    }
    for(i = 0; i < spiel.feldGrosse; i++) {
        counter = 0;
        for(j=0; j < spiel.feldGrosse; j++) {
            if (spiel.Feld[i][j] === spiel.jetzigerSpieler().zeichen) {
                console.log("\tcounter increased (",counter,")")
                counter++;
            } else {
                counter = 0
                console.log("\tcounter reset (",counter,")")
            }
            if (counter >= 3) {
                console.log("gewonnen")
                return true;
            }
        }

    }
    if (debug) {
        console.log("Ende")
    }
    return false;
}

function spaltenPruefung() {
    let counter = 0;
    if (debug) {
        console.log("Spalten überprüfung: \n")
    }
    for(i = 0; i < spiel.feldGrosse; i++) {
        counter = 0;
        for(j=0; j < spiel.feldGrosse; j++) {
            if (spiel.Feld[j][i] === spiel.jetzigerSpieler().zeichen) {
                console.log("\tcounter increased (",counter,")")
                counter++;
            } else {
                console.log("\tcounter reset (",counter,")")
                counter = 0
            }
            if (counter >= 3) {
                console.log("gewonnen")
                return true;
            }
        }

    }
    if (debug) {
        console.log("ende")
    }
    return false;
}

function diagonalPruefung() {
    if (debug) {
        console.log("Diagonale L -> R überprüfung: \n");
    }
    if (diagonale1(1,0) || diagonale1(0,0) || diagonale1(0, 1)) {
        return true;
    }
    console.log("Ende \n")
    if (debug) {
        console.log("Diagonale R -> L überprüfung: \n")
    }
    if (diagonale2(1,3) || diagonale2(0,3) ||diagonale2(0,2)) {
        return true;
    }
    console.log("Ende \n")
    return false;
}

function diagonale1(x, y) {
    let counter = 0;

    while ((x < spiel.feldGrosse) && (y < spiel.feldGrosse)) {
        if (debug) {
            console.log("\t X: ",x, " Y: ",y, " Counter: ",counter)
        }
        if (spiel.Feld[x][y] == spiel.jetzigerSpieler().zeichen) {
            counter++;
        } else {
            counter = 0
        }
        if (counter >= 3) {
            if (debug) {
                console.log("\t", spiel.jetzigerSpieler().zeichen, " Hat gewonnen.")
            }
            return true;
        } 
        
        x++;
        y++;
    }
    return false;
}

function diagonale2(x, y) {
    let counter = 0;

    while (x < spiel.feldGrosse && y >= 0) {
        if (debug) {
            console.log("\t X: ",x, " Y: ",y, " Counter: ",counter)
        }
        if (spiel.Feld[x][y] == spiel.jetzigerSpieler().zeichen) {
            counter++;
        } else {
            counter = 0
        }
        if (counter >= 3) {
            if (debug) {
                console.log("\t", spiel.jetzigerSpieler().zeichen, " Hat gewonnen.")
            }
            return true;
        } 

        x++;
        y--;
    }
    return false;
}

function gewonnen() {
    KnöpfeDeaktivieren()
    let text = document.getElementById("spiel").children[0]
    text.innerText = spiel.jetzigerSpieler().zeichen + " hat gewonnen!"
    neuStartKnopf("weiter spielen?") 
}

function unentschieden() {
    let text = document.getElementById("spiel").children[0]
    text.innerText = "Niemand hat gewonnen."
    neuStartKnopf("nochmal spielen?") 
}

function KnöpfeDeaktivieren() {
    var kinder = spiel.spielFeld.children
    for (i = 0; i < kinder.length; i++) {
        if (kinder[i].tagName == "BUTTON") {
            kinder[i].disabled = true;
        }
    }
}

function neuStartKnopf(text) {
    let button = document.createElement("button");
    button.innerText = text;
    button.id = "neuStart"
    button.onclick = function() {
        neuStart();
    }
    spiel.spielFeld.after(button)
}
 
function neuStart() {
    spiel.starten();
    spieler1.felder = [];
    spieler2.felder = [];
    spielerTextWechsel()
    document.getElementById("neuStart").remove()
}