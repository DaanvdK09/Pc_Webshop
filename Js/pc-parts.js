document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.querySelector('.add-button');
    const partsListDiv = document.getElementById('parts-list');
    const builderTitle = document.querySelector('.pc-builder-title h1');
    let selectedGpuDiv = null;
    let selectedGpu = null;

    function showGpuSelection() {
        fetch('http://localhost:5000/api/gpus')
            .then(response => response.json())
            .then(gpus => {
                // Build table header
                let tableHtml = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Core Clock</th>
                                <th>Boost Clock</th>
                                <th>Price</th> 
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                // Build table rows
                tableHtml += gpus.map((gpu, idx) => `
                    <tr data-idx="${idx}">
                        <td>
                            <img src="${gpu.image_url}" alt="${gpu.name}" class="img" style="width:60px;height:40px;object-fit:contain;background:#fff;border-radius:6px;vertical-align:middle;margin-right:10px;">
                            <span style="vertical-align:middle;">${gpu.name}</span>
                        </td>
                        <td>${gpu.core_clock} MHz</td>
                        <td>${gpu.boost_clock} MHz</td>
                        <td>€${gpu.price}</td>
                        <td><a class="select-btn" style="cursor:pointer;color:#00ad00;font-weight:bold;">Add</a></td>
                    </tr>
                `).join('');
                tableHtml += `
                        </tbody>
                    </table>
                `;
                partsListDiv.innerHTML = tableHtml;
                partsListDiv.style.display = "block";
                addBtn.style.display = "none";
                builderTitle.textContent = "Add a GPU";

                document.querySelectorAll('.select-btn').forEach((btn, idx) => {
                    btn.addEventListener('click', function() {
                        selectedGpu = gpus[idx];
                        if (!selectedGpuDiv) {
                            selectedGpuDiv = document.createElement('div');
                            selectedGpuDiv.id = 'selected';
                            addBtn.parentNode.insertBefore(selectedGpuDiv, addBtn.nextSibling);
                        }
                        // Render selected GPU as a table
                        selectedGpuDiv.innerHTML = `
                            <table class="table item selected">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Core Clock</th>
                                        <th>Boost Clock</th>
                                        <th>Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src="${selectedGpu.image_url}" alt="${selectedGpu.name}" class="img" style="width:60px;height:40px;object-fit:contain;background:#fff;border-radius:6px;vertical-align:middle;margin-right:10px;">
                                            <span style="vertical-align:middle;">${selectedGpu.name}</span>
                                        </td>
                                        <td>${selectedGpu.core_clock} MHz</td>
                                        <td>${selectedGpu.boost_clock} MHz</td>
                                        <td>€${selectedGpu.price}</td>
                                        <td>
                                            <a class="remove-selected-btn" style="cursor:pointer;color:#ad0000;font-weight:bold;">Remove</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        `;
                        // Add event listener for the remove button in the table
                        selectedGpuDiv.querySelector('.remove-selected-btn').addEventListener('click', function() {
                            selectedGpuDiv.remove();
                            selectedGpuDiv = null;
                            selectedGpu = null;
                            addBtn.style.display = "block"; // Show the add button again
                            addBtn.querySelector('a').textContent = "Add GPU";
                            addBtn.classList.remove('remove');
                        });
                        partsListDiv.style.display = "none";
                        addBtn.style.display = "none"; // Hide the add button when a GPU is selected
                        builderTitle.textContent = "PC Builder";
                    });
                });
            });
    }

    addBtn.addEventListener('click', function() {
        // If a GPU is selected, remove it
        if (selectedGpuDiv && selectedGpu) {
            selectedGpuDiv.remove();
            selectedGpuDiv = null;
            selectedGpu = null;
            addBtn.style.display = "block"; // Show the add button again
            addBtn.querySelector('a').textContent = "Add GPU";
            addBtn.classList.remove('remove');
            return;
        }
        // Otherwise, show GPU selection
        showGpuSelection();
    });
});