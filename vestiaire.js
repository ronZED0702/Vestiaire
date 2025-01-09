// Fichier: app.js

// Structure de données pour le vestiaire
const wardrobe = {
    haut: [],
    bas: [],
    chaussures: []
  };
  
  // Calcul de la distance entre deux couleurs
  function colorDistance(color1, color2) {
    const [r1, g1, b1] = color1.split(",").map(Number);
    const [r2, g2, b2] = color2.split(",").map(Number);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  }
  
  // Fonction pour analyser la couleur dominante d'une image
  function getDominantColor(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Évite les problèmes de CORS
      img.src = imageSrc;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = {};
        let maxCount = 0;
        let dominantColor = "";
  
        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const color = `${r},${g},${b}`;
          colors[color] = (colors[color] || 0) + 1;
  
          if (colors[color] > maxCount) {
            maxCount = colors[color];
            dominantColor = color;
          }
        }
        resolve(dominantColor);
      };
    });
  }
  
  // Ajouter un vêtement au vestiaire
  async function addClothing(imageBase64) {
    const dominantColor = await getDominantColor(imageBase64);
    const category = prompt("Entrez la catégorie (haut, bas, chaussures) :").toLowerCase();
  
    if (wardrobe[category]) {
      wardrobe[category].push({ image: imageBase64, color: dominantColor });
      alert(`Vêtement ajouté dans "${category}" avec couleur dominante : ${dominantColor}`);
    } else {
      alert("Catégorie invalide. Choisissez parmi : haut, bas, chaussures.");
    }
  }
  
  // Gérer l'ajout de vêtements via le formulaire
  document.getElementById("addClothingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const fileInput = document.getElementById("clothingImage");
  
    if (fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        const imageBase64 = reader.result;
        addClothing(imageBase64);
      };
      reader.readAsDataURL(fileInput.files[0]);
      this.reset();
    }
  });
  
  // Générer un outfit cohérent
  document.getElementById("generateOutfitBtn").addEventListener("click", () => {
    const outfitContainer = document.getElementById("outfitContainer");
    outfitContainer.innerHTML = "";
  
    if (wardrobe.haut.length === 0 || wardrobe.bas.length === 0 || wardrobe.chaussures.length === 0) {
      alert("Votre vestiaire ne contient pas assez d'éléments pour un outfit complet.");
      return;
    }
  
    const haut = wardrobe.haut[Math.floor(Math.random() * wardrobe.haut.length)];
    const bas = wardrobe.bas.find(item => colorDistance(item.color, haut.color) < 50) || wardrobe.bas[Math.floor(Math.random() * wardrobe.bas.length)];
    const chaussures = wardrobe.chaussures.find(item => colorDistance(item.color, haut.color) < 50) || wardrobe.chaussures[Math.floor(Math.random() * wardrobe.chaussures.length)];
  
    const outfit = { haut, bas, chaussures };
  
    // Afficher l'outfit
    for (const [category, item] of Object.entries(outfit)) {
      if (item) {
        const div = document.createElement("div");
        div.className = "outfit-item";
        div.innerHTML = `<img src="${item.image}" alt="${category}" class="styled-image">`;
        outfitContainer.appendChild(div);
      }
    }
    outfitContainer.classList.remove("hidden");
  });
  
  // Afficher les vêtements du vestiaire
  document.getElementById("viewWardrobeBtn").addEventListener("click", () => {
    const wardrobeContainer = document.getElementById("wardrobeContainer");
    wardrobeContainer.innerHTML = "";
  
    for (const [category, items] of Object.entries(wardrobe)) {
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "wardrobe-category";
      categoryDiv.innerHTML = `<h3>${category}</h3>`;
  
      items.forEach(item => {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = category;
        img.className = "styled-image";
        categoryDiv.appendChild(img);
      });
  
      wardrobeContainer.appendChild(categoryDiv);
    }
    wardrobeContainer.classList.remove("hidden");
  });
  