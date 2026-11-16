// VARIABILI GLOBALI
  // Variabili necessarie per tutto il codice
  let myTable; // Variabile di banca dati
  let datiPaese = null // Variabile che salva tutti i dati del paese in causa
  // null = vuoto, almeno inizialmente

  // Variabili di layout condivise per allineamento
  let yBaseBarre;

  // Variabile per l'animazione del bottone ranking
  let diametroRank = 100;

//CONFIGURAZIONE INIZIALE ASINCRONA
// Uso "async" perché devo aspettare che il file CSV sia completamente caricato prima di iniziare a disegnare
  async function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
  console.log('p5.js version:', p5.VERSION);

  // Legge il file appena è caricato
  myTable = await loadTable ("assets/dataset.csv", ",", "header");

  // Legge dall'URL quale paese vogliamo vedere
  let params = getURLParams();
  // int= serve a trasformare il parametro in un numero intero
  let indicePaese = int (params.id); // Trasforma il testo dell'ID in un numero intero
  datiPaese = myTable.getRow (indicePaese); // Estrae la riga esatta di quel paese dal dataset

}

//CICLO DI DISEGNO PRINCIPALE
  function draw() {
  background('black');

  yBaseBarre = windowHeight - 120;

  // 1. Layout testi base
    data ();

  // 2. Glifo Rosone nella zona centrale-sinistra
    let xCentroGlifo = windowWidth * 0.34;
    let yCentroGlifo = windowHeight * 0.55;
    let raggioRosone = 250;
    disegnaRosone(datiPaese, xCentroGlifo, yCentroGlifo, raggioRosone);

  // 3. Legenda 
    legenda ();
}

//LAYOUT TESTI BASE
function data () {
    // .toUpperCase(); => rende il nome in tutto maiuscolo
    let nomePaese = datiPaese.getString("country").toUpperCase(); // salva una cella alla volta per ogni riga di quella colonna.
    let rankPaese = datiPaese.getNum ("rank_2025") // salva un valore alla volta per ogni riga di quella colonna.
    let regionePaese = datiPaese.getString ("region") 
    let popTotale = datiPaese.getNum("total_population");
    let popCristiani = datiPaese.getNum("number_of_christians_wcd+od");
    let totalScore = datiPaese.getNum("total_score_2025");

    // Estrae dei singoli punteggi delle 6 sfere
    let scorePrivate = datiPaese.getNum("private_life_score");
    let scoreFamily = datiPaese.getNum("family_life_score");
    let scoreCommunity = datiPaese.getNum("community_life_score");
    let scoreNational = datiPaese.getNum("national_life_score");
    let scoreChurch = datiPaese.getNum("church_life_score"); 
    let scoreViolence = datiPaese.getNum("violence_score_2025");

    // Coordinate di partenza 
    let xInizio = 120;
    let yInizio = 120;

    // HOVER SUL BOTTONE RANKING:
    if (dist(mouseX, mouseY, xInizio, yInizio) < 50) {
      diametroRank = 110; // Si allarga quando sono sopra x bottone
    } else {
      diametroRank = 100;
    }

    // colore x score   
    let coloreScore = '#f89e3e'; 
    if (totalScore >= 80) {
    coloreScore = '#e32c07'; 
    } else if (totalScore >= 60) {
    coloreScore = '#F25E13'; 
    }

    push ();
    translate (xInizio,yInizio) // Vado alla posizione iniziale del testo 

    // RANKING:
        // Cerchio di sfondo
        noFill ();
        stroke(coloreScore); 
        strokeWeight(3);
        ellipse(0, 0, diametroRank, diametroRank);

        // Numero del rank dentro il cerchio
        fill(coloreScore);
        noStroke();
        textFont('Helvetica');
        textSize(36);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text("#" + rankPaese, 0, 0);
        pop();

    //TESTI LAYOUT:
    let xTesti = xInizio + 80; // Distanza dal cerchio

    // PAESE
        fill('white');
        noStroke();
        textFont('Helvetica');
        textSize(80);
        textStyle(BOLD);
        text(nomePaese, xTesti, yInizio+30);

    // REGIONE
        textSize(15);
        textFont('Helvetica');
        fill('white'); 
        textStyle(NORMAL);
        text("Region: " + regionePaese, xTesti+3.5, yInizio+90);

    // POPOLAZIONE
        textSize(15);
        textFont('Helvetica');
        fill('white'); 
        textStyle (NORMAL);
        text("Total population: " + popTotale, xTesti + 3.5, yInizio + 110);
        text("Number of christians: " +popCristiani, xTesti + 3.5, yInizio + 130);

    // WWL TOTAL SCORE
        // Posizione  blocco totale sulla destra 
        let xTotale = windowWidth * 0.72;

        // Titolino in alto
        push();
        translate(xTotale + 15, yBaseBarre - 500);
        fill('white');
        noStroke();
        textFont('Helvetica');
        textSize(14);
        textStyle(BOLD);
        textAlign(LEFT, TOP);
 
        text("WORLD WATCH LIST \n| Total score 2025", 0, 0);
        pop();      

        // Elenco dei singoli punteggi sotto
        push();
        translate(xTotale + 15, yBaseBarre - 450);
        fill('white');
        noStroke();
        textFont('Helvetica');
        textSize(11);
        textStyle(NORMAL);
        textAlign(LEFT, TOP);
    
        let testoDettaglio = "Score composition: " + "\n\n" +
            "Private life:               " + nf(scorePrivate, 0, 1) + "\n" +
            "Family life:                " + nf(scoreFamily, 0, 1) + "\n" +
            "Community life:        " + nf(scoreCommunity, 0, 1) + "\n" +
            "National life:             " + nf(scoreNational, 0, 1) + "\n" +
            "Church life:              " + nf(scoreChurch, 0, 1) + "\n" +
            "Violence score:        " + nf(scoreViolence, 0, 1) + "\n\n\n\n\n" +
            "Total score:"
        text(testoDettaglio, 0, 0);
        pop(); 

        // Valore numerico grande sotto sotto
        push ();
        translate (xTotale, yBaseBarre+130)
        fill(coloreScore);
        textSize(400);
        textStyle(BOLD);
        textAlign(LEFT, BOTTOM); 
        text(nf(totalScore, 0, 0), 0, 0);
        pop();
}

