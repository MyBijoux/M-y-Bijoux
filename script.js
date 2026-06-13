const whatsappNumber = '33600000000'; // Remplacez par le numéro WhatsApp, sans + ni espace. Exemple : 33612345678

/*
  MODIFICATION DIRECTE DEPUIS GITHUB
  ----------------------------------
  Pour modifier les produits : changez les lignes dans le tableau products ci-dessous.
  Pour ajouter une photo : mettez l'image dans le dossier du site puis ajoutez par exemple : image: 'mon-image.jpg'
  Si vous ne mettez pas d'image, le site affiche automatiquement un visuel en perles.

  Matières possibles pour les filtres :
  Céramique / Acrylique / Perles en verre / Peint à l’huile / Silicone
*/
const filters = ['Céramique', 'Acrylique', 'Perles en verre', 'Peint à l’huile', 'Silicone'];

const products = [
  { id: 1, name: 'm’y Nacré', material: 'Perles en verre', desc: 'Perles nacrées, rose poudré et finition élégante.', details: 'Un bijou de téléphone doux et chic, idéal pour apporter une touche féminine à une coque transparente ou rose. Fait main avec une finition soignée.', price: 14, colors: ['#fff7fb','#ffd5e7','#f7aeca','#d7ad5f'], badge:'Best-seller', image:'', review:'', customer:'' },
  { id: 2, name: 'Pink Love', material: 'Acrylique', desc: 'Un modèle tendre avec cœur et perles roses.', details: 'Un modèle romantique, parfait pour un cadeau ou pour une cliente qui aime les accessoires doux, visibles et girly.', price: 16, colors: ['#ff8cbd','#ffc4dc','#fff','#ff6aa8'], badge:'Coup de cœur', image:'', review:'', customer:'' },
  { id: 3, name: 'Prénom Chic', material: 'Céramique', desc: 'Personnalisable avec lettres, couleurs et charm.', details: 'La cliente peut demander un prénom, un mot court, une couleur précise ou un charm spécial selon le stock disponible.', price: 18, colors: ['#fff','#f6cf63','#ffd6e6','#171016'], badge:'Sur mesure', image:'', review:'', customer:'' },
  { id: 4, name: 'Summer Charm', material: 'Silicone', desc: 'Couleurs lumineuses, esprit été et bijoux joyeux.', details: 'Un bijou frais et coloré, agréable au quotidien, qui donne un style vacances au téléphone.', price: 15, colors: ['#8de4ff','#fff','#ffd166','#ffafcc'], badge:'Nouveau', image:'', review:'', customer:'' },
  { id: 5, name: 'Black & Gold', material: 'Peint à l’huile', desc: 'Noir, doré et blanc pour un rendu très élégant.', details: 'Un modèle plus habillé, idéal pour celles qui veulent un rendu chic, sobre et premium.', price: 17, colors: ['#111','#d6a94b','#fff','#2d1e25'], badge:'Chic', image:'', review:'', customer:'' },
  { id: 6, name: 'Baby Blue', material: 'Perles en verre', desc: 'Bleu doux, discret et parfait pour un cadeau.', details: 'Un bijou délicat avec des tons bleus apaisants, facile à porter avec toutes les coques claires.', price: 15, colors: ['#bde0fe','#a2d2ff','#fff','#cdb4db'], badge:'Doux', image:'', review:'', customer:'' },
  { id: 7, name: 'Candy Pop', material: 'Acrylique', desc: 'Un mix coloré et tendance qui donne le sourire.', details: 'Un modèle fun, lumineux et moderne, pensé pour les personnes qui aiment les accessoires qui se remarquent.', price: 16, colors: ['#ffadad','#ffd6a5','#caffbf','#9bf6ff'], badge:'Coloré', image:'', review:'', customer:'' },
  { id: 8, name: 'Mini m’y', material: 'Silicone', desc: 'Modèle fin, léger, avec petit charm au choix.', details: 'Un format léger et discret, parfait pour une première commande ou pour un usage quotidien.', price: 12, colors: ['#fff','#ffcad4','#b8c0ff','#ffc8dd'], badge:'Petit prix', image:'', review:'', customer:'' }
];

