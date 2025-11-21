const modal = document.getElementById('employee-modal');
const openBtn = document.getElementById('btn-add'); 
const closeBtn = document.getElementById('close-modal');
const closeBtnform = document.querySelector('.btn-cancel');
let employees = [];
// form + liste dial "Personnel non assigne"
const form = document.getElementById('employee-form');
const unassignedList = document.getElementById('unassigned-list');
const unassignedCount = document.getElementById('unassigned-count'); 

// modal d selection demploye pour une zone
const selectModal = document.getElementById('select-employee-modal');
const selectList = document.getElementById('select-employee-list');
const selectTitle = document.getElementById('select-modal-title');
const selectCloseBtn = document.getElementById('select-modal-close');


let currentZone = null; // zone li ana kankhddem 3liha daba (conference, reception...)


// modal profile employe
const profileModal = document.getElementById("profile-modal");
const closeProfileBtn = document.getElementById("close-profile");

const profilePhoto      = document.getElementById("profile-photo");
const profilePhotoPh    = document.getElementById("profile-photo-placeholder");
const profileNameEl     = document.getElementById("profile-name");
const profileRoleEl     = document.getElementById("profile-role");
const profileLocationEl = document.getElementById("profile-location");
const profileEmailEl    = document.getElementById("profile-email");
const profilePhoneEl    = document.getElementById("profile-phone");
const profileExpList    = document.getElementById("profile-experiences")

function closeSelectModal() {
  selectModal.classList.remove('is-open');
  selectList.innerHTML = "";
  currentZone = null;
}

selectCloseBtn.addEventListener('click', closeSelectModal);

//tsad lform ila klikit 3la overlay 
selectModal.addEventListener('click', (e) => {
  if (e.target === selectModal) {
    closeSelectModal();
  }
});


openBtn.addEventListener('click' , () => {
    modal.classList.add('is-open');
});

closeBtn.addEventListener('click' , () => {
    modal.classList.remove('is-open');
});

closeBtnform.addEventListener('click' , () => {
    modal.classList.remove('is-open');
});

// photo preview

const photoFileInput = document.getElementById("employee-photo-file");
const previewImg = document.getElementById("photo-preview");
const previewText2 = document.getElementById("preview-text");

photoFileInput.addEventListener("change", () => {
  const file = photoFileInput.files[0];

  if (!file) {
    previewImg.style.display = "none";
    previewText2.style.display = "block";
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    previewImg.src = e.target.result; 
    previewImg.style.display = "block";
    previewText2.style.display = "none";
  };

  reader.readAsDataURL(file);
});

//add experience fields
const experienceList = document.getElementById("experience-list");
const addExpBtn = document.getElementById("add-experience");

function updateUnassignedCount() {
  if (!unassignedCount) return;

  // n7seb ghir li location dyalhom "unassigned"
  const unassignedEmployees = employees.filter(emp => emp.location === "unassigned");
  unassignedCount.textContent = unassignedEmployees.length;
}


function createEmployeeCard(employee) {
  const li = document.createElement("li");
  li.classList.add("employee-item");

  li.innerHTML = `
    <div class="employee-main">
      <div class="employee-avatar">
        ${
          employee.photo
            ? `<img src="${employee.photo}" alt="${employee.name}">`
            : `<div class="avatar-placeholder">${(employee.name && employee.name[0] ? employee.name[0] : "?")}</div>`
        }
      </div>
      <div class="employee-info">
        <p class="employee-name">${employee.name}</p>
        <p class="employee-role">${employee.roleLabel}</p>
      </div>
    </div>
    <button class="employee-delete" type="button" data-id="${employee.id}">X</button>
  `;


    const mainDiv = li.querySelector(".employee-main");
  if (mainDiv) {
    mainDiv.addEventListener("click", () => openProfile(employee));
  }

  const deleteBtn = li.querySelector(".employee-delete");
  deleteBtn.addEventListener("click", () => {
    li.remove();
    employees = employees.filter((emp) => emp.id !== employee.id);
    updateUnassignedCount();
  });

  return li;
}