// DATI VISUALIZZABILI : Glifo rosone
    function disegnaRosone(datiPaese, x, y, raggioMassimo) {
    // 1. Impostazioni di base
        // Recupero i dati delle 5 sfere + violenza => i dati che sommamti definiscono il WWL SCORE
        let parametri = [
            { nome: "Private life",     valore: datiPaese.getNum("private_life_score") },
            { nome: "Family life",      valore: datiPaese.getNum("family_life_score") },
            { nome: "Community life",   valore: datiPaese.getNum("community_life_score") },
            { nome: "National life",    valore: datiPaese.getNum("national_life_score") },
            { nome: "Church life",      valore: datiPaese.getNum("church_life_score") },
            { nome: "Violence score",   valore: datiPaese.getNum("violence_score_2025") }
            ]; 
        
        // Definisco i colori dei cerchi con un array
        let coloriBase = [
            [135, 9, 227],   
            [900, 227, 222],  
            [100, 100, 90],  
            [200, 100, 200],  
            [20, 104, 175],  
            [100, 200, 100],
            ];
 
        push ();
        translate (x,y);

    // Cornice esterna del Rosone
            noFill();
            stroke(255);
            strokeWeight(2);
            ellipse(0, 0, raggioMassimo * 2); 
            ellipse(0, 0, raggioMassimo * 2 - 10);

            let angoloPasso = 360 / parametri.length; // 60 gradi per ogni spicchio

    // 6 petali geometrici interni (creo un ciclo for)
            // .lenght = conta quanti elementi ci sono nella lista
            for (let i = 0; i < parametri.length; i++) {
            let score = parametri[i].valore;
            let rgb = coloriBase[i];
            let angolo = i * angoloPasso;
            
            // Mappo lo score sull'altezza/lunghezza del petalo dal centro verso l'esterno
            // Riproportziona lo score (che va da 0 a 16.7) nella lunghezza in pixel del petalo
            let dimensionePetalo = map(score, 0, 16.7, 15, raggioMassimo - 15);
            push();
            rotate(angolo);
        
            // Riempimento colorato del petalo con trasparenza e bordo
            fill(rgb[0], rgb[1], rgb[2], 200);
            stroke(255);
            strokeWeight(1.5);
            
        // DISEGNO DELL'ELLISSE PROPORZIONALE (allo score):
            let larghezzaEllisse = dimensionePetalo; // La lunghezza del petalo corrisponde alla dimensione mappata
            // map = funzione che mappa valore = valore
            let altezzaEllisse = map(score, 0, 16.7, 10, raggioMassimo * 0.4); // Più alto è lo score, più il petalo si alza/ingrossa
            // Disegna l'ellisse spostando il suo centro a metà lunghezza, affinchè parta dal centro del rosone.
            ellipse(dimensionePetalo / 2, 0, larghezzaEllisse, altezzaEllisse);
            pop();
        }

            // Cerchietto centrale di chiusura
            fill(0);
            stroke(255);
            strokeWeight(2);
            ellipse(0, 0, 36);
            pop();
}

