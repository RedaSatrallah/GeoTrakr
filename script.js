const inputType = document.getElementById("type");

const cadenceInput = document.getElementById("cadence");
const cadenceLabel = document.getElementById("cadenceLabel");

const deniveleInput = document.getElementById("denivele");
const deniveleLabel = document.getElementById("deniveleLabel");

function changeFields() {
  if (inputType.value === "course") {
    // Show cadence
    cadenceInput.classList.remove("hidden");
    cadenceLabel.classList.remove("hidden");
    // Hide elevation
    deniveleInput.classList.add("hidden");
    deniveleLabel.classList.add("hidden");
  } 
  else if (inputType.value === "velo") {
    // Show elevation
    deniveleInput.classList.remove("hidden");
    deniveleLabel.classList.remove("hidden");
    // Hide cadence
    cadenceInput.classList.add("hidden");
    cadenceLabel.classList.add("hidden");
  }
  else {
    // Hide all
    cadenceInput.classList.add("hidden");
    cadenceLabel.classList.add("hidden");
    deniveleInput.classList.add("hidden");
    deniveleLabel.classList.add("hidden");
  }
}
// Initialize state on page load
changeFields();
// Listen for changes
inputType.addEventListener("change", changeFields);




// -----------------------------
// Select DOM elements
// -----------------------------
const form = document.getElementById("form");
const historique = document.getElementById("historique");

const typeInput = document.getElementById("type");
const dureeInput = document.getElementById("duree");

// -----------------------------
// Handle form submission
// -----------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = typeInput.value;
  const duree = dureeInput.value;
  const cadence = cadenceInput.value;
  const denivele = deniveleInput.value;

  // Basic validation
  if (!type || duree <= 0) {
    alert("Veuillez remplir correctement le formulaire.");
    return;
  }

  const activite = {
    type,
    duree,
    cadence,
    denivele,
    date: new Date().toLocaleDateString()
  };

  ajouterActivite(activite);

  // Reset form
  form.reset();
});

function ajouterActivite(activite) {
  const li = document.createElement("li");

  if (activite.type === "course") {
    li.innerHTML = `
      🏃 <strong>Course</strong><br>
      Durée : ${activite.duree} min<br>
      Cadence : ${activite.cadence} SPM<br>
      <small>${activite.date}</small>
    `;
  }

  if (activite.type === "velo") {
    li.innerHTML = `
      🚴 <strong>Vélo</strong><br>
      Durée : ${activite.duree} min<br>
      Dénivelé : ${activite.denivele} m<br>
      <small>${activite.date}</small>
    `;
  }

  // Add newest activity at the top
  historique.prepend(li);
}