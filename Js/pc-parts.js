document.addEventListener('DOMContentLoaded', function() {
    const partsListDiv = document.getElementById('parts-list');
    const builderTitle = document.querySelector('.pc-builder-title h1');
    let selectedGpuDiv = null;
    let selectedGpu = null;
    let selectedCpu = null;
    let selectedMotherboard = null;
    let selectedRam = null;
    let selectedSsd = null;

    // Create and insert the selected table
    selectedGpuDiv = document.createElement('div');
    selectedGpuDiv.id = 'selected';
    const pcBuilderContent = document.querySelector('.pc-builder-content');
    pcBuilderContent.insertBefore(selectedGpuDiv, partsListDiv);


    function renderSelectedTable() {
        // Calculate total TDP
        const cpuTdp = selectedCpu && selectedCpu.tdp ? Number(selectedCpu.tdp) : 0;
        const gpuTdp = selectedGpu && selectedGpu.tdp ? Number(selectedGpu.tdp) : 0;
        const motherboardTdp = selectedMotherboard && selectedMotherboard.tdp ? Number(selectedMotherboard.tdp) : 0;
        const ssdTdp = selectedSsd && selectedSsd.tdp ? Number(selectedSsd.tdp) : 0;
        const totalTdp = cpuTdp + gpuTdp + motherboardTdp + ssdTdp;

        // Calculate total price
        const cpuPrice = selectedCpu ? Number(selectedCpu.price) : 0;
        const gpuPrice = selectedGpu ? Number(selectedGpu.price) : 0;
        const motherboardPrice = selectedMotherboard ? Number(selectedMotherboard.price) : 0;
        const ramPrice = selectedRam ? Number(selectedRam.price) : 0;
        const totalPrice = cpuPrice + gpuPrice + motherboardPrice + ramPrice;

        // Power usage meter
        const powerMeterHtml = `
            <div class="power-usage-meter">
                <strong><i class="fa-solid fa-bolt"></i>Estimated Power Usage:</strong>
                <meter min="0" max="1200" value="${totalTdp}" class="power-meter"></meter>
                <span class="power-watt">${totalTdp} W</span>
            </div>
        `;

        // Render selected
        selectedGpuDiv.innerHTML = `
            <div class="selected-table">
                <table class="table">
                <thead>
                        <tr>
                            <div class="power-usage">
                                ${powerMeterHtml}
                            </div>
                        </tr>
                    </thead>
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
                        <tr>
                            <td>Motherboard</td>
                            <td>
                                ${
                                    selectedMotherboard
                                    ? `<img src="${selectedMotherboard.image_url}" alt="${selectedMotherboard.name}" class="img">
                                    <span>${selectedMotherboard.name}</span>`
                                    : `<div class="add-button" id="add-motherboard-btn">
                                        <a><i class="fa-solid fa-plus"></i>Add Motherboard</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedMotherboard ? '' : 'none-selected'}">
                                ${selectedMotherboard ? `€${selectedMotherboard.price}` : '-'}
                            </td>
                            <td class="${selectedMotherboard ? '' : 'none-selected'}">
                                ${
                                    selectedMotherboard
                                    ? `<a class="remove-selected-motherboard-btn">Remove</a>`
                                    : 'No Motherboard selected'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>RAM</td>
                            <td>
                                ${
                                    selectedRam
                                    ? `<img src="${selectedRam.image_url}" alt="${selectedRam.name}" class="img">
                                    <span>${selectedRam.name}</span>`
                                    : `<div class="add-button" id="add-ram-btn">
                                        <a><i class="fa-solid fa-plus"></i>Add RAM</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedRam ? '' : 'none-selected'}">
                                ${selectedRam ? `€${selectedRam.price}` : '-'}
                            </td>
                            <td class="${selectedRam ? '' : 'none-selected'}">
                                ${
                                    selectedRam
                                    ? `<a class="remove-selected-ram-btn">Remove</a>`
                                    : 'No RAM selected'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>SSD</td>
                            <td>
                                ${
                                    selectedSsd
                                    ? `<img src="${selectedSsd.image_url}" alt="${selectedSsd.name}" class="img">
                                    <span>${selectedSsd.name}</span>`
                                    : `<div class="add-button" id="add-ssd-btn">
                                        <a><i class="fa-solid fa-plus"></i>Add SSD</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedSsd ? '' : 'none-selected'}">
                                ${selectedSsd ? `€${selectedSsd.price}` : '-'}
                            </td>
                            <td class="${selectedSsd ? '' : 'none-selected'}">
                                ${
                                    selectedSsd
                                    ? `<a class="remove-selected-ssd-btn">Remove</a>`
                                    : 'No SSD selected'
                                }
                            </td>
                        </tr>
                        <tr class="total-amount-row">
                            <td colspan="2" class="total-label">Total Amount:</td>
                            <td colspan="2" class="total-value">
                                €${totalPrice.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Remove handlers
        if (selectedGpu) {
            const removeGpuBtn = selectedGpuDiv.querySelector('.remove-selected-btn');
            if (removeGpuBtn) {
                removeGpuBtn.addEventListener('click', function() {
                    selectedGpu = null;
                    renderSelectedTable();
                });
            }
        }

        if (selectedCpu) {
            const removeCpuBtn = selectedGpuDiv.querySelector('.remove-selected-cpu-btn');
            if (removeCpuBtn) {
                removeCpuBtn.addEventListener('click', function() {
                    selectedCpu = null;
                    renderSelectedTable();
                });
            }
        }

        if (selectedMotherboard) {
            const removeMotherboardBtn = selectedGpuDiv.querySelector('.remove-selected-motherboard-btn');
            if (removeMotherboardBtn) {
                removeMotherboardBtn.addEventListener('click', function() {
                    selectedMotherboard = null;
                    renderSelectedTable();
                });
            }
        }

        if (selectedRam) {
            const removeRamBtn = selectedGpuDiv.querySelector('.remove-selected-ram-btn');
            if (removeRamBtn) {
                removeRamBtn.addEventListener('click', function() {
                    selectedRam = null;
                    renderSelectedTable();
                });
            }
        }

        if (selectedSsd) {
            const removeSsdBtn = selectedGpuDiv.querySelector('.remove-selected-ssd-btn');
            if (removeSsdBtn) {
                removeSsdBtn.addEventListener('click', function() {
                    selectedSsd = null;
                    renderSelectedTable();
                });
            }
        }

        // Add handlers
        const addGpuBtn = selectedGpuDiv.querySelector('#add-gpu-btn');
        if (addGpuBtn) {
            addGpuBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showGpuSelection();
            });
        }

        const addCpuBtn = selectedGpuDiv.querySelector('#add-cpu-btn');
        if (addCpuBtn) {
            addCpuBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showCpuSelection();
            });
        }

        const addMotherboardBtn = selectedGpuDiv.querySelector('#add-motherboard-btn');
        if (addMotherboardBtn) {
            addMotherboardBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showMotherboardSelection();
            });
        }

        const addRamBtn = selectedGpuDiv.querySelector('#add-ram-btn');
        if (addRamBtn) {
            addRamBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showRamSelection();
            });
        }

        const addSsdBtn = selectedGpuDiv.querySelector('#add-ssd-btn');
        if (addSsdBtn) {
            addSsdBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showSsdSelection();
            });
        }
    }

    function showGpuSelection() {
        selectedGpuDiv.style.display = "none";
        const gpuTable = document.getElementById('gpu-table');
        const cpuTable = document.getElementById('cpu-table');
        const motherboardTable = document.getElementById('motherboard-table');
        const ramTable = document.getElementById('ram-table');
        gpuTable.style.display = "table";
        cpuTable.style.display = "none";
        motherboardTable.style.display = "none";
        ramTable.style.display = "none";
        fetch('http://localhost:5000/api/gpus')
            .then(response => response.json())
            .then(gpus => {
                const tbody = gpuTable.querySelector('tbody');
                tbody.innerHTML = "";
                gpus.forEach((gpu, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <img src="${gpu.image_url}" alt="${gpu.name}" class="img">
                            <span>${gpu.name}</span>
                        </td>
                        <td>${gpu.manufacturer}</td>
                        <td>${gpu.memory_size} GB</td>
                        <td>${gpu.core_clock} MHz</td>
                        <td>${gpu.boost_clock} MHz</td>
                        <td>€${gpu.price}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a GPU";
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedGpu = gpus[idx];
                        gpuTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
            });
    }

    function showCpuSelection() {
        selectedGpuDiv.style.display = "none";
        const cpuTable = document.getElementById('cpu-table');
        const gpuTable = document.getElementById('gpu-table');
        const motherboardTable = document.getElementById('motherboard-table');
        const ramTable = document.getElementById('ram-table');
        cpuTable.style.display = "table";
        gpuTable.style.display = "none";
        motherboardTable.style.display = "none";
        ramTable.style.display = "none";
        fetch('http://localhost:5000/api/cpus')
            .then(response => response.json())
            .then(cpus => {
                const tbody = cpuTable.querySelector('tbody');
                tbody.innerHTML = "";
                cpus.forEach((cpu, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <img src="${cpu.image_url}" alt="${cpu.name}" class="img">
                            <span>${cpu.name}</span>
                        </td>
                        <td>${cpu.manufacturer}</td>
                        <td>${cpu.core_count}</td>
                        <td>${cpu.thread_count}</td>
                        <td>${cpu.socket}</td>
                        <td>€${cpu.price}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a CPU";
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedCpu = cpus[idx];
                        cpuTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
            });
    }

    function showMotherboardSelection() {
        selectedGpuDiv.style.display = "none";
        const motherboardTable = document.getElementById('motherboard-table');
        const cpuTable = document.getElementById('cpu-table');
        const gpuTable = document.getElementById('gpu-table');
        const ramTable = document.getElementById('ram-table');
        motherboardTable.style.display = "table";
        cpuTable.style.display = "none";
        gpuTable.style.display = "none";
        ramTable.style.display = "none";
        fetch('http://localhost:5000/api/motherboards')
            .then(response => response.json())
            .then(motherboards => {
                const tbody = motherboardTable.querySelector('tbody');
                tbody.innerHTML = "";
                motherboards.forEach((mb, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <img src="${mb.image_url}" alt="${mb.name}" class="img">
                            <span>${mb.name}</span>
                        </td>
                        <td>${mb.manufacturer}</td>
                        <td>${mb.socket}</td>
                        <td>${mb.chipset}</td>
                        <td>${mb.form_factor}</td>
                        <td>€${mb.price}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a Motherboard";
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedMotherboard = motherboards[idx];
                        motherboardTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
            });
    }

    function showRamSelection() {
        selectedGpuDiv.style.display = "none";
        const ramTable = document.getElementById('ram-table');
        const cpuTable = document.getElementById('cpu-table');
        const gpuTable = document.getElementById('gpu-table');
        const motherboardTable = document.getElementById('motherboard-table');
        ramTable.style.display = "table";
        cpuTable.style.display = "none";
        gpuTable.style.display = "none";
        motherboardTable.style.display = "none";
        fetch('http://localhost:5000/api/rams')
            .then(response => response.json())
            .then(rams => {
                const tbody = ramTable.querySelector('tbody');
                tbody.innerHTML = "";
                rams.forEach((ram, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <img src="${ram.image_url}" alt="${ram.name}" class="img">
                            <span>${ram.name}</span>
                        </td>
                        <td>${ram.manufacturer}</td>
                        <td>${ram.capacity} GB</td>
                        <td>${ram.ram_speed} MHz</td>
                        <td>${ram.ram_type}</td>
                        <td>€${ram.price}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add RAM";
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedRam = rams[idx];
                        ramTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
            });
    }

    function showSsdSelection() {
        selectedGpuDiv.style.display = "none";
        const ramTable = document.getElementById('ram-table');
        const cpuTable = document.getElementById('cpu-table');
        const gpuTable = document.getElementById('gpu-table');
        const motherboardTable = document.getElementById('motherboard-table');
        const ssdTable = document.getElementById('ssd-table');
        ramTable.style.display = "none";
        cpuTable.style.display = "none";
        gpuTable.style.display = "none";
        motherboardTable.style.display = "none";
        ssdTable.style.display = "table";
        fetch('http://localhost:5000/api/ssds')
            .then(response => response.json())
            .then(ssds => {
                const tbody = ssdTable.querySelector('tbody');
                tbody.innerHTML = "";
                ssds.forEach((ssd, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <img src="${ssd.image_url}" alt="${ssd.name}" class="img">
                            <span>${ssd.name}</span>
                        </td>
                        <td>${ssd.manufacturer}</td>
                        <td>${ssd.capacity} GB</td>
                        <td>${ssd.read_speed} MHz</td>
                        <td>${ssd.write_speed} MHz</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add SSD";
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedSsd = ssds[idx];
                        ssdTable.style.display = "none";
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