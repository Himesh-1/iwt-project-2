//--------------------------------------------------NAVBAR--------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Navbar items
    const navItems = [
        { name: "Home", link: "index.html" },
        { name: "Explore", link: "explore.html" },
        { name: "Adopt", link: "#adopt" },
        { name: "Pet Care", link: "#pet-care" },
        { name: "Pet Supplies", link: "#pet-supplies" },
        { name: "Contact Us", link: "contact.html" }
    ];

    // Navbar container
    const navbarContainer = document.getElementById("navbar-container");

    // Navbar HTML structure
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");

    // Logo
    const logo = document.createElement("div");
    logo.classList.add("logo");

    const logoImage = document.createElement("img");
    logoImage.src = "images/nav-logo.png"; // Provide the correct path to your logo image here
    logoImage.alt = "PetInfo Logo"; // Alternative text for the image
    logoImage.style.width = "130px"; // Set the desired width for your logo
    logoImage.style.height = "auto"; // Maintain aspect ratio
    logoImage.style.marginLeft="10px";

    logo.appendChild(logoImage);
    navbar.appendChild(logo);


    // Navigation links
    const navList = document.createElement("ul");

    navItems.forEach((item) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = item.name;
        link.href = item.link;
        listItem.appendChild(link);
        navList.appendChild(listItem);
    });

    navbar.appendChild(navList);

    // Mobile menu toggle
    const menuToggle = document.createElement("div");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = `
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    `;
    navbar.appendChild(menuToggle);

    // Append navbar to container
    navbarContainer.appendChild(navbar);

    // Toggle menu and animate burger icon
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Change background when scrolled down 50px
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

//------------------------------------------CONTACT---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Collect the form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        // Simple validation or additional logic can be added here

        // Show a confirmation message (can be replaced with an actual email sending function)
        alert(`Thank you, ${name}! Your message has been sent.`);
        
        // Optionally reset the form
        contactForm.reset();
    });
});


//--------------------------------------------EXPLORE--------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const animalSelect = document.getElementById("animal-select");
    const animalList = document.getElementById("animal-list");

    if (searchBar && animalSelect && animalList) {
        searchBar.addEventListener("input", debounce(() => {
            const query = searchBar.value.trim();
            if (query) {
                fetchAnimalData(query);
            } else {
                animalList.innerHTML = '';
            }
        }, 300));

        animalSelect.addEventListener("change", () => {
            const selectedAnimal = animalSelect.value;
            if (selectedAnimal) {
                fetchAnimalData(selectedAnimal);
            }
        });

        function fetchAnimalData(animalName) {
            animalList.innerHTML = '<p>Loading...</p>';
            fetch('https://api.api-ninjas.com/v1/animals?name=' + encodeURIComponent(animalName), {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'AofgH7d/JEk85h6PrFmTjg==dUzgM8ozBwGsBVXS',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayAnimals(data);
            })
            .catch(error => {
                console.error('Error: ', error);
                animalList.innerHTML = '<p>An error occurred. Please try again later.</p>';
            });
        }

        function displayAnimals(animals) {
            animalList.innerHTML = '';
        
            if (animals.length === 0) {
                animalList.innerHTML = '<p>No animals found. Try another search.</p>';
                return;
            }
        
            animals.forEach(animal => {
                const animalCard = document.createElement('div');
                animalCard.classList.add('animal-card');
        
                fetchUnsplashImage(animal.name)
                    .then(imageUrl => {
                        const characteristicsList = Object.entries(animal.characteristics)
                            .map(([key, value]) => `<p><strong>${capitalizeFirstLetter(key)}:</strong> ${value || 'Not available'}</p>`)
                            .join('');
                
                        const taxonomyList = Object.entries(animal.taxonomy)
                            .map(([key, value]) => `<p><strong>${capitalizeFirstLetter(key)}:</strong> ${value || 'Not available'}</p>`)
                            .join('');
                
                        animalCard.innerHTML = `
                            <div class="card-content">
                                <img src="${imageUrl}" alt="${animal.name}" onerror="this.src='https://via.placeholder.com/250x150?text=Image+Not+Available'">
                                <div class="animal-info">
                                    <h3>${animal.name}</h3>
                                    <h4>Taxonomy:</h4>
                                    ${taxonomyList}
                                    <button class="show-more-btn">Show More</button>
                                </div>
                            </div>
                            <div class="extra-info">
                                <h4>Characteristics:</h4>
                                ${characteristicsList}
                            </div>
                        `;
                
                        const showMoreBtn = animalCard.querySelector('.show-more-btn');
                        const extraInfo = animalCard.querySelector('.extra-info');
                        const cardContent = animalCard.querySelector('.card-content');

                        showMoreBtn.addEventListener('click', () => {
                            const isExpanded = animalCard.classList.contains('expanded');
                
                            // Close any other expanded cards
                            document.querySelectorAll('.animal-card.expanded').forEach(card => {
                                if (card !== animalCard) {
                                    card.classList.remove('expanded');
                                    card.querySelector('.show-more-btn').textContent = 'Show More';
                                }
                            });
                
                            if (isExpanded) {
                                animalCard.classList.remove('expanded');
                                showMoreBtn.textContent = 'Show More';
                            } else {
                                animalCard.classList.add('expanded');
                                showMoreBtn.textContent = 'Show Less';
                            }
                        });
                
                        animalList.appendChild(animalCard);
                    })
                    .catch(error => {
                        console.error('Error fetching image:', error);
                    });
            });
        }

        // Function to fetch images from Unsplash API
        async function fetchUnsplashImage(query) {
            const UNSPLASH_ACCESS_KEY = 'HwRzU_URbl8chqH7vVNyfagv21v7i3zNvGa0aP_uovI'; // Replace with your Unsplash Access Key
            try {
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`);
                if (!response.ok) {
                    throw new Error('Unsplash API response was not ok');
                }
                const data = await response.json();
                if (data.results.length > 0) {
                    return data.results[0].urls.small;
                } else {
                    return 'https://via.placeholder.com/250x150?text=Image+Not+Available'; // Fallback if no image found
                }
            } catch (error) {
                console.error('Error fetching image from Unsplash', error);
                return 'https://via.placeholder.com/250x150?text=Error+Loading+Image'; // Fallback on error
            }
        }
        
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
    }
});