let cart = JSON.parse(localStorage.getItem('mybijouxCart') || '[]');
let activeFilter = 'Céramique';

const productsEl = document.getElementById('products');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const productModal = document.getElementById('productModal');
const detailVisual = document.getElementById('detailVisual');
const detailContent = document.getElementById('detailContent');
const detailThumbs = document.getElementById('detailThumbs');
const detailSpecs = document.getElementById('detailSpecs');
const detailReviews = document.getElementById('detailReviews');
const recommendGrid = document.getElementById('recommendGrid');

function money(value){ return `${value} €`; }

function escapeHtml(value){
  return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
}

function getProductReviews(productId){
  const product = products.find(item => item.id === productId);
  const saved = JSON.parse(localStorage.getItem(`mybijouxReviews_${productId}`) || '[]');
  const base = (product && product.review && product.customer) ? [{ stars: 5, name: product.customer, text: product.review, date: 'Avis vérifié' }] : [];
  return base.concat(saved);
}

function getAverage(productId){
  const reviews = getProductReviews(productId);
  if(!reviews.length) return '0,0';
  const avg = reviews.reduce((sum, review) => sum + Number(review.stars || 5), 0) / reviews.length;
  return avg.toFixed(1).replace('.', ',');
}

function starsText(count){
  return '★★★★★'.slice(0, count) + '☆☆☆☆☆'.slice(0, 5 - count);
}


function productVisual(p){
  if(p.image){
    return `<img class="product-photo" src="${p.image}" alt="${p.name}">`;
  }
  return `
    <div class="beads" aria-hidden="true">${p.colors.map(c => `<i style="--c:${c}"></i>`).join('')}</div>
    <div class="mini-chain" aria-hidden="true">${p.colors.concat(p.colors.slice(0,2)).map(c => `<b style="--c:${c}"></b>`).join('')}</div>
  `;
}

function renderFilters(){
  const filtersEl = document.querySelector('.filters');
  if(!filtersEl) return;
  filtersEl.innerHTML = filters.map(f => `<button class="filter ${f === activeFilter ? 'active' : ''}" data-filter="${f}">${f}</button>`).join('');
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    });
  });
}

function renderProducts(){
  const visibleProducts = products.filter(p => p.material === activeFilter);
  productsEl.innerHTML = visibleProducts.length ? visibleProducts.map(p => `
    <article class="product reveal" onclick="openProduct(${p.id})" role="button" tabindex="0">
      <div class="product-img">
        <span class="badge">${p.badge}</span>
        ${productVisual(p)}
      </div>
      <div class="product-body">
        <p class="product-tag">${p.material}</p>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-review">
          ${getProductReviews(p.id).length ? `
            <div class="stars">${starsText(5)} <em>${getAverage(p.id)}/5</em></div>
            <span>“${getProductReviews(p.id)[0].text}”</span>
            <strong>— ${getProductReviews(p.id)[0].name}</strong>
          ` : `
            <div class="stars muted-stars">☆☆☆☆☆ <em>Aucun avis</em></div>
            <span>Soyez la première à laisser un avis</span>
          `}
        </div>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">Ajouter</button></div>
      </div>
    </article>
  `).join('') : `<p class="empty-products">Aucun modèle dans cette matière pour le moment. Ajoutez-en facilement dans <strong>script.js</strong>.</p>`;
  observeReveal();
}