function canAddNewExperience() {
  const items = experienceList.querySelectorAll(".experience-item");
  if (items.length === 0) return true; 
  const lastItem = items[items.length - 1];
  const inputs = lastItem.querySelectorAll("input");

  
  for (let input of inputs) {
    if (input.value.trim() === "") {
      return false; 
    }
  }
  return true;
}


addExpBtn.addEventListener("click", () => {
  
  if (!canAddNewExperience()) {
    alert("Remplis d'abord la dernière expérience avant d'en ajouter une nouvelle.");
    return;
  }
  const expDiv = document.createElement("div");
  expDiv.classList.add("experience-item");

  expDiv.innerHTML = `
    <input type="text" placeholder="Entreprise">
    <input type="text" placeholder="Poste">
    <input type="text" placeholder="Durée (ex: 2020-2022)">
    <button type="button" class="remove-exp-btn">X</button>
  `;

  experienceList.appendChild(expDiv);


  const removeBtn = expDiv.querySelector(".remove-exp-btn");
  removeBtn.addEventListener("click", () => expDiv.remove());
});

//code regex
// VALIDATION EN TEMPS RÉEL 

// Inputs
const emailInput = document.getElementById("employee-email");
const phoneInput = document.getElementById("employee-phone");

// Error spans
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");

// Regex li bssaatiiin
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

// Email live check
emailInput.addEventListener("input", () => {
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = "Email invalide.";
  } else {
    emailError.textContent = "";
  }
});

// Phone live check
phoneInput.addEventListener("input", () => {
  if (!phoneRegex.test(phoneInput.value)) {
    phoneError.textContent = "Numéro invalide (10 chiffres).";
  } else {
    phoneError.textContent = "";
  }
});

//form affiche l employee f liste

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1) njiib l-values men form
  const nameInput  = document.getElementById("employee-name");
  const roleSelect = document.getElementById("role");
  const emailInput = document.getElementById("employee-email");
  const phoneInput = document.getElementById("employee-phone");

  const name  = nameInput.value.trim();
  const role  = roleSelect.value;
  const roleLabel = roleSelect.options[roleSelect.selectedIndex].textContent; 
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();



 //  SIMPLE REGEX CHECK
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

    // FINAL REGEX CHECK
  if (!emailRegex.test(email)) {
    emailError.textContent = "Email invalide.";
    emailInput.focus();
    return;
  }

  if (!phoneRegex.test(phone)) {
    phoneError.textContent = "Numéro invalide (10 chiffres).";
    phoneInput.focus();
    return;
  }

  // photo: ila previewImg mabana, ma ndir walo
  const photo =
    previewImg && previewImg.style.display === "block"
      ? previewImg.src
      : "";


    const experiences = [];
  const expItems = experienceList.querySelectorAll(".experience-item");

  // regex: kay9bel format b7al "2020-2023"
  const dureeRegex = /^(\d{4})\s*-\s*(\d{4})$/;

  for (let item of expItems) {
    const inputs = item.querySelectorAll("input");
    if (!inputs.length) continue;

    const entreprise = inputs[0].value.trim();
    const poste      = inputs[1].value.trim();
    const duree      = inputs[2].value.trim();

    // ila ma3marnach walo, nskipiw had ligne
    if (!entreprise && !poste && !duree) continue;

    // ila 3mro champ dyal duree, ndir contrôle
    if (duree) {
      const match = duree.match(dureeRegex);

      // format khaté2
      if (!match) {
        alert('Durée invalide. Exemple: 2020-2023');
        inputs[2].focus();
        return; // nwa9af submit kamel
      }

      const startYear = parseInt(match[1], 10);
      const endYear   = parseInt(match[2], 10);

      // début khaso ykoun sghar mn fin
      if (startYear >= endYear) {
        alert("L'année de début doit être inférieure à l'année de fin (ex: 2020-2023).");
        inputs[2].focus();
        return;
      }
    }

    //  l'expérience l-array
    experiences.push({ entreprise, poste, duree });
  }



  const newEmployee = {
    id: Date.now(),
    name,
    role,
    roleLabel,
    email,
    phone,
    photo,
    experiences,
    location: "unassigned"
  };

  // 4) nzidoh l-array
  employees.push(newEmployee);

  // 5) nsaybo carte jdida f "Personnel non assigne"
  const li = createEmployeeCard(newEmployee);
  unassignedList.appendChild(li);

  // 6) nupdate l-compteur
  updateUnassignedCount();
  // 7) nresetti form + preview + experiences
  form.reset();
  experienceList.innerHTML = "";
  previewImg.style.display = "none";
  previewText2.style.display = "block";

  // 8) nsedd l-modal
  modal.classList.remove("is-open");
});

