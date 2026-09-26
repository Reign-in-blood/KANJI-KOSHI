let currentRow = []; // Stocke temporairement la ligne actuelle du CSV
let playInterval = null; // Pour gérer l'intervalle en mode Play
let revealTimeout = null; // Pour gérer le délai de révélation

// Initialise le menu déroulant pour sélectionner les pages
function initializePageSelector() {
  const pageSelector = document.getElementById('page-selector');
  for (let i = 1; i <= 9; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Page ${i}`;
    pageSelector.appendChild(option);
  }
}
initializePageSelector();

// Fonction pour charger le fichier CSV et appliquer les filtres
async function getFilteredRows() {
  try {
    const response = await fetch('kanjis.csv');
    const data = await response.text();

    // Divise les lignes du CSV et filtre celles contenant au moins 6 colonnes
    const rows = data.split('\n')
      .map(row => row.split(',').map(cell => cell.trim()))
      .filter(row => row.length >= 6);

    // Récupère les filtres
    const selectedPage = parseInt(document.getElementById('page-selector').value, 10);
    const filterN4 = document.getElementById('filter-n4').checked;
    const filterN5 = document.getElementById('filter-n5').checked;

    // Applique les filtres par page et niveau
    return rows.filter(row => {
      const page = parseInt(row[0].replace('page ', ''), 10); // Colonne 1 : Page
      const level = row[1]; // Colonne 2 : Niveau

      if (page > selectedPage) return false;
      if (level === 'N4' && filterN4) return true;
      if (level === 'N5' && filterN5) return true;

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

    document.getElementById('kanji-container-1').textContent = currentRow[1]; // Niveau
    document.getElementById('kanji-container-2').textContent = currentRow[2]; // Kanji
    document.getElementById('kanji-container-3').textContent = '-'; // Réinitialise réponse
    document.getElementById('kanji-container-4').textContent = '-'; // Réinitialise réponse
    document.getElementById('kanji-container-5').textContent = '-'; // Réinitialise réponse

    // Affiche la réponse après 4 secondes
    revealTimeout = setTimeout(() => {
      if (currentRow.length >= 6) {
        document.getElementById('kanji-container-3').textContent = currentRow[3]; // Colonne 4
        document.getElementById('kanji-container-4').textContent = currentRow[4]; // Colonne 5
        document.getElementById('kanji-container-5').textContent = currentRow[5]; // Colonne 6
      }
    }, 4000);
  } else {
    alert('Aucune donnée ne correspond aux filtres sélectionnés.');
    resetContainers();
  }
}

// Réinitialise les conteneurs
function resetContainers() {
  document.getElementById('kanji-container-1').textContent = '-';
  document.getElementById('kanji-container-2').textContent = '-';
  document.getElementById('kanji-container-3').textContent = '-';
  document.getElementById('kanji-container-4').textContent = '-';
  document.getElementById('kanji-container-5').textContent = '-';
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

    document.getElementById('kanji-container-3').textContent = currentRow[3]; // Colonne 4
    document.getElementById('kanji-container-4').textContent = currentRow[4]; // Colonne 5
    document.getElementById('kanji-container-5').textContent = currentRow[5]; // Colonne 6
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

  document.getElementById('kanji-container-3').textContent = '-';
  document.getElementById('kanji-container-4').textContent = '-';
  document.getElementById('kanji-container-5').textContent = '-';

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