
function createQualitySelector(hls) {
  var qualitySelector = document.getElementById('quality-selector');

  // Popolare il selettore di qualità
  hls.levels.forEach((level, index) => {
    var option = document.createElement('option');
    option.value = index;
    option.text = `${level.height}p`;
    qualitySelector.appendChild(option);
  });

  // Cambiare livello di qualità quando l'utente seleziona una nuova opzione
  qualitySelector.addEventListener('change', function() {
    hls.currentLevel = this.value;
  });
}