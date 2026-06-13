const CONFIG = {
  whatsapp: "33600000000", // Remplacer par le numéro WhatsApp de votre mère. Exemple : 33612345678
  email: "contact@mybijoux.fr" // Remplacer par son email
};

let produits = [];
let currentProduct = null;

const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const countText = document.getElementById("countText");

function imagePath(file) {
  return `images/${file}`;
}

async function loadProducts() {
  try {
    const response = await fetch("produits.json");
    produits = await response.json();
    renderProducts();
  } catch (error) {
    grid.innerHTML = `<p class="error">Impossible de charger produits.json. Vérifiez le fichier sur GitHub.</p>`;
  }
}

function getSelectedMatter() {
  return document.querySelector('input[name="matiere"]:checked')?.value || "Tous";
}

function renderProducts() {
  const search = searchInput.value.toLowerCase().trim();
  const matter = getSelectedMatter();

  const filtered = produits.filter(p => {
    const matchesSearch = `${p.nom} ${p.matiere} ${p.description}`.toLowerCase().includes(search);
    const matchesMatter = matter === "Tous" || p.matiere === matter;
    return matchesSearch && matchesMatter;
  });

  countText.textContent = `${filtered.length} produit(s) affiché(s)`;

  grid.innerHTML = filtered.map((p, index) => `
    <article class="card" onclick="openProduct(${produits.indexOf(p)})">
      <div class="card-img">
        <img src="${imagePath(p.image)}" alt="${p.nom}" onerror="this.src='images/produit1.svg'">
      </div>
      <div class="card-body">
        <span class="badge">${p.stock || "Disponible"}</span>
        <h3>${p.nom}</h3>
        <div class="matiere">${p.matiere}</div>
        <p class="desc">${p.description}</p>
        <div class="price">${p.prix}</div>
        <button class="quick" onclick="event.stopPropagation(); openProduct(${produits.indexOf(p)})">Voir le détail</button>
      </div>
    </article>
  `).join("");
}

function openProduct(index) {
  currentProduct = produits[index];
  document.getElementById("detailImage").src = imagePath(currentProduct.image);
  document.getElementById("detailName").textContent = currentProduct.nom;
  document.getElementById("detailMaterial").textContent = `Matière : ${currentProduct.matiere}`;
  document.getElementById("detailPrice").textContent = currentProduct.prix;
  document.getElementById("detailDescription").textContent = currentProduct.description;
  document.getElementById("detailStock").textContent = currentProduct.stock || "Disponible";

  const msg = encodeURIComponent(`Bonjour, je suis intéressée par le bijou : ${currentProduct.nom} (${currentProduct.prix}).`);
  document.getElementById("detailWhatsapp").href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  document.getElementById("detailEmail").href = `mailto:${CONFIG.email}?subject=Commande ${encodeURIComponent(currentProduct.nom)}&body=${msg}`;

  showReviews();
  document.getElementById("productModal").classList.remove("hidden");
}

function closeProduct() {
  document.getElementById("productModal").classList.add("hidden");
}

function reviewKey() {
  return `reviews_${currentProduct.nom}`;
}

function getReviews() {
  return JSON.parse(localStorage.getItem(reviewKey()) || "[]");
}

function showReviews() {
  const reviews = getReviews();
  const list = document.getElementById("reviewsList");
  if (!reviews.length) {
    list.innerHTML = `<div class="review-item">Aucun avis pour le moment. Soyez la première à laisser un avis ⭐</div>`;
    return;
  }
  list.innerHTML = reviews.map(r => `
    <div class="review-item">
      <strong>${r.name}</strong> — ${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}
      <p>${r.text}</p>
    </div>
  `).join("");
}

function addReview() {
  if (!currentProduct) return;
  const name = document.getElementById("reviewName").value.trim() || "Cliente";
  const rating = Number(document.getElementById("reviewRating").value);
  const text = document.getElementById("reviewText").value.trim();
  if (!text) return alert("Écrivez un petit avis avant de publier.");

  const reviews = getReviews();
  reviews.unshift({ name, rating, text });
  localStorage.setItem(reviewKey(), JSON.stringify(reviews));
  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";
  showReviews();
}

function setupContactLinks() {
  const message = encodeURIComponent("Bonjour, je souhaite avoir des informations sur vos bijoux de téléphone m’y bijoux.");
  ["whatsappTop", "whatsappSide", "whatsappBottom", "floatingWhatsapp"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = `https://wa.me/${CONFIG.whatsapp}?text=${message}`;
  });
  const email = document.getElementById("emailBottom");
  if (email) email.href = `mailto:${CONFIG.email}?subject=Demande d'information m’y bijoux`;
}

function goHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

searchInput.addEventListener("input", renderProducts);
document.querySelectorAll('input[name="matiere"]').forEach(input => input.addEventListener("change", renderProducts));
document.getElementById("productModal").addEventListener("click", e => {
  if (e.target.id === "productModal") closeProduct();
});

setupContactLinks();
loadProducts();
