let currentRow = []; // Stocke temporairement la ligne actuelle du CSV
let playInterval = null; // Pour gérer l'intervalle en mode Play
let revealTimeout = null; // Pour gérer le délai de révélation


// Fonction pour charger le fichier CSV et appliquer les filtres
async function getFilteredRows() {
  try {
    const response = await fetch('hiragana.csv');
    const data = await response.text();

    // Divise les lignes du CSV et filtre celles contenant au moins 2 colonnes
    const rows = data.split('\n')
      .map(row => row.split(',').map(cell => cell.trim()))
      .filter(row => row.length >= 3);

    // Récupère les filtres
    const filterkanas = document.getElementById('filter-kanas').checked;
    const filtermaru = document.getElementById('filter-maru').checked;
    const filtertenten = document.getElementById('filter-tenten').checked;

    // Applique les filtres par page et niveau
    return rows.filter(row => {
      const level = row[0]; // Colonne 1 : Niveau

      if (level === 'kanas' && filterkanas) return true;
      if (level === 'maru' && filtermaru) return true;
      if (level === 'tenten' && filtertenten) return true;

      return false;
    });
  } catch (error) {
    console.error('Erreur lors du chargement du fichier CSV :', error);
    return [];
  }
}

// Fonction pour afficher un Kanji aléatoire
async function displayRandomKanji() {
  const filteredRows = await getFilteredRows();

  if (filteredRows.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredRows.length);
    currentRow = filteredRows[randomIndex];

    document.getElementById('hiragana-container-1').textContent = currentRow[1]; // Niveau
    document.getElementById('hiragana-container-2').textContent = '-'; // Réinitialise réponse

    // Affiche la réponse après 4 secondes
    revealTimeout = setTimeout(() => {
      if (currentRow.length >= 3) {
        document.getElementById('hiragana-container-2').textContent = currentRow[2]; // Colonne 4
      }
    }, 4000);
  } else {
    alert('Aucune donnée ne correspond aux filtres sélectionnés.');
    resetContainers();
  }
}

// Réinitialise les conteneurs
function resetContainers() {
  document.getElementById('hiragana-container-1').textContent = '-';
  document.getElementById('hiragana-container-2').textContent = '-';
  currentRow = [];
}

// Mise à jour de togglePlay pour inclure la barre de progression

const PlayButton = document.getElementById('play-btn');

function togglePlay() {
  if (playInterval) {
    // Arrêter le mode Play et la barre de progression
    clearInterval(playInterval);
    playInterval = null;
    stopProgressBar();
    PlayButton.textContent = '► Play';
    PlayButton.classList.remove('active');

    document.getElementById('hiragana-container-2').textContent = currentRow[2]; // Colonne 4
  }
  else {
    // Démarrer le mode Play et la barre de progression
    displayRandomKanji();
    playInterval = setInterval(displayRandomKanji, progressDuration); // Répète toutes les 7 secondes
    startProgressBar();
    PlayButton.textContent = 'Pause';
    PlayButton.classList.add('active');
  }
}

document.getElementById('play-btn').addEventListener('click', togglePlay); // Gestion du bouton skip

// BoutonSkip

function toggleSkip() {
  clearInterval(playInterval);
  playInterval = null;
  stopProgressBar();
  clearTimeout(revealTimeout);
  PlayButton.textContent = 'Pause';

  document.getElementById('hiragana-container-2').textContent = '-';

  displayRandomKanji();
  playInterval = setInterval(displayRandomKanji, progressDuration); // Répète toutes les 7 secondes
  startProgressBar();
}

document.getElementById('skip-btn').addEventListener('click', toggleSkip); // Gestion du bouton skip

// bare de progression
const progressBar = document.getElementById('progressBar');
const progressDuration = 7000; // Durée totale de la barre en millisecondes

// Fonction pour démarrer la barre de progression
function startProgressBar() {
  let startTime = Date.now();

  progressInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const progressPercent = (elapsedTime / progressDuration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    if (elapsedTime >= 4000) {
      progressBar.classList.add('warning');
    } else {
      progressBar.classList.remove('warning');
    }

    if (elapsedTime >= progressDuration) {
      clearInterval(progressInterval);
      progressBar.style.width = '0%'; // Réinitialise la barre
      progressBar.classList.remove('warning'); // Réinitialise la couleur
      startProgressBar(); // Redémarre la barre pour le prochain cycle
    }
  }, 100); // Met à jour la barre toutes les 100ms
}

// Fonction pour arrêter la barre de progression
function stopProgressBar() {
  clearInterval(progressInterval);
  progressBar.style.width = '0%'; // Réinitialise la barre
}