/* 
   1) RULES: واش employee يقدر يدخل ل zone */
function canAssign(employee, zone) {
  const role = employee.role;

  if (role === "manager") return true; // manager partout

  if (role === "nettoyage" && zone === "archives") return false;

  if (zone === "reception" && role !== "receptionniste") return false;

  if (zone === "serveurs" && role !== "technicien_it") return false;

  if (zone === "securite" && role !== "agent_securite") return false;

  return true; // باقي الزونات مفتوحين
}

function getZoneLabel(zoneKey) {
  switch (zoneKey) {
    case "conference": return "Salle de conférence";
    case "reception":  return "Réception";
    case "serveurs":   return "Salle des serveurs";
    case "securite":   return "Salle de sécurité";
    case "personnel":  return "Salle du personnel";
    case "archives":   return "Salle d'archives";
    default:           return zoneKey;
  }
}

/* 
   2) LISTENERS 3LA "+ BUTTONS" DYAL ZONES
    */
const zoneButtons = document.querySelectorAll(".zone-add");

zoneButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const zone = btn.dataset.zoneTarget; 
    openZoneSelection(zone);
  });
});

/* 
   3) SELECTION D'UN EMPLOYÉ — VERSION SIMPLE (prompt)
 */
function openZoneSelection(zone) {

  const allowedEmployees = employees.filter(emp =>
    emp.location === "unassigned" && canAssign(emp, zone)
  );

  if (allowedEmployees.length === 0) {
    alert("Aucun employé autorisé pour cette zone.");
    return;
  }

  currentZone = zone;

  // titre dial lmodal
  selectTitle.textContent = "Sélectionner un employé pour " + getZoneLabel(zone);

  // nfargho la liste
  selectList.innerHTML = "";

  // nsaybo karta sghira pour chaque employé
  allowedEmployees.forEach(emp => {
    const li = document.createElement("li");
    li.classList.add("select-employee-item");

    li.innerHTML = `
      <div class="employee-avatar small">
        ${
          emp.photo
            ? `<img src="${emp.photo}" alt="${emp.name}">`
            : `<div class="avatar-placeholder">${emp.name[0]}</div>`
        }
      </div>
      <div class="employee-info">
        <p class="employee-name">${emp.name}</p>
        <p class="employee-role">${emp.roleLabel}</p>
      </div>
    `;

    // ila klikiina 3la had l'élément → n3aynoh fl-zone
    li.addEventListener("click", () => {
      assignToZone(emp, currentZone);
      closeSelectModal();
    });

    selectList.appendChild(li);
  });

  // n7ell lmodal
  selectModal.classList.add("is-open");
}

function updateZoneCount(zone) {
  // n9lb 3la card dyal had zone
  const zoneCard = document.querySelector(`.zone-card[data-zone="${zone}"]`);
  if (!zoneCard) return;

  const max = parseInt(zoneCard.dataset.max, 10) || 0;

  // liste d'employés f had zone
  const zoneList = document.querySelector(`[data-zone-list="${zone}"]`);
  const current = zoneList ? zoneList.children.length : 0;

  // span dyal counter
  const counter = document.querySelector(`[data-zone-counter="${zone}"]`);
  if (counter) {
    counter.textContent = `${current}/${max}`;
  }
}

/*
   4) AJOUTER EMPLOYÉ À LA ZONE VISUELLEMENT
 */
