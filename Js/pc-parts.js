document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.querySelector('.add-button');
    const partsListDiv = document.getElementById('parts-list');
    let selectedGpuDiv = null;

    addBtn.addEventListener('click', function() {
        // If already showing, hide
        if (partsListDiv.style.display === "block" && partsListDiv.innerHTML !== "") {
            partsListDiv.style.display = "none";
            return;
        }
        // Fetch and show GPU selection
        fetch('http://localhost:5000/api/gpus')
            .then(response => response.json())
            .then(gpus => {
                partsListDiv.innerHTML = `
                    <div class="pc-parts-list">
                        ${gpus.map((gpu, idx) => `
                            <div class="item" data-idx="${idx}">
                                <img src="${gpu.image_url}" alt="${gpu.name}" class="img">
                                <div class="info">
                                    <h3>${gpu.name}</h3>
                                    <p><strong>Price:</strong> €${gpu.price}</p>
                                    <p><strong>Core Clock:</strong> ${gpu.core_clock} MHz</p>
                                    <p><strong>Boost Clock:</strong> ${gpu.boost_clock} MHz</p>
                                    <a class="select-btn">Add</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                partsListDiv.style.display = "block";

                // Add event listeners to all "Add" links
                document.querySelectorAll('.select-btn').forEach((btn, idx) => {
                    btn.addEventListener('click', function() {
                        const gpu = gpus[idx];
                        // Show selected GPU below the main Add button
                        if (!selectedGpuDiv) {
                            selectedGpuDiv = document.createElement('div');
                            selectedGpuDiv.id = 'selected-gpu';
                            addBtn.parentNode.insertBefore(selectedGpuDiv, addBtn.nextSibling);
                        }
                        selectedGpuDiv.innerHTML = `
                            <div class="item selected">
                                <img src="${gpu.image_url}" alt="${gpu.name}" class="img">
                                <div class="info">
                                    <h3>${gpu.name}</h3>
                                    <p><strong>Price:</strong> €${gpu.price}</p>
                                    <p><strong>Core Clock:</strong> ${gpu.core_clock} MHz</p>
                                    <p><strong>Boost Clock:</strong> ${gpu.boost_clock} MHz</p>
                                </div>
                            </div>
                        `;
                        partsListDiv.style.display = "none";
                    });
                });
            });
    });
});