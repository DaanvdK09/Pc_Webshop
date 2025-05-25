document.addEventListener('DOMContentLoaded', function() {
    const partsListDiv = document.getElementById('parts-list');
    const builderTitle = document.querySelector('.pc-builder-title h1');
    let selectedGpuDiv = null;
    let selectedGpu = null;
    let selectedCpu = null; // NEW: Track selected CPU

    // Create and insert the selected table container always
    selectedGpuDiv = document.createElement('div');
    selectedGpuDiv.id = 'selected';
    const pcBuilderContent = document.querySelector('.pc-builder-content');
    pcBuilderContent.insertBefore(selectedGpuDiv, partsListDiv);

    function renderSelectedTable() {
        selectedGpuDiv.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>CPU</td>
                        <td>
                            ${
                                selectedCpu
                                ? `<img src="${selectedCpu.image_url}" alt="${selectedCpu.name}" class="img">
                                   <span>${selectedCpu.name}</span>`
                                : `<div class="add-button" id="add-cpu-btn">
                                       <a><i class="fa-solid fa-plus"></i>Add CPU</a>
                                   </div>`
                            }
                        </td>
                        <td class="${selectedCpu ? '' : 'none-selected'}">
                            ${selectedCpu ? `€${selectedCpu.price}` : '-'}
                        </td>
                        <td class="${selectedCpu ? '' : 'none-selected'}">
                            ${
                                selectedCpu
                                ? `<a class="remove-selected-cpu-btn">Remove</a>`
                                : 'No CPU selected'
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>GPU</td>
                        <td>
                            ${
                                selectedGpu
                                ? `<img src="${selectedGpu.image_url}" alt="${selectedGpu.name}" class="img">
                                   <span>${selectedGpu.name}</span>`
                                : `<div class="add-button" id="add-gpu-btn">
                                       <a><i class="fa-solid fa-plus"></i>Add GPU</a>
                                   </div>`
                            }
                        </td>
                        <td class="${selectedGpu ? '' : 'none-selected'}">
                            ${selectedGpu ? `€${selectedGpu.price}` : '-'}
                        </td>
                        <td class="${selectedGpu ? '' : 'none-selected'}">
                            ${
                                selectedGpu
                                ? `<a class="remove-selected-btn">Remove</a>`
                                : 'No GPU selected'
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        // Remove handlers
        if (selectedGpu) {
            selectedGpuDiv.querySelector('.remove-selected-btn').addEventListener('click', function() {
                selectedGpu = null;
                renderSelectedTable();
            });
        }
        if (selectedCpu) {
            selectedGpuDiv.querySelector('.remove-selected-cpu-btn').addEventListener('click', function() {
                selectedCpu = null;
                renderSelectedTable();
            });
        }
        // Add handlers
        if (!selectedGpu) {
            const addGpuBtn = document.getElementById('add-gpu-btn');
            if (addGpuBtn) {
                addGpuBtn.addEventListener('click', function() {
                    showGpuSelection();
                });
            }
        }
        if (!selectedCpu) {
            const addCpuBtn = document.getElementById('add-cpu-btn');
            if (addCpuBtn) {
                addCpuBtn.addEventListener('click', function() {
                    showCpuSelection();
                });
            }
        }
    }

    function showGpuSelection() {
        selectedGpuDiv.style.display = "none";
        fetch('http://localhost:5000/api/gpus')
            .then(response => response.json())
            .then(gpus => {
                let tableHtml = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Manufacturer</th>
                                <th>Memory Size</th>
                                <th>Core Clock</th>
                                <th>Boost Clock</th>
                                <th>Price</th> 
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                tableHtml += gpus.map((gpu, idx) => `
                    <tr data-idx="${idx}">
                        <td>
                            <img src="${gpu.image_url}" alt="${gpu.name}" class="img">
                            <span>${gpu.name}</span>
                        </td>
                        <td>${gpu.manufacturer}</td>
                        <td>${gpu.memory_size} GB</td>
                        <td>${gpu.core_clock} MHz</td>
                        <td>${gpu.boost_clock} MHz</td>
                        <td>€${gpu.price}</td>
                        <td><a class="select-btn">Add</a></td>
                    </tr>
                `).join('');
                tableHtml += `
                        </tbody>
                    </table>
                `;
                partsListDiv.innerHTML = tableHtml;
                partsListDiv.style.display = "block";
                builderTitle.textContent = "Add a GPU";

                document.querySelectorAll('.select-btn').forEach((btn, idx) => {
                    btn.addEventListener('click', function() {
                        selectedGpu = gpus[idx];
                        partsListDiv.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
            });
    }

    // CPU selection logic
    function showCpuSelection() {
    selectedGpuDiv.style.display = "none";
    fetch('http://localhost:5000/api/cpus')
        .then(response => response.json())
        .then(cpus => {
            let tableHtml = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Manufacturer</th>
                            <th>Core Count</th>
                            <th>Thread Count</th>
                            <th>Socket</th>
                            <th>Price</th> 
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            tableHtml += cpus.map((cpu, idx) => `
                <tr data-idx="${idx}">
                    <td>
                        <img src="${cpu.image_url}" alt="${cpu.name}" class="img">
                        <span>${cpu.name}</span>
                    </td>
                    <td>${cpu.manufacturer}</td>
                    <td>${cpu.core_count}</td>
                    <td>${cpu.thread_count}</td>
                    <td>${cpu.socket}</td>
                    <td>€${cpu.price}</td>
                    <td><a class="select-btn">Add</a></td>
                </tr>
            `).join('');
            tableHtml += `
                    </tbody>
                </table>
            `;
            partsListDiv.innerHTML = tableHtml;
            partsListDiv.style.display = "block";
            builderTitle.textContent = "Add a CPU";

            document.querySelectorAll('.select-btn').forEach((btn, idx) => {
                btn.addEventListener('click', function() {
                    selectedCpu = cpus[idx];
                    partsListDiv.style.display = "none";
                    selectedGpuDiv.style.display = "flex";
                    builderTitle.textContent = "PC Builder";
                    renderSelectedTable();
                });
            });
        });
    }

    // Initial render
    renderSelectedTable();
});