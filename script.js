// Get DOM elements
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const loadingIndicator = document.querySelector('#loadingIndicator');
const errorMessage = document.querySelector('#errorMessage');
const pokemonCard = document.querySelector('#pokemonCard');
const darkModeToggle = document.querySelector('#darkModeToggle');
const sunIcon = document.querySelector('#sunIcon');
const moonIcon = document.querySelector('#moonIcon');

// Dark mode functionality
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
}

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
});

// Add event listener to search button
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        fetchPokemon(searchTerm);
    }
});

// Add event listener for Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            fetchPokemon(searchTerm);
        }
    }
});

// Main function to fetch Pokemon data
async function fetchPokemon(nameOrId) {
    // Disable button and show loading
    searchButton.disabled = true;
    loadingIndicator.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    pokemonCard.classList.add('hidden');
    pokemonCard.classList.remove('opacity-100', 'scale-100');
    pokemonCard.classList.add('opacity-0', 'scale-95');

    try {
        // Fetch data from API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        
        // Handle 404 error
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Pokémon not found! Please check the name or ID and try again.');
            }
            throw new Error('Something went wrong. Please try again later.');
        }

        // Parse JSON response
        const data = await response.json();
        
        // Display the Pokemon data
        displayPokemon(data);

    } catch (error) {
        // Show error message
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Re-enable button and hide loading
        searchButton.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
}

// Function to display Pokemon data
function displayPokemon(pokemon) {
    // Capitalize the name
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    // Convert height to meters (API returns in decimeters)
    const heightInMeters = (pokemon.height / 10).toFixed(1);
    
    // Convert weight to kilograms (API returns in hectograms)
    const weightInKg = (pokemon.weight / 10).toFixed(1);
    
    // Create types list using map method
    const typesList = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        const typeElement = document.createElement('span');
        typeElement.textContent = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typeElement.className = 'bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold';
        return typeElement.outerHTML;
    }).join(' ');

    // Build the card HTML
    pokemonCard.innerHTML = `
        <div class="text-center">
            <!-- Pokemon Image -->
            <div class="mb-6">
                <img 
                    src="${pokemon.sprites.front_default}" 
                    alt="${capitalizedName}"
                    class="w-48 h-48 mx-auto transform hover:scale-110 transition-transform duration-300"
                >
            </div>

            <!-- Pokemon Name and ID -->
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">${capitalizedName}</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">#${pokemon.id.toString().padStart(3, '0')}</p>

            <!-- Pokemon Types -->
            <div class="mb-6 flex justify-center gap-2 flex-wrap">
                ${typesList}
            </div>

            <!-- Pokemon Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div class="bg-white dark:bg-gray-600 p-4 rounded-lg shadow">
                    <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold">Height</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${heightInMeters} m</p>
                </div>
                <div class="bg-white dark:bg-gray-600 p-4 rounded-lg shadow">
                    <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold">Weight</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${weightInKg} kg</p>
                </div>
                <div class="bg-white dark:bg-gray-600 p-4 rounded-lg shadow col-span-2 md:col-span-1">
                    <p class="text-gray-600 dark:text-gray-300 text-sm font-semibold">Base Experience</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${pokemon.base_experience}</p>
                </div>
            </div>

            <!-- Additional Sprites -->
            <div class="mt-6 flex justify-center gap-4 flex-wrap">
                ${pokemon.sprites.front_default ? `<img src="${pokemon.sprites.front_default}" alt="Front" class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-110 transition-transform">` : ''}
                ${pokemon.sprites.back_default ? `<img src="${pokemon.sprites.back_default}" alt="Back" class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-110 transition-transform">` : ''}
                ${pokemon.sprites.front_shiny ? `<img src="${pokemon.sprites.front_shiny}" alt="Shiny" class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg hover:scale-110 transition-transform">` : ''}
            </div>
        </div>
    `;

    // Show the card with animation
    pokemonCard.classList.remove('hidden');
    setTimeout(() => {
        pokemonCard.classList.remove('opacity-0', 'scale-95');
        pokemonCard.classList.add('opacity-100', 'scale-100');
    }, 10);
}

// Load default Pokemon (ditto) on page load
window.addEventListener('load', () => {
    fetchPokemon('ditto');
});