function openProduct(id){
  const p = products.find(item => item.id === id);
  if(!p) return;
  const suggested = products.filter(item => item.id !== id).slice(0, 6);
  const gallery = [p.image, '', '', ''].filter((_, index) => index < 4);

  detailThumbs.innerHTML = gallery.map((img, index) => `
    <button class="thumb ${index === 0 ? 'active' : ''}" onclick="setMainVisual(${p.id}, ${index})" aria-label="Voir image ${index + 1}">
      ${index === 0 && p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span>${index === 0 ? '♡' : index === 1 ? 'Zoom' : index === 2 ? 'Détail' : 'Porté'}</span>`}
    </button>
  `).join('');

  detailVisual.innerHTML = `
    <span class="badge detail-badge">${p.badge}</span>
    ${productVisual(p)}
    <div class="stock-strip">Il n’en reste plus que quelques-uns</div>
  `;

  detailContent.innerHTML = `
    <p class="product-tag">${p.material}</p>
    <h2>${p.name}</h2>
    <div class="amazon-rating"><strong>${getAverage(p.id)}</strong><span>${getProductReviews(p.id).length ? '★★★★★' : '☆☆☆☆☆'}</span><a href="#detailReviews">Écrire un avis</a></div>
    <div class="variant-pill">Matière : <strong>${p.material}</strong></div>
    <div class="detail-price-row"><span class="detail-price">${money(p.price)}</span><small>Prix estimé, modifiable dans script.js</small></div>
    <p class="detail-desc">${p.details || p.desc}</p>
    <label class="qty-select">Quantité
      <select id="detailQty">
        <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
      </select>
    </label>
    <button class="amazon-add" onclick="addProductQuantity(${p.id})">Ajouter au panier</button>
    <button class="amazon-buy" onclick="buyNow(${p.id})">Commander sur WhatsApp</button>
    <div class="delivery-box">
      <strong>Commande simple</strong>
      <span>Message WhatsApp préparé automatiquement.</span>
      <span>Fait main avec amour par m’y bijoux.</span>
    </div>
  `;

  detailSpecs.innerHTML = `
    <h3>Détails sur le produit</h3>
    <ul class="spec-list">
      <li><strong>Matière :</strong> ${p.material}</li>
      <li><strong>Fabrication :</strong> fait main</li>
      <li><strong>Style :</strong> bijou de téléphone / dragonne décorative</li>
      <li><strong>Personnalisation :</strong> couleurs, prénom, charms selon disponibilité</li>
      <li><strong>Modification GitHub :</strong> nom, prix, photo et description dans <code>script.js</code></li>
    </ul>
  `;

  renderDetailReviews(p.id);

  recommendGrid.innerHTML = suggested.map(item => `
    <article class="recommend-card" onclick="openProduct(${item.id})">
      <div>${productVisual(item)}</div>
      <strong>${item.name}</strong>
      <span>${item.material}</span>
      <b>${money(item.price)}</b>
      <button onclick="event.stopPropagation(); addToCart(${item.id})">+</button>
    </article>
  `).join('');

  productModal.classList.add('open');
  overlay.classList.add('open');
  document.body.classList.add('locked');
}

function setMainVisual(id, index){
  const p = products.find(item => item.id === id);
  if(!p) return;
  document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
  detailVisual.innerHTML = `
    <span class="badge detail-badge">${index === 0 ? p.badge : 'Aperçu'}</span>
    ${productVisual(p)}
    <div class="stock-strip">${index === 0 ? 'Il n’en reste plus que quelques-uns' : 'Aperçu du modèle'}</div>
  `;
}

function addProductQuantity(id){
  const qty = Number(document.getElementById('detailQty')?.value || 1);
  for(let i = 0; i < qty; i++){ addToCart(id); }
}

function buyNow(id){
  const p = products.find(item => item.id === id);
  const qty = Number(document.getElementById('detailQty')?.value || 1);
  if(!p) return;
  const text = `Bonjour m’y bijoux, je voudrais commander : ${p.name} / matière : ${p.material} x${qty}. Total estimé : ${p.price * qty} €. Pouvez-vous me confirmer la disponibilité ?`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}


function renderDetailReviews(productId){
  const reviews = getProductReviews(productId);
  detailReviews.innerHTML = `
    <div class="reviews-header">
      <div>
        <h3>${reviews.length ? 'Commentaires clientes' : 'Soyez la première à laisser un avis ⭐'}</h3>
        <div class="review-line"><span>${reviews.length ? '★★★★★' : '☆☆☆☆☆'}</span><strong>${reviews.length ? getAverage(productId) + ' sur 5' : 'Aucun avis'}</strong><small>${reviews.length} avis</small></div>
      </div>
      <button class="write-review-btn" onclick="document.getElementById('reviewName').focus()">Mettre un avis</button>
    </div>
    <form class="review-form" onsubmit="submitReview(event, ${productId})">
      <strong>Votre avis sur ce bijou</strong>
      <div class="review-fields">
        <label>Votre prénom<input id="reviewName" type="text" placeholder="Ex : Clara" required></label>
        <label>Note
          <select id="reviewStars">
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
        </label>
      </div>
      <label>Votre commentaire<textarea id="reviewText" placeholder="Ex : Très joli bijou, livraison rapide, les couleurs sont magnifiques." required></textarea></label>
      <button type="submit">Publier mon avis</button>
      <small>L’avis s’affiche directement sur le site dans votre navigateur. Pour l’ajouter définitivement pour tout le monde, copiez-le ensuite dans GitHub/script.js.</small>
    </form>
    <div class="reviews-list">
      ${reviews.length ? reviews.map(review => `
        <article class="customer-review">
          <div><span>${starsText(Number(review.stars || 5))}</span><small>${escapeHtml(review.date || 'Avis cliente')}</small></div>
          <p>“${escapeHtml(review.text)}”</p>
          <b>— ${escapeHtml(review.name)}</b>
        </article>
      `).join('') : `<p class="no-review">Aucun avis pour le moment. Votre cliente peut écrire le premier avis avec le formulaire ci-dessus.</p>`}
    </div>
  `;
}

function submitReview(event, productId){
  event.preventDefault();
  const name = document.getElementById('reviewName').value.trim();
  const text = document.getElementById('reviewText').value.trim();
  const stars = Number(document.getElementById('reviewStars').value || 5);
  if(!name || !text) return;
  const key = `mybijouxReviews_${productId}`;
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  const review = { name, text, stars, date: new Date().toLocaleDateString('fr-FR') };
  saved.unshift(review);
  localStorage.setItem(key, JSON.stringify(saved));
  renderDetailReviews(productId);
  renderProducts();
}

function closeProductModal(){
  productModal.classList.remove('open');
  if(!cartPanel.classList.contains('open')){
    overlay.classList.remove('open');
    document.body.classList.remove('locked');
  }
}

function addToCart(id){
  const item = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);
  if(existing){ existing.qty += 1; } else { cart.push({...item, qty:1}); }
  updateCart();
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(p => p.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(p => p.id !== id);
  updateCart();
}

function updateCart(){
  localStorage.setItem('mybijouxCart', JSON.stringify(cart));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
  document.getElementById('cartItems').innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>Matière : ${item.material}</small><small>${money(item.price)} × ${item.qty}</small></div>
      <div class="qty"><button onclick="changeQty(${item.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${item.id},1)">+</button></div>
    </div>
  `).join('') : '<p class="empty">Votre panier est vide pour le moment.</p>';
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = money(total);
}

