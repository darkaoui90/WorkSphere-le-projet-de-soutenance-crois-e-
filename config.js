const modal = document.getElementById('employee-modal');
const openBtn = document.getElementById('btn-add'); 
const closeBtn = document.getElementById('close-modal');
const closeBtnform = document.querySelector('.btn-cancel');
let employees = [];
// form + liste dial "Personnel non assigné"
const form = document.getElementById('employee-form');
const unassignedList = document.getElementById('unassigned-list');
const unassignedCount = document.getElementById('unassigned-count'); 

// modal de sélection d'employé pour une zone
const selectModal = document.getElementById('select-employee-modal');
const selectList = document.getElementById('select-employee-list');
const selectTitle = document.getElementById('select-modal-title');
const selectCloseBtn = document.getElementById('select-modal-close');

let currentZone = null; // zone li ana katkhddem 3liha daba (conference, reception...)

function closeSelectModal() {
  selectModal.classList.remove('is-open');
  selectList.innerHTML = "";
  currentZone = null;
}

selectCloseBtn.addEventListener('click', closeSelectModal);

// ila klikiina 3la l'overlay (barra) nsddo modal
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
//form affiche l employee f liste

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1) njiib l-values men form
  const nameInput  = document.getElementById("employee-name");
  const roleSelect = document.getElementById("role");
  const emailInput = document.getElementById("employee-email");
  const phoneInput = document.getElementById("employee-phone");

  const name  = nameInput.value.trim();
  const role  = roleSelect.value; // ex: "receptionniste"
  const roleLabel = roleSelect.options[roleSelect.selectedIndex].textContent; // ex: "Réceptionniste"
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  // photo: ila previewImg mabana, ma ndir walo
  const photo =
    previewImg && previewImg.style.display === "block"
      ? previewImg.src
      : "";


  const experiences = [];
  const expItems = experienceList.querySelectorAll(".experience-item");
  expItems.forEach(item => {
    const inputs = item.querySelectorAll("input");
    if (!inputs.length) return;

    const entreprise = inputs[0].value.trim();
    const poste      = inputs[1].value.trim();
    const duree      = inputs[2].value.trim();

    if (entreprise || poste || duree) {
      experiences.push({ entreprise, poste, duree });
    }
  });


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

/* ============================================================
   1) RULES: واش employee يقدر يدخل ل zone ؟
   ============================================================ */
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

/* ============================================================
   2) LISTENERS 3LA "+ BUTTONS" DYAL ZONES
   ============================================================ */
const zoneButtons = document.querySelectorAll(".zone-add");

zoneButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const zone = btn.dataset.zoneTarget; 
    openZoneSelection(zone);
  });
});

/* ============================================================
   3) SELECTION D'UN EMPLOYÉ — VERSION SIMPLE (prompt)
   ============================================================ */
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


/*
   4) AJOUTER EMPLOYÉ À LA ZONE VISUELLEMENT
 */
function assignToZone(employee, zone) {
  const zoneList = document.querySelector(`[data-zone-list="${zone}"]`);
  if (!zoneList) return;

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

  zoneList.appendChild(li);

  // 5) bouton X bach nrdoh unassigned 3awd
  const removeBtn = li.querySelector(".remove-from-zone");
  removeBtn.addEventListener("click", () => {

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

