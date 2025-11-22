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


const emailInput = document.getElementById("employee-email");
const phoneInput = document.getElementById("employee-phone");

// Error spans
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");


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


  const nameInput  = document.getElementById("employee-name");
  const roleSelect = document.getElementById("role");
  const emailInput = document.getElementById("employee-email");
  const phoneInput = document.getElementById("employee-phone");

  const name  = nameInput.value.trim();
  const role  = roleSelect.value;
  const roleLabel = roleSelect.options[roleSelect.selectedIndex].textContent; 
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();




  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

    
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

  const photo =
    previewImg && previewImg.style.display === "block"
      ? previewImg.src
      : "";


    const experiences = [];
  const expItems = experienceList.querySelectorAll(".experience-item");

  
  const dureeRegex = /^(\d{4})\s*-\s*(\d{4})$/;

  for (let item of expItems) {
    const inputs = item.querySelectorAll("input");
    if (!inputs.length) continue;

    const entreprise = inputs[0].value.trim();
    const poste      = inputs[1].value.trim();
    const duree      = inputs[2].value.trim();

   
    if (!entreprise && !poste && !duree) continue;

    
    if (duree) {
      const match = duree.match(dureeRegex);

     
      if (!match) {
        alert('Durée invalide. Exemple: 2020-2023');
        inputs[2].focus();
        return; 
      }

      const startYear = parseInt(match[1], 10);
      const endYear   = parseInt(match[2], 10);

      
      if (startYear >= endYear) {
        alert("L'année de début doit être inférieure à l'année de fin (ex: 2020-2023).");
        inputs[2].focus();
        return;
      }
    }

    
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

 
  employees.push(newEmployee);

  
  const li = createEmployeeCard(newEmployee);
  unassignedList.appendChild(li);

 
  updateUnassignedCount();
  
  form.reset();
  experienceList.innerHTML = "";
  previewImg.style.display = "none";
  previewText2.style.display = "block";

  // 8) nsedd l-modal
  modal.classList.remove("is-open");
});


function canAssign(employee, zone) {
  const role = employee.role;

  if (role === "manager") return true; 

  if (role === "nettoyage" && zone === "archives") return false;

  if (zone === "reception" && role !== "receptionniste") return false;

  if (zone === "serveurs" && role !== "technicien_it") return false;

  if (zone === "securite" && role !== "agent_securite") return false;

  return true; 
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


const zoneButtons = document.querySelectorAll(".zone-add");

zoneButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const zone = btn.dataset.zoneTarget; 
    openZoneSelection(zone);
  });
});

function openZoneSelection(zone) {

  const allowedEmployees = employees.filter(emp =>
    emp.location === "unassigned" && canAssign(emp, zone)
  );

  if (allowedEmployees.length === 0) {
    alert("Aucun employé autorisé pour cette zone.");
    return;
  }

  currentZone = zone;


  selectTitle.textContent = "Sélectionner un employé pour " + getZoneLabel(zone);

  
  selectList.innerHTML = "";

  
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

    
    li.addEventListener("click", () => {
      assignToZone(emp, currentZone);
      closeSelectModal();
    });

    selectList.appendChild(li);
  });


  selectModal.classList.add("is-open");
}

function updateZoneCount(zone) {
 
  const zoneCard = document.querySelector(`.zone-card[data-zone="${zone}"]`);
  if (!zoneCard) return;

  const max = parseInt(zoneCard.dataset.max, 10) || 0;

  
  const zoneList = document.querySelector(`[data-zone-list="${zone}"]`);
  const current = zoneList ? zoneList.children.length : 0;

  
  const counter = document.querySelector(`[data-zone-counter="${zone}"]`);
  if (counter) {
    counter.textContent = `${current}/${max}`;
  }
}


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


  
  employee.location = zone;

  
  const cardInList = document.querySelector(
    `.employee-delete[data-id="${employee.id}"]`
  );
  if (cardInList) {
    cardInList.parentElement.remove(); 
  }

 
  updateUnassignedCount();

  
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

   
  const mainDivZone = li.querySelector(".employee-main");
  if (mainDivZone) {
    mainDivZone.addEventListener("click", () => openProfile(employee));
  }

  zoneList.appendChild(li);
  updateZoneCount(zone); 


 const removeBtn = li.querySelector(".remove-from-zone");
removeBtn.addEventListener("click", (event) => {
  
  event.stopPropagation();   

  
  li.remove();


  employee.location = "unassigned";

 
  const unassignedCard = createEmployeeCard(employee);
  unassignedList.appendChild(unassignedCard);

  
  updateUnassignedCount();
});

}

function openProfile(employee) {

  profileNameEl.textContent = employee.name;
  profileRoleEl.textContent = employee.roleLabel;


  let locText = "Non assigné";
  if (employee.location && employee.location !== "unassigned") {
   
    locText = "Zone : " + employee.location;
  }
  profileLocationEl.textContent = locText;


  profileEmailEl.textContent = employee.email || "-";
  profilePhoneEl.textContent = employee.phone || "-";


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