function openCart(){ cartPanel.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('locked'); }
function closeCart(){ cartPanel.classList.remove('open'); if(!productModal.classList.contains('open')){ overlay.classList.remove('open'); document.body.classList.remove('locked'); } }

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', () => { closeCart(); closeProductModal(); });
document.getElementById('closeProduct').addEventListener('click', closeProductModal);
document.addEventListener('keydown', (event) => { if(event.key === 'Escape'){ closeCart(); closeProductModal(); } });
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('nav').classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.getElementById('nav').classList.remove('open')));

function sendWhatsApp(event){
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  const text = `Bonjour m’y bijoux, je m'appelle ${name}. ${message}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

function orderCart(){
  if(!cart.length){ alert('Votre panier est vide.'); return; }
  const details = cart.map(item => `- ${item.name} / matière : ${item.material} x${item.qty} : ${item.price * item.qty} €`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const text = `Bonjour m’y bijoux, je voudrais commander :\n${details}\nTotal estimé : ${total} €\n\nPouvez-vous me confirmer la disponibilité ?`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
}

function observeReveal(){
  const items = document.querySelectorAll('.reveal:not(.visible)');
  if(!('IntersectionObserver' in window)){ items.forEach(el => el.classList.add('visible')); return; }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold:.12});
  items.forEach(el => observer.observe(el));
}

renderFilters();
renderProducts();
updateCart();
observeReveal();
