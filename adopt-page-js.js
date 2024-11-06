const petGrid = document.getElementById('petGrid');
const filterForm = document.getElementById('filterForm');
const backToTopBtn = document.getElementById('backToTop');

// Sample PET_DATA for demonstration
const PET_DATA = [
    {
        id: 1,
        name: "Buddy",
        type: "dog",
        breed: "Golden Retriever",
        age: "2 years",
        gender: "Male",
        size: "Large",
        image: "https://example.com/images/golden-retriever.jpg",
        description: "Buddy is a friendly and playful Golden Retriever. He loves going for walks and playing fetch."
    },
    {
        id: 2,
        name: "Whiskers",
        type: "cat",
        breed: "Siamese",
        age: "1 year",
        gender: "Female",
        size: "Medium",
        image: "https://example.com/images/siamese-cat.jpg",
        description: "Whiskers is a curious and affectionate Siamese cat. She loves chasing toys and cuddling."
    },
    {
        id: 3,
        name: "Chirpy",
        type: "bird",
        breed: "Budgie",
        age: "6 months",
        gender: "Male",
        size: "Small",
        image: "https://example.com/images/budgie.jpg",
        description: "Chirpy is a talkative and playful Budgie. He loves singing and playing with toys."
    },
    // Add more pets here...
];

// Create a pet card element
function createPetCard(pet) {
    const card = document.createElement('div');
    card.classList.add('pet-card');
    card.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p>${pet.breed} - ${pet.age}</p>
        <p>${pet.description}</p>
        <button>Adopt Me</button>
    `;
    return card;
}

// Render pet cards based on the provided data
function renderPetCards(pets) {
    petGrid.innerHTML = ''; // Clear existing cards
    pets.forEach(pet => {
        const card = createPetCard(pet);
        petGrid.appendChild(card);
    });
}

// Filter pets based on selected species
function filterPets(event) {
    event.preventDefault();
    const selectedSpecies = document.getElementById('species').value;

    const filteredPets = PET_DATA.filter(pet => 
        selectedSpecies === '' || pet.type === selectedSpecies
    );

    renderPetCards(filteredPets);
}

// Show/hide "back to top" button
function toggleBackToTopButton() {
    backToTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
}

// Scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Utility functions for pet generation
const utils = {
    getRandomItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
    generateUniqueId: () => '_' + Math.random().toString(36).substr(2, 9)
};

// Pet generator class
class PetGenerator {
    static async generate() {
        const type = utils.getRandomItem(PET_DATA.map(pet => pet.type));
        const pet = {
            id: utils.generateUniqueId(),
            name: utils.getRandomItem(PET_DATA.map(pet => pet.name)),
            type: type,
            breed: utils.getRandomItem(PET_DATA.map(pet => pet.breed)),
            age: utils.getRandomItem(PET_DATA.map(pet => pet.age)),
            gender: utils.getRandomItem(PET_DATA.map(pet => pet.gender)),
            size: utils.getRandomItem(PET_DATA.map(pet => pet.size)),
            description: `Meet ${utils.getRandomItem(PET_DATA.map(pet => pet.name))}, a loving ${type} looking for a forever home!`
        };

        // Fetch image from Unsplash
        const imageUrl = await fetchImage(type);
        pet.image = imageUrl;

        return pet;
    }
}

// Fetch random images from Unsplash based on the type
async function fetchImage(query) {
    const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=HwRzU_URbl8chqH7vVNyfagv21v7i3zNvGa0aP_uovI`; // Your Unsplash API key
    const response = await fetch(url);
    if (!response.ok) {
        console.error('Error fetching image:', response.statusText);
        return 'https://via.placeholder.com/150'; // Fallback image
    }
    const data = await response.json();
    return data.urls.regular;
}

// Event listeners
filterForm.addEventListener('change', filterPets);
window.addEventListener('scroll', toggleBackToTopButton);
backToTopBtn.addEventListener('click', scrollToTop);

// Load new pets on page load
async function loadPets() {
    const pets = [];
    for (let i = 0; i < 30; i++) {
        const pet = await PetGenerator.generate();
        pets.push(pet);
    }
    renderPetCards(pets); // Render the 30 pets
}

// Call loadPets to fetch and display pets
loadPets();
