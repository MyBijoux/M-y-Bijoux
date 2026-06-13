SITE m’y bijoux - VERSION AMÉLIORÉE

À modifier directement depuis GitHub :

1. Ouvrir le fichier script.js
2. Modifier le numéro WhatsApp en haut :
   const whatsappNumber = '33600000000';
3. Modifier les produits dans le tableau products :
   name, material, desc, details, price, colors, badge, image, review, customer.
4. Pour ajouter une vraie photo produit :
   - Ajouter l'image dans le dossier du site
   - Mettre image:'nom-de-la-photo.jpg' dans le produit.

NOUVEAU :
- Quand une cliente clique sur un produit, une fiche produit détaillée s’ouvre.
- Dans cette fiche, elle peut écrire un avis directement.
- L’avis s’affiche dans son navigateur grâce au stockage local.
- Pour rendre un avis visible pour tout le monde, copier l’avis dans script.js dans les champs review/customer du produit, ou ajouter une base d’avis dans le code.

Fichiers du site :
- index.html
- style.css
- script.js