// LAYOUT LEGENDA IN BASSO
        function legenda() {
        let nomiParametri = [ 
            "Private life", 
            "Family life", 
            "Community life", 
            "National life", 
            "Church life", 
            "Violence score"
        ];

        // colori delle sfere della vita
            let coloriBase = [
            [135, 9, 227],   
            [900, 227, 222],  
            [100, 100, 90],  
            [200, 100, 200],  
            [20, 104, 175],  
            [100, 200, 100],
            ];

        // Livelli di persecuzione
        let livelli = [
        { testo: "Extreme", colore: '#e32c07' },
        { testo: "Very high", colore: '#F25E13' },
        { testo: "High", colore: '#f89e3e' }
    ];

        push();
        // Posiziono la legenda in basso a sinistra, sotto al rosone
        let startX = 120;
        let y1 = windowHeight - 100; // Riga superiore (Spheres)
        let y2 = windowHeight - 50; // Riga inferiore (Persecution)

        // Titolino
        fill(255);
        noStroke();
        textFont('Helvetica');
        textSize(14);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text("LEGENDA", startX, y1-40);

        // Spheres of Life
        fill(200);
        noStroke();
        textFont('Helvetica');
        textSize(12);
        textStyle(BOLD);
        textAlign(LEFT, CENTER);
        text("Spheres of Life", startX, y1-18);

        // Ciclo per disegnare le 6 sfere della vita
        for (let i = 0; i < nomiParametri.length; i++) { 
        let x = startX + (i * 150);

        fill(coloriBase[i][0], coloriBase[i][1], coloriBase[i][2]);
        noStroke();
        rectMode(CORNER);
        rect(x, y1, 12, 12, 2);

        fill(200);
        textFont('Helvetica');
        textSize(11);
        textStyle(NORMAL);
        textAlign(LEFT, CENTER);
        text(nomiParametri[i], x + 20, y1+6);
    }

        // Persecution Levels
        fill(200);
        textFont('Helvetica');
        textSize(11);
        textStyle(BOLD);
        text("Persecution Levels:", startX, y2-18);

        for (let j = 0; j < livelli.length; j++) {
        let x = startX + (j * 150);
        fill(livelli[j].colore);
        noStroke();
        rectMode(CORNER);
        rect(x, y2, 12, 12, 2);

        fill(200);
        textFont('Helvetica');
        textSize(11);
        textStyle(NORMAL);
        text(livelli[j].testo, x+20, y2+6);
        }
        pop();
}

// FUNZIONE CLICK PER TORNARE INDIETRO
    function mousePressed() {
    // Se clicco dentro il cerchio del ranking
    if (dist(mouseX, mouseY, 120, 120) < 50) {
    // reindirizzo alla pagina principale passando un parametro URL
       window.location.href = "index.html?view=all"; 
  }
}
