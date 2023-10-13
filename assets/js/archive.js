/**
 * Function: initializeArchivePage
 * Description: Initializes the archive page with filtering and pagination functionality.
 * 
 * This function sets up filtering and pagination functionality for an archive page that displays items.
 * It allows users to filter items by various criteria and paginate through the results.
 */
function initializeArchivePage() {

    // Define data
    var dataURL = baseURL + "data/data_" + defaultContentLanguage + ".json.gz";

    // Variable to store the number of initially displayed items
    const initialItemCount = 10;

    // Variable to store the current page number
    let currentPage = 1;

    // DOM elements for various components of the web page
    const dataContainer = document.querySelector('#data-container');
    const yearSelect = document.querySelector('#year');
    const monthSelect = document.querySelector('#month');
    const itemTypeSelect = document.querySelector('#item-type');
    const searchInput = document.querySelector('#search');
    const sdgSelect = document.querySelector('#sdg');
    const readMoreButton = document.querySelector('#read-more-button');
    const showAllButton = document.querySelector('#show-all-button');

    // Variables to store data and control page state
    let jsonMenu;
    let jsonBib;
    let jsonCollections;
    let jsonItems;
    let filteredData;

    // Define an object to map parameter names to DOM elements
    const parameterMap = {
        "search": searchInput,
        "sdg": sdgSelect, 
        "year": yearSelect,
        "month": monthSelect,
        "type": itemTypeSelect
    };

    // Function to show all items (clear filters)
    function showAllItems(data) {
        // Reapply the filters
        applyFilter();

        // Render all items
        renderData(filteredData);

        updateItemCount(filteredData.length);
    }

    // Get the show all button element by its id
    showAllButton.addEventListener('click', function () {
        showAllItems(jsonItems);
    });

    async function renderData(data, startIndex = 0, count = data.length) {
    
        // clear content in dataContainer
        dataContainer.innerHTML = "";

        // Determine the range of items to render based on startIndex and count
        const endIndex = startIndex + count;
        const itemsToRender = data.slice(startIndex, endIndex);

        // Display the loader before fetching content for all items
        const loader = showLoader(dataContainer);
    
        // Create an array of promises for each item
        const promises = itemsToRender.map(async item => {
       
            // Find button items
            const { collections, key, cristinId, abstract, contributors, sdg } = item;
        
            // Create the container div with the class .csl-bib-body
            const bibBody = document.createElement('div');
            bibBody.className = 'csl-bib-container';
            
            // Parse the HTML string from jsonBib.bibBody and create a temporary div element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = jsonBib.bibBody;
        
            // Get the first 'div' element within the temporary div (e.g., bib.bibBody)
            const bibContainer = tempDiv.querySelector('div:first-child');
            bibContainer.innerHTML = item.html;
        
            // Append bibContainer to bibBody
            bibBody.appendChild(bibContainer);

            // Create the container div with the class .csl-bib-buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'csl-bib-buttons';
  
             // Create the container div with the class .csl-bib-meta
             const metaContainer = document.createElement('div');
             metaContainer.className = 'csl-bib-meta';
             metaContainer.id = `csl-bib-meta-${key}`;

            // Create Archive button
            if (collections) {
                const archiveButton = createButton({ 
                    type: "span", 
                    className: "csl-bib-button show-meta",
                    attribute: {
                        "data-key": key,
                        "data-target": `taxonomy-article-${key}`,
                        "data-i18n": "archive_text"
                    },
                });
                buttonsContainer.appendChild(archiveButton);
            }

            // Create Zotero button
            if (key) {
                const zoteroButton = createButton({ 
                    type: "a", 
                    className: "csl-bib-button",
                    attribute: {
                        href: `${jsonMenu.zoteroURL}${key}`
                    },
                    text: "Zotero" 
                });
                buttonsContainer.appendChild(zoteroButton);
            }

            // Create Cristin button
            if (cristinId) {
                const cristinButton = createButton({ 
                    type: "a", 
                    className: "csl-bib-button",
                    attribute: {
                        href: `${jsonMenu.cristinURL}${cristinId}`
                    },
                    text: "Cristin" 
                });
                buttonsContainer.appendChild(cristinButton);
            }

            // Create abstract button
            if (abstract) {
                const abstractButton = createButton({ 
                    type: "span", 
                    className: "csl-bib-button show-meta",
                    attribute: {
                        "data-key": key,
                        "data-target": `abstract-article-${key}`,
                        "data-i18n": "abstract_text"
                    }
                });
                buttonsContainer.appendChild(abstractButton);
            }

            // Create contributors button
            if (contributors) {
                const contributorsButton = createButton({ 
                    type: "span", 
                    className: "csl-bib-button show-meta",
                    attribute: {
                        "data-key": key,
                        "data-target": `contributors-article-${key}`,
                        "data-i18n": "contributors_text"
                    }
                });
                buttonsContainer.appendChild(contributorsButton);
            }

            // Create sdg button
            if (sdg) {
                const sdgButton = createButton({ 
                    type: "span", 
                    id: `sdg-${key}`,
                    className: "csl-bib-button show-meta",
                    attribute: {
                        "data-key": key,
                        "data-target": `sdg-article-${key}`,
                        "data-i18n": "sdg"
                    }
                });
                buttonsContainer.appendChild(sdgButton);
            }
            
            const urlButton = createButton({ 
                type: "a",
                className: "las la-link go-to-pub",
                attribute: {
                    "href": baseURL + `${defaultContentLanguage}/pub/${key}`,
                    "title": item.title
                }
            });
            buttonsContainer.appendChild(urlButton);

            // Append the buttons container and meta container to bibBody
            bibBody.appendChild(buttonsContainer);
            bibBody.appendChild(metaContainer);

            // Append bibBody to dataContainer
            dataContainer.appendChild(bibBody);
        });
    
        try {
            // Wait for all promises to complete
            await Promise.all(promises);
        } catch (error) {
            // Handle errors here, for example:
            console.error('Error rendering data:', error);
        } finally {
            initializeTranslationUpdater(defaultContentLanguage);
            // Remove the loader when all content has been fetched (whether success or error)
            hideLoader(loader, dataContainer);         
        }
    }
  
    // Add an event listener to a common ancestor of all .show-meta buttons
    document.body.addEventListener('click', event => {
        // Check if the clicked element has the class .show-meta
        const clickedButton = event.target;
        if (clickedButton.classList.contains('show-meta')) {
            const key = clickedButton.getAttribute('data-key');
            const target = clickedButton.getAttribute('data-target');
            const container = `csl-bib-meta-${key}`;
    
            // Remove active class from all other .show-meta buttons with the same data-key attribute
            const allShowMetaButtons = document.querySelectorAll(`.show-meta[data-key="${key}"]`);
            allShowMetaButtons.forEach(button => {
                if (button !== clickedButton) {
                    button.classList.remove('active');
                }
            });
            
            // Toggle active class on the clicked button
            clickedButton.classList.toggle('active');
    
            // Call the toggleMeta function
            toggleMeta(key, target, container);
        }
    });
 
    function toggleMeta(key, targetId, containerId) {
        const containerDiv = document.getElementById(containerId);
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
            targetDiv.remove();
        } else {
            containerDiv.innerHTML = "";
            const targetPageURL = baseURL + `${defaultContentLanguage}/pub/${key}`;
            includePage(targetPageURL, `#${targetId}`, containerDiv, 0, true);
        }
    }

    // Declare a function to get the value of the last selected .collections element
    function getLastSelectedCollection() {
        const collectionsSelects = document.querySelectorAll('.collections');
        const lastSelected = Array.from(collectionsSelects).find(select => select.value);
        return lastSelected ? lastSelected.value : ''; // Return the value of the last selected element, or an empty string if none is selected
    }

    // Toggle filter-box
    const filterButton = document.getElementById('filter-button');
    const filterDiv = document.getElementById('filters');
    filterButton.addEventListener('click', () => {
        filterDiv.classList.toggle('show');
    });


    // Get the reset button element by its id
    // Event listener for the reset button
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', resetFilters);

    // Function to reset all filters
    function resetFilters() {
        searchInput.value = '';
        yearSelect.value = '';
        monthSelect.value = '';
        itemTypeSelect.value = '';
        sdgSelect.value = '';
        
        // Reset all .collections selects
        const collectionsSelects = document.querySelectorAll('.collections');
        collectionsSelects.forEach(select => {
            select.value = '';
        });

        // Your existing code for applying filters
        applyFilter();
    }

    // Function to apply filters based on user input
    function applyFilter() {
        const search = searchInput.value.toLowerCase();
        const selectedYear = yearSelect.value;
        const selectedMonth = monthSelect.value;
        const selectedType = itemTypeSelect.value;
        const selectedCollection = getLastSelectedCollection();
        const selectedSDG = sdgSelect.value;
    
        // Filter the data based on user input
        filteredData = jsonItems.filter(item => {
            // Concatenate the values of properties to search
            const searchString = (
                    item.html + item.key + item.abstract + item.creators
                ).toLowerCase();
            
            return (
                (!search || searchString.includes(search.toLowerCase())) &&
                (!selectedYear || item.year === parseInt(selectedYear)) &&
                (!selectedMonth || item.month == selectedMonth) &&
                (!selectedType || item.type === selectedType) &&
                (!selectedCollection || item.collections?.includes(selectedCollection)) &&
                (!selectedSDG || (item.sdg?.includes(selectedSDG) && item.sdg.includes(selectedSDG)))
            );
        });

        // Reset the current page to 1
        currentPage = 1;
        loadMoreItems();
    }

    // Function to update and display the item count
    function updateItemCount(nItems) {
     
        // hide read more if n >= all
        if (nItems >= filteredData.length) {
            readMoreButton.classList.add('hidden');
            showAllButton.classList.add('hidden');
        } else {
            readMoreButton.classList.remove('hidden');
            showAllButton.classList.remove('hidden');
        }

        insertTranslation('.current-items', "publication", nItems, defaultContentLanguage, true);
        insertTranslation('.total-items', "publication", filteredData.length, defaultContentLanguage);
    }


    // Function to load and render more items
    function loadMoreItems() {
        const startIndex = (currentPage - 1) * initialItemCount;
        // Use Math.min to avoid exceeding the array length
        const endIndex = Math.min(startIndex + initialItemCount, filteredData.length); 
    
        renderData(filteredData, 0, endIndex);

        currentPage++; // Increment the page number

        updateItemCount(endIndex);
    }

    // Event listener for the "Load More" button
    readMoreButton.addEventListener('click', loadMoreItems);

    // Add an event listener to the "Copy filter" button
    const copyButton = document.querySelector('#copy-button');
    copyButton.addEventListener('click', copyFiltersToURL);

    // Function to copy filter criteria to the URL
    function copyFiltersToURL() {
        // Create an object to represent the filter criteria
        const filters = {
            search: searchInput.value,
            year: yearSelect.value,
            month: monthSelect.value,
            type: itemTypeSelect.value,
            collection: getLastSelectedCollection(),
            sdg: sdgSelect.value,
        };

        // Remove empty filter criteria from the object
        for (const key in filters) {
            if (filters[key] === '') {
            delete filters[key];
            }
        }

        // Serialize the filter object into a query string
        const queryString = Object.keys(filters)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
            .join('&');

        // Update the URL with the query string
        const currentURL = new URL(window.location.href);
        const newURL = `${currentURL.origin}${currentURL.pathname}${queryString ? `?${queryString}` : ''}`;
        showPopup(newURL, 'copiedToClipboard', false);
    }

    // Function to set values of DOM elements based on URL parameters
    function setValuesFromURL(parameterMap) {
        // Parse the URL to extract query parameters
        const urlSearchParams = new URLSearchParams(window.location.search);

        // Check if there is a "collection" parameter in the URL
        const collectionParam = urlSearchParams.get("collection");

        if (collectionParam !== null) {
            // Find all .collections select elements
            const collectionsSelects = document.querySelectorAll('.collections');

            // Iterate through the .collections select elements
            collectionsSelects.forEach(select => {
                // Check if the select's options include the "collection" parameter value
                const optionExists = Array.from(select.options).some(option => option.value === collectionParam);

                if (optionExists) {
                    // Set the value of the matching .collections select element
                    select.value = collectionParam;
                }
            });
        }

        // Iterate through the parameter names in the object
        for (const paramName in parameterMap) {
            if (paramName !== "collection") {
                const domElement = parameterMap[paramName];
                const paramValue = urlSearchParams.get(paramName);

                // Handle other parameters as before
                if (paramValue !== null && domElement !== undefined && domElement.tagName === "SELECT") {
                    // Handle <select> elements
                    const optionExists = Array.from(domElement.options).some(option => option.value === paramValue);
                    if (optionExists) {
                        domElement.value = paramValue;
                    } else {
                        domElement.value = "";
                    }
                } else if (domElement !== undefined && domElement.tagName === "INPUT") {
                    // Handle <input> elements
                    domElement.value = paramValue || "";
                }
            }
        }
    }

    // Function to initialize data and populate page content
    function initData() {
        fetch(dataURL)
            .then(response => response.arrayBuffer()) // Get response as array buffer
            .then(buffer => pako.inflate(new Uint8Array(buffer), { to: 'string' })) // Inflate gzipped response
            .then(data => {
                // Parse the JSON data
                const jsonData = JSON.parse(data);
                jsonMenu = jsonData.menu;
                jsonBib = jsonData.html;
                jsonItems = jsonData.items;
                jsonCollections = jsonData.collections;
                const startYear = jsonMenu.startYear;
                const endYear = jsonMenu.endYear;
                const types = jsonMenu.type;

                // Assuming you have a container div for the selects in your HTML
                const collectionsContainer = document.querySelector('#collections-container');

                // Assuming you have loaded the data.json content into a variable named 'jsonData'
                const nCollections = jsonMenu.nCollections;

                // Loop through the number of collections to create and populate each select
                for (let i = 1; i <= nCollections; i++) {
                    // Create a select element for each level
                    const select = document.createElement('select');
                    select.id = `collections${i}`;
                    select.name = `collections${i}`;
                    select.className = 'collections'; // Add the class "collections"

                    // Add an "All Collections" option to each select
                    const allOption = document.createElement('option');
                    allOption.value = '';
                    allOption.textContent = 'All Collections';
                    allOption.setAttribute('data-i18n', `collection-level${i}`); // Add data-i18n attribute
                    select.appendChild(allOption);

                    // Populate the select based on the level
                    jsonCollections.forEach(collection => {
                        if (collection.level === i) {
                            const option = document.createElement('option');
                            option.value = collection.key;
                            option.textContent = collection.name;
                            select.appendChild(option);
                        }
                    });

                    // Append the select to the collections container
                    collectionsContainer.appendChild(select);
                }

                // Get the item-type select element
                const itemTypeSelect = document.querySelector('#item-type');

                // Populate the item-type select element with options
                itemTypeSelect.innerHTML = `
                    <option value="" data-i18n="type_all">All Types</option>
                    ${types.map(type => `<option value="${type}" data-i18n="type_${type}">type_${type}</option>`).join('')}
                `;

                yearSelect.innerHTML = '<option value="" data-i18n="allYears">All Years</option>';
                for (let year = startYear; year <= endYear; year++) {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                }

                // Event listeners for filter elements
                const filterElements = [yearSelect, monthSelect, itemTypeSelect, searchInput, sdgSelect];

                filterElements.forEach(element => {
                    element.addEventListener('input', applyFilter);
                });
                            
                // Event listener for changes in .collections select elements
                const collectionsSelects = document.querySelectorAll('.collections');

                // Event listener for changes in .collections select elements
                collectionsSelects.forEach(select => {
                    select.addEventListener('change', function () {
                        const selectedValue = this.value; // Get the value of the select that triggered the change
                        // Loop through all .collections selects and reset their values except for the one that triggered the change
                        collectionsSelects.forEach(otherSelect => {
                            if (otherSelect !== this) {
                                otherSelect.value = ''; // Reset the value to blank
                            }
                        });
                        applyFilter(); // Apply filters after changing values
                    });
                });


                // Call the function to set values of DOM elements based on URL parameters
                setValuesFromURL(parameterMap);

                applyFilter();
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error);
            });
    }

    initData();
}
