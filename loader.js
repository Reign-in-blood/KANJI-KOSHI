function loadHTML(containerId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de chargement : ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error(error));
}

// Charger le menu et le footer
loadHTML('menu', 'menu.html');
loadHTML('footer', 'footer.html');