function assignToZone(employee, zone) {
    
  const zoneCard = document.querySelector(`.zone-card[data-zone="${zone}"]`);
  const zoneList = document.querySelector(`[data-zone-list="${zone}"]`);
  if (!zoneCard || !zoneList) return;

  const max = parseInt(zoneCard.dataset.max, 10) || 0;
  const current = zoneList.children.length;

  if (current >= max) {
    alert(`Cette zone est pleine (${current}/${max}).`);
    return;
  }


  // 1) had l-employé ma b9ach unassigned
  employee.location = zone;

  // 2) n7aydoh men liste "Personnel non assigné" ila kayn
  const cardInList = document.querySelector(
    `.employee-delete[data-id="${employee.id}"]`
  );
  if (cardInList) {
    cardInList.parentElement.remove(); // li = parent dyal button
  }

  // 3) nupdate l-compteur
  updateUnassignedCount();

  // 4) nsaybo l-karta dyal zone
  const li = document.createElement("li");
  li.classList.add("employee-item");

  li.innerHTML = `
    <div class="employee-main">
      <div class="employee-avatar">
        ${
          employee.photo
            ? `<img src="${employee.photo}" alt="${employee.name}">`
            : `<div class="avatar-placeholder">${employee.name[0]}</div>`
        }
      </div>

      <div class="employee-info">
        <p class="employee-name">${employee.name}</p>
        <p class="employee-role">${employee.roleLabel}</p>
      </div>

      <button class="remove-from-zone" data-id="${employee.id}">X</button>
    </div>
  `;

   // click 3la carte f zone => ouvrir profil
  const mainDivZone = li.querySelector(".employee-main");
  if (mainDivZone) {
    mainDivZone.addEventListener("click", () => openProfile(employee));
  }

  zoneList.appendChild(li);
  updateZoneCount(zone); 

  // 5) bouton X bach nrdoh unassigned 3awd
 const removeBtn = li.querySelector(".remove-from-zone");
removeBtn.addEventListener("click", (event) => {
  
  event.stopPropagation();   

  // n7iydoh men zone
  li.remove();

  // nbdlo location
  employee.location = "unassigned";

  // nrj3o carte jdida fl liste lissar
  const unassignedCard = createEmployeeCard(employee);
  unassignedList.appendChild(unassignedCard);

  // nupdate compteur
  updateUnassignedCount();
});

}

function openProfile(employee) {
  // nom + rôle
  profileNameEl.textContent = employee.name;
  profileRoleEl.textContent = employee.roleLabel;

  // location
  let locText = "Non assigné";
  if (employee.location && employee.location !== "unassigned") {
    // ila 3andek getZoneLabel deja, t9dar t3ayet 3liha
    locText = "Zone : " + employee.location;
  }
  profileLocationEl.textContent = locText;

  // email / phone
  profileEmailEl.textContent = employee.email || "-";
  profilePhoneEl.textContent = employee.phone || "-";

  // photo
  if (employee.photo) {
    profilePhoto.src = employee.photo;
    profilePhoto.style.display = "block";
    profilePhotoPh.style.display = "none";
    profilePhotoPh.textContent = "";
  } else {
    profilePhoto.style.display = "none";
    profilePhotoPh.style.display = "flex";
    profilePhotoPh.textContent = employee.name ? employee.name[0] : "?";
  }

  // expériences
  profileExpList.innerHTML = "";
  if (employee.experiences && employee.experiences.length > 0) {
    employee.experiences.forEach(exp => {
      const li = document.createElement("li");
      li.textContent =
        (exp.entreprise || "") +
        (exp.poste ? " - " + exp.poste : "") +
        (exp.duree ? " (" + exp.duree + ")" : "");
      profileExpList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Aucune expérience renseignée.";
    profileExpList.appendChild(li);
  }

  profileModal.classList.add("is-open");
}

closeProfileBtn.addEventListener("click", () => {
  profileModal.classList.remove("is-open");
});

// fermer si on clique sur l'overlay
profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    profileModal.classList.remove("is-open");
  }
});

// initialiser tous les compteurs au chargement
document.querySelectorAll(".zone-card").forEach(card => {
  const z = card.dataset.zone;
  updateZoneCounter(z);
});

