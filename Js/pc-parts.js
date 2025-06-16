document.addEventListener('DOMContentLoaded', function() {
    const partsListDiv = document.getElementById('parts-list');
    const builderTitle = document.querySelector('.pc-builder-title h1');
    const filterBar = document.getElementById('filter-bar');
    const filterInput = document.getElementById('filter-input');
    let activeFilters = {};
    let currentItems = [];
    let currentColumns = [];
    let selectedGpuDiv = null;
    let selectedGpu = null;
    let selectedCpu = null;
    let selectedMotherboard = null;
    let selectedRam = null;
    let selectedSsd = null;
    let selectedCpuCooler = null;
    let selectedPsu = null;
    let selectedCase = null;

    // Apply all filters together
    function applyAllFilters() {
        const search = filterInput.value.trim().toLowerCase();
        const tbody = document.querySelector('.builder-main-row table[style*="table"] tbody') ||
        document.querySelector('.builder-main-row table:not([style*="none"]) tbody');
        if (!tbody) return;
        Array.from(tbody.children).forEach((tr, idx) => {
            const item = currentItems[idx];
            let visible = true;

            // Sidebar filters
            for (const [filterCol, filterVal] of Object.entries(activeFilters)) {
                if (filterCol === 'price') continue;
                let itemVal = item[filterCol];
                if (filterCol === 'manufacturer' && typeof itemVal === 'string') {
                    itemVal = itemVal.charAt(0).toUpperCase() + itemVal.slice(1).toLowerCase();
                }
                if (Array.isArray(itemVal)) {
                    if (!itemVal.includes(filterVal)) visible = false;
                } else {
                    if (itemVal !== filterVal) visible = false;
                }
            }

            // Price filter
            if (activeFilters.price) {
                const [min, max] = activeFilters.price;
                const roundedPrice = Math.round(Number(item.price));
                if (roundedPrice < min || roundedPrice > max) visible = false;
            }
            if (search) {
                const match = currentColumns.some(col => {
                    let val = item[col];
                    if (Array.isArray(val)) {
                        return val.some(v => String(v).toLowerCase().includes(search));
                    }
                    return String(val || '').toLowerCase().includes(search);
                });
                if (!match) visible = false;
            }

            tr.style.display = visible ? '' : 'none';
        });
    }

    function createFilterButtons(items, columns, onFilter) {
        const sidebar = document.getElementById('filter-sidebar');
        sidebar.innerHTML = '';

        // Find min and max price
        const prices = items.map(item => Number(item.price)).filter(p => !isNaN(p));
        const minPrice = 0;
        const maxPrice = Math.ceil(Math.max(...prices));

        // Create price slider group
        const priceGroup = document.createElement('div');
        priceGroup.className = 'filter-price-group';

        const priceValues = document.createElement('div');
        priceValues.className = 'filter-price-values';
        priceValues.innerHTML = `<span id="price-min">${minPrice} €</span> - <span id="price-max">${maxPrice} €</span>`;

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'filter-price-slider-wrapper';

        // Create noUiSlider element
        const slider = document.createElement('div');
        slider.id = 'nouislider-price';
        sliderWrapper.appendChild(slider);

        priceGroup.appendChild(priceValues);
        priceGroup.appendChild(sliderWrapper);
        sidebar.appendChild(priceGroup);

        // Initialize noUiSlider
        noUiSlider.create(slider, {
            start: [minPrice, maxPrice],
            connect: true,
            range: {
                'min': minPrice,
                'max': maxPrice
            },
            step: 1,
            tooltips: false,
            format: {
                to: value => Math.round(value),
                from: value => Number(value)
            }
        });

        slider.noUiSlider.on('update', function(values) {
            const [currentMin, currentMax] = values.map(Number);
            priceValues.querySelector('#price-min').textContent = `€ ${currentMin}`;
            priceValues.querySelector('#price-max').textContent = `€ ${currentMax}`;
            activeFilters.price = [currentMin, currentMax];
            applyAllFilters();
        });

        // Define units
        const units = {
            memory_size: 'GB',
            capacity: 'GB',
            ram_speed: 'MHz',
            read_speed: 'MHz',
            write_speed: 'MHz',
            wattage: 'W'
        };

        const isSSD = items.length > 0 && items[0].hasOwnProperty('read_speed') && items[0].hasOwnProperty('write_speed');
        columns.forEach(col => {
            let values;
            if (
                col === 'front_panel_port_amounts' ||
                col === 'front_panel_port_types' ||
                col === 'drive_bay_amounts' ||
                col === 'drive_bay_types'
            ) {
                values = [...new Set(items.flatMap(item => item[col] || []))];
            } else if (col === 'socket' && items.some(item => Array.isArray(item.socket_list))) {
                values = [...new Set(items.flatMap(item => item.socket_list || []))];
            } else {
                values = [...new Set(items.map(item => {
                    if (col === 'manufacturer' && typeof item[col] === 'string') {
                        return item[col].charAt(0).toUpperCase() + item[col].slice(1).toLowerCase();
                    }
                    if (col === 'fan_size' && typeof item[col] === 'string') {
                        return item[col].replace('x', '×').replace('X', '×').replace('*', '×').replace(/ /g, '').replace('×', ' × ').replace(/mm/i, 'mm');
                    }
                    return item[col];
                }).filter(Boolean))];
            }

            // convert to TB
            if (isSSD && col === 'capacity') {
                values = values.map(val => Number(val) / 1000);
                units.capacity = 'TB';
            }

            values = values.sort((a, b) => {
                return !isNaN(a) && !isNaN(b) ? Number(a) - Number(b) : String(a).localeCompare(String(b));
            });
            if (values.length === 0) return;

            const group = document.createElement('div');
            group.className = 'filter-btn-group';
            const label = document.createElement('h4');
            // Custom labels
            if (col === 'fan_amount') {
                label.textContent = 'Fan Amount';
            } else if (col === 'fan_size_only') {
                label.textContent = 'Fan Size';
            } else if (col === 'socket') {
                label.textContent = 'Socket';
            } else if (col === 'front_panel_port_amounts') {
                label.textContent = 'Front Panel Port Amount';
            } else if (col === 'front_panel_port_types') {
                label.textContent = 'Front Panel Port Type';
            } else if (col === 'drive_bay_amounts') {
                label.textContent = 'Drive Bay Amount';
            } else if (col === 'drive_bay_types') {
                label.textContent = 'Drive Bay Type';
            } else {
                label.textContent = col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
            group.appendChild(label);

            values.forEach(val => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                const unit = (units[col] && col !== 'fan_size' && col !== 'fan_size_only') ? ` ${units[col]}` : '';
                btn.textContent = `${val}${unit}`;
                btn.onclick = () => {
                    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    let filterVal = val;
                    if (col === 'manufacturer') {
                        filterVal = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                    }
                    if (isSSD && col === 'capacity') filterVal = val * 1000;
                    activeFilters[col] = filterVal;
                    applyAllFilters();
                };
                group.appendChild(btn);
            });

            // Add reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'filter-btn';
            resetBtn.textContent = 'All';
            resetBtn.onclick = () => {
                group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                resetBtn.classList.add('active');
                delete activeFilters[col];
                applyAllFilters();
            };
            group.appendChild(resetBtn);

            sidebar.appendChild(group);
        });
    }

    function filterTableRows(tbody, items, columns) {
        const search = document.getElementById('filter-input').value.trim().toLowerCase();
        Array.from(tbody.children).forEach((tr, idx) => {
            const item = items[idx];
            const match = columns.some(col => {
                let val = item[col];
                if (Array.isArray(val)) {
                    return val.some(v => String(v).toLowerCase().includes(search));
                }
                return String(val || '').toLowerCase().includes(search);
            });
            tr.style.display = match ? '' : 'none';
        });
    }

    // Show/hide filter bar and set up filtering
    function setupFilter(tbody, items, columns) {
        filterBar.style.display = 'block';
        filterInput.value = '';
        currentItems = items;
        currentColumns = columns;
        filterInput.oninput = applyAllFilters; // <-- direct reference
        createFilterButtons(items, columns.filter(col => col !== 'name'), () => {});
    }

    // Hide filter bar when not needed
    function hideFilter() {
        filterBar.style.display = 'none';
        filterInput.value = '';
        filterInput.oninput = null;
    }

    // Load all selected parts from sessionStorage
    const storedParts = JSON.parse(sessionStorage.getItem('selectedParts'));
    if (storedParts) {
        selectedCpu = storedParts.cpu;
        selectedGpu = storedParts.gpu;
        selectedMotherboard = storedParts.motherboard;
        selectedRam = storedParts.ram;
        selectedSsd = storedParts.ssd;
        selectedCpuCooler = storedParts.cpu_cooler;
        selectedPsu = storedParts.psu;
        selectedCase = storedParts.case;
    }

    // Handle add from details page
    const addPart = JSON.parse(sessionStorage.getItem('addPartToBuild'));
    if (addPart) {
        switch (addPart.type) {
            case 'cpu': selectedCpu = addPart.data; break;
            case 'gpu': selectedGpu = addPart.data; break;
            case 'motherboard': selectedMotherboard = addPart.data; break;
            case 'ram': selectedRam = addPart.data; break;
            case 'ssd': selectedSsd = addPart.data; break;
            case 'cpu_cooler': selectedCpuCooler = addPart.data; break;
            case 'psu': selectedPsu = addPart.data; break;
            case 'case': selectedCase = addPart.data; break;
        }
        sessionStorage.removeItem('addPartToBuild');
        saveSelectedParts();
    }

    function saveSelectedParts() {
        const selectedParts = {
            cpu: selectedCpu,
            gpu: selectedGpu,
            motherboard: selectedMotherboard,
            ram: selectedRam,
            ssd: selectedSsd,
            cpu_cooler: selectedCpuCooler,
            psu: selectedPsu,
            case: selectedCase
        };
        sessionStorage.setItem('selectedParts', JSON.stringify(selectedParts));
    }

    // Price format
    let EURO = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
    });

    // Create and insert selected table
    selectedGpuDiv = document.getElementById('selected');

    function renderSelectedTable() {
        // Calculate total TDP
        const cpuTdp = selectedCpu && selectedCpu.tdp ? Number(selectedCpu.tdp) : 0;
        const gpuTdp = selectedGpu && selectedGpu.tdp ? Number(selectedGpu.tdp) : 0;
        const motherboardTdp = selectedMotherboard && selectedMotherboard.tdp ? Number(selectedMotherboard.tdp) : 0;
        const ramTdp = selectedRam && selectedRam.tdp ? Number(selectedRam.tdp) : 0;
        const ssdTdp = selectedSsd && selectedSsd.tdp ? Number(selectedSsd.tdp) : 0;
        const cpuCoolerTdp = selectedCpuCooler && selectedCpuCooler.tdp ? Number(selectedCpuCooler.tdp) : 0;
        const totalTdp = cpuTdp + gpuTdp + motherboardTdp + ramTdp + ssdTdp + cpuCoolerTdp;

        // Calculate total price
        const cpuPrice = selectedCpu ? Number(selectedCpu.price) : 0;
        const gpuPrice = selectedGpu ? Number(selectedGpu.price) : 0;
        const motherboardPrice = selectedMotherboard ? Number(selectedMotherboard.price) : 0;
        const ramPrice = selectedRam ? Number(selectedRam.price) : 0;
        const cpuCoolerPrice = selectedCpuCooler ? Number(selectedCpuCooler.price) : 0;
        const casePrice = selectedCase ? Number(selectedCase.price) : 0;
        const psuPrice = selectedPsu ? Number(selectedPsu.price) : 0;
        const totalPrice = cpuPrice + gpuPrice + motherboardPrice + ramPrice + cpuCoolerPrice + psuPrice + casePrice + 150; // Adding a base price for build cost
        const buildPrice = totalPrice - 150; // Build Cost

        // Power usage meter
        const powerMeterHtml = `
            <div class="power-usage-meter">
                <strong><i class="fa-solid fa-bolt"></i>Estimated Power Usage:</strong>
                <meter min="0" max="1200" value="${totalTdp}" class="power-meter"></meter>
                <span class="power-watt">${totalTdp} W</span>
            </div>
        `;

        // Compatibility check
        let compatibilityWarnings = [];

        // CPU | Motherboard socket
        if (selectedCpu && selectedMotherboard && selectedCpu.socket !== selectedMotherboard.socket) {
            compatibilityWarnings.push("⚠️ CPU and Motherboard sockets do not match.");
        }

        // CPU Cooler | CPU socket
        if (selectedCpu && selectedCpuCooler) {
            // Cpu Cooler socket can be a string
            const coolerSockets = selectedCpuCooler.socket
                .split(/[,;]+/)
                .map(s => s.trim().toUpperCase());
            if (!coolerSockets.includes(selectedCpu.socket.toUpperCase())) {
                compatibilityWarnings.push("⚠️ CPU Cooler may not fit the selected CPU socket.");
            }
        }

        // GPU | Motherboard Slot
        if (selectedGpu && selectedMotherboard) {
            const expansionSlots = selectedMotherboard.expansion_slots
                .split(/[,;]/)
                .map(s => s.trim().toUpperCase());
            if (!expansionSlots.includes(selectedGpu.slot.toUpperCase())) {
                compatibilityWarnings.push("⚠️ GPU and Motherboard slot do not match");
            }
        }

        // RAM | Motherboard Type
        if (selectedRam && selectedMotherboard && selectedRam.ram_type !== selectedMotherboard.ram_type) {
            compatibilityWarnings.push("⚠️ RAM and Motherboard slots do not match.");
        }

        // PSU | Powerusage
        if (selectedPsu && totalTdp && selectedPsu.wattage < totalTdp) {
            compatibilityWarnings.push("⚠️ Powersupply may not supply sufficient wattage.");
        }

        // Motherboard | Case Form factor
        if (
            selectedMotherboard &&
            selectedCase &&
            selectedMotherboard.form_factor &&
            selectedCase.form_factor
        ) {
            // Map case form factor to supported motherboards
            const caseSupportMap = {
                "E-ATX": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
                "Full Tower": ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
                "Mid Tower": ["ATX", "Micro-ATX", "Mini-ITX"],
                "Mini Tower": ["Micro-ATX", "Mini-ITX"],
                "ATX": ["ATX", "Micro-ATX", "Mini-ITX"],
                "Micro-ATX": ["Micro-ATX", "Mini-ITX"],
                "Mini-ITX": ["Mini-ITX"]
            };

            const caseType = selectedCase.form_factor.trim();
            const motherboardType = selectedMotherboard.form_factor.trim();

            const supported = caseSupportMap[caseType];
            if (!supported || !supported.includes(motherboardType)) {
                compatibilityWarnings.push("⚠️ Motherboard may not fit in selected Case.");
            }
        }

        // PSU | Case Form factor
        if (
            selectedPsu &&
            selectedCase &&
            selectedPsu.form_factor
            && selectedCase.form_factor
        ) {
            // Map case form factor to supported PSUs
            const psuSupportMap = {
                "E-ATX": ["ATX", "Micro-ATX", "SFX", "ATX 3.0"],
                "Full Tower": ["ATX", "Micro-ATX", "SFX", "ATX 3.0"],
                "Mid Tower": ["ATX", "Micro-ATX", "SFX", "ATX 3.0"],
                "Mini Tower": ["Micro-ATX", "SFX"],
                "ATX": ["ATX", "Micro-ATX", "SFX", "ATX 3.0"],
                "Micro-ATX": ["Micro-ATX", "SFX"],
                "Mini-ITX": ["SFX"]
            };

            const caseType = selectedCase.form_factor.trim();
            const psuType = selectedPsu.form_factor.trim();

            const supported = psuSupportMap[caseType];
            if (!supported || !supported.includes(psuType)) {
                compatibilityWarnings.push("⚠️ Powersupply may not fit in selected Case.");
            }
        }


        const compatibilityHtml = `
            <div class="compatibility-bar">
                ${
                    compatibilityWarnings.length === 0
                    ? '<span class="compatibility-warning"><i class="fa fa-check-circle"></i> All selected parts are compatible.</span>'
                    : compatibilityWarnings.map(w => `<span class="compatibility-warning-red">${w}</span>`).join('<br>')
                }
            </div>
        `;

        // Hide filters
        hideFilter();
        const filterSidebar = document.getElementById('filter-sidebar');
        if (filterSidebar) filterSidebar.style.display = 'none';

        // Render selected
        selectedGpuDiv.innerHTML = `
            <div class="selected-table">
                <table class="table">
                    <thead>
                        <tr>
                            <div class="pc-builder-status-row">
                                ${powerMeterHtml}
                                ${compatibilityHtml}
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
                                    ? `<a href="#" class="part-detail-link" data-type="cpu" data-part='${JSON.stringify(selectedCpu)}'>
                                            <img src="${selectedCpu.image_url}" alt="${selectedCpu.name}" class="img">
                                            <span>${selectedCpu.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-cpu-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add CPU</a>
                                        </div>`
                                }
                            </td>
                            <td class="${selectedCpu ? '' : 'none-selected'}">
                                ${selectedCpu ? `${EURO.format(selectedCpu.price)}` : '-'}
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
                                    ? `<a href="#" class="part-detail-link" data-type="gpu" data-part='${JSON.stringify(selectedGpu)}'>
                                            <img src="${selectedGpu.image_url}" alt="${selectedGpu.name}" class="img">
                                            <span>${selectedGpu.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-gpu-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add GPU</a>
                                        </div>`
                                }
                            </td>
                            <td class="${selectedGpu ? '' : 'none-selected'}">
                                ${selectedGpu ? `${EURO.format(selectedGpu.price)}` : '-'}
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
                                    ? `<a href="#" class="part-detail-link" data-type="motherboard" data-part='${JSON.stringify(selectedMotherboard)}'>
                                            <img src="${selectedMotherboard.image_url}" alt="${selectedMotherboard.name}" class="img">
                                            <span>${selectedMotherboard.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-motherboard-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add Motherboard</a>
                                        </div>`
                                }
                            </td>
                            <td class="${selectedMotherboard ? '' : 'none-selected'}">
                                ${selectedMotherboard ? `${EURO.format(selectedMotherboard.price)}` : '-'}
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
                                    ? `<a href="#" class="part-detail-link" data-type="ram" data-part='${JSON.stringify(selectedRam)}'>
                                            <img src="${selectedRam.image_url}" alt="${selectedRam.name}" class="img">
                                            <span>${selectedRam.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-ram-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add Ram</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedRam ? '' : 'none-selected'}">
                                ${selectedRam ? `${EURO.format(selectedRam.price)}` : '-'}
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
                                    ? `<a href="#" class="part-detail-link" data-type="ssd" data-part='${JSON.stringify(selectedSsd)}'>
                                            <img src="${selectedSsd.image_url}" alt="${selectedSsd.name}" class="img">
                                            <span>${selectedSsd.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-ssd-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add SSD</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedSsd ? '' : 'none-selected'}">
                                ${selectedSsd ? `${EURO.format(selectedSsd.price)}` : '-'}
                            </td>
                            <td class="${selectedSsd ? '' : 'none-selected'}">
                                ${
                                    selectedSsd
                                    ? `<a class="remove-selected-ssd-btn">Remove</a>`
                                    : 'No SSD selected'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>CPU Cooler</td>
                            <td>
                                ${
                                    selectedCpuCooler
                                    ? `<a href="#" class="part-detail-link" data-type="cpu_cooler" data-part='${JSON.stringify(selectedCpuCooler)}'>
                                            <img src="${selectedCpuCooler.image_url}" alt="${selectedCpuCooler.name}" class="img">
                                            <span>${selectedCpuCooler.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-cpu-cooler-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add CPU Cooler</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedCpuCooler ? '' : 'none-selected'}">
                                ${selectedCpuCooler ? `${EURO.format(selectedCpuCooler.price)}` : '-'}
                            </td>
                            <td class="${selectedCpuCooler ? '' : 'none-selected'}">
                                ${
                                    selectedCpuCooler
                                    ? `<a class="remove-selected-cpu-cooler-btn">Remove</a>`
                                    : 'No CPU Cooler selected'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Powersupply</td>
                            <td>
                                ${
                                    selectedPsu
                                    ? `<a href="#" class="part-detail-link" data-type="powersupply" data-part='${JSON.stringify(selectedPsu)}'>
                                            <img src="${selectedPsu.image_url}" alt="${selectedPsu.name}" class="img">
                                            <span>${selectedPsu.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-psu-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add Powersupply</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedPsu ? '' : 'none-selected'}">
                                ${selectedPsu ? `${EURO.format(selectedPsu.price)}` : '-'}
                            </td>
                            <td class="${selectedPsu ? '' : 'none-selected'}">
                                ${
                                    selectedPsu
                                    ? `<a class="remove-selected-psu-btn">Remove</a>`
                                    : 'No Powersupply selected'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Case</td>
                            <td>
                                ${
                                    selectedCase
                                    ? `<a href="#" class="part-detail-link" data-type="case" data-part='${JSON.stringify(selectedCase)}'>
                                            <img src="${selectedCase.image_url}" alt="${selectedCase.name}" class="img">
                                            <span>${selectedCase.name}</span>
                                    </a>`
                                    : `<div class="add-button" id="add-case-btn">
                                            <a><i class="fa-solid fa-plus"></i>Add Case</a>
                                    </div>`
                                }
                            </td>
                            <td class="${selectedCase ? '' : 'none-selected'}">
                                ${selectedCase ? `${EURO.format(selectedCase.price)}` : '-'}
                            </td>
                            <td class="${selectedCase ? '' : 'none-selected'}">
                                ${
                                    selectedCase
                                    ? `<a class="remove-selected-case-btn">Remove</a>`
                                    : 'No Case selected'
                                }
                            </td>
                        </tr>
                        <tr class="build-price-row">
                            <td colspan="2" class="build-label">Build Cost:</td>
                            <td colspan="2" class="build-value">
                                ${EURO.format(buildPrice.toFixed(2))}
                            </td>
                        </tr>
                        <tr class="total-amount-row">
                            <td colspan="2" class="total-label">Total Amount:</td>
                            <td colspan="2" class="total-value">
                                ${EURO.format(totalPrice.toFixed(2))}
                                <button class="buy-button" id="buy-button-builder">
                                    <span class="add-to-cart">Add to cart</span>
                                    <span class="added">Added</span>
                                    <i class="fas fa-shopping-cart"></i>
                                    <i class="fas fa-box"></i>
                                </button>
                                <button class="buy-button" id="save-build-btn">
                                    <i class="fa fa-save"></i> Save Build
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Add to cart for custom PC
        const buyButton = selectedGpuDiv.querySelector('#buy-button-builder');
        if (buyButton) {
            buyButton.addEventListener('click', function () {
                // Gather all selected parts for the custom PC
                const selectedParts = {
                    cpu: selectedCpu,
                    gpu: selectedGpu,
                    motherboard: selectedMotherboard,
                    ram: selectedRam,
                    ssd: selectedSsd,
                    cpu_cooler: selectedCpuCooler,
                    psu: selectedPsu,
                    case: selectedCase
                };

                // Add custom PC to cart
                let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
                cart.push({
                    id: "custom-" + Date.now(),
                    name: "Custom PC",
                    price: `€${totalPrice.toFixed(2)}`,
                    image: "wrench", // Special label for custom
                    quantity: 1,
                    parts: selectedParts
                });
                sessionStorage.setItem("cart", JSON.stringify(cart));
                if (typeof updateCartBadge === "function") updateCartBadge();

                // Button animation
                if (!buyButton.classList.contains('clicked')) {
                    buyButton.classList.add('clicked');
                    setTimeout(() => {
                        buyButton.classList.remove('clicked');
                    }, 1500);
                }
            });
        }

        // Save Build button logic
        const saveBuildBtn = selectedGpuDiv.querySelector('#save-build-btn');
        if (saveBuildBtn) {
            saveBuildBtn.addEventListener('click', function () {
                const username = sessionStorage.getItem('username');
                if (!username) {
                    alert('You must be logged in to save a build.');
                    return;
                }
                const buildName = prompt('Enter a name for your build:');
                if (!buildName) return;
                const buildData = {
                    cpu: selectedCpu,
                    gpu: selectedGpu,
                    motherboard: selectedMotherboard,
                    ram: selectedRam,
                    ssd: selectedSsd,
                    cpu_cooler: selectedCpuCooler,
                    psu: selectedPsu,
                    case: selectedCase
                };
                fetch('http://localhost:5000/api/builds', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        name: buildName,
                        data: JSON.stringify(buildData)
                    })
                })
                .then(res => res.json())
                .then(data => {
                    alert('Build saved!');
                    // Clear Table
                    selectedCpu = null;
                    selectedGpu = null;
                    selectedMotherboard = null;
                    selectedRam = null;
                    selectedSsd = null;
                    selectedCpuCooler = null;
                    selectedPsu = null;
                    selectedCase = null;
                    saveSelectedParts();
                    renderSelectedTable();
                })
                .catch(() => alert('Failed to save build.'));
            });
        }

        // Add event listeners detail links
        selectedGpuDiv.querySelectorAll('.part-detail-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const partType = this.getAttribute('data-type');
                const partData = JSON.parse(this.getAttribute('data-part'));
                sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                sessionStorage.removeItem('fromSelectionTable');
                window.location.href = 'pc-part-detail.html';
            });
        });

        // Remove handlers
        if (selectedGpu) {
            const removeGpuBtn = selectedGpuDiv.querySelector('.remove-selected-btn');
            if (removeGpuBtn) {
                removeGpuBtn.addEventListener('click', function() {
                    selectedGpu = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedCpu) {
            const removeCpuBtn = selectedGpuDiv.querySelector('.remove-selected-cpu-btn');
            if (removeCpuBtn) {
                removeCpuBtn.addEventListener('click', function() {
                    selectedCpu = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedMotherboard) {
            const removeMotherboardBtn = selectedGpuDiv.querySelector('.remove-selected-motherboard-btn');
            if (removeMotherboardBtn) {
                removeMotherboardBtn.addEventListener('click', function() {
                    selectedMotherboard = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedRam) {
            const removeRamBtn = selectedGpuDiv.querySelector('.remove-selected-ram-btn');
            if (removeRamBtn) {
                removeRamBtn.addEventListener('click', function() {
                    selectedRam = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedSsd) {
            const removeSsdBtn = selectedGpuDiv.querySelector('.remove-selected-ssd-btn');
            if (removeSsdBtn) {
                removeSsdBtn.addEventListener('click', function() {
                    selectedSsd = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedCpuCooler) {
            const removeCpuCoolerBtn = selectedGpuDiv.querySelector('.remove-selected-cpu-cooler-btn');
            if (removeCpuCoolerBtn) {
                removeCpuCoolerBtn.addEventListener('click', function() {
                    selectedCpuCooler = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedPsu) {
            const removePsuBtn = selectedGpuDiv.querySelector('.remove-selected-psu-btn');
            if (removePsuBtn) {
                removePsuBtn.addEventListener('click', function() {
                    selectedPsu = null;
                    saveSelectedParts();
                    renderSelectedTable();
                });
            }
        }

        if (selectedCase) {
            const removeCaseBtn = selectedGpuDiv.querySelector('.remove-selected-case-btn');
            if (removeCaseBtn) {
                removeCaseBtn.addEventListener('click', function() {
                    selectedCase = null;
                    saveSelectedParts();
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

        const addCpuCoolerBtn = selectedGpuDiv.querySelector('#add-cpu-cooler-btn');
        if (addCpuCoolerBtn) {
            addCpuCoolerBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showCpuCoolerSelection();
            });
        }

        const addPsuBtn = selectedGpuDiv.querySelector('#add-psu-btn');
        if (addPsuBtn) {
            addPsuBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showPsuSelection();
            });
        }

        const addCaseBtn = selectedGpuDiv.querySelector('#add-case-btn');
        if (addCaseBtn) {
            addCaseBtn.addEventListener('click', function() {
                selectedGpuDiv.style.display = "none";
                partsListDiv.style.display = "block";
                showCaseSelection();
            });
        }
    }

    function showGpuSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.add('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
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
                            <a href="#" class="part-detail-link" data-type="gpu" data-part='${JSON.stringify(gpu)}'>
                                <img src="${gpu.image_url}" alt="${gpu.name}" class="img">
                                <span>${gpu.name}</span>
                            </a>
                        </td>
                        <td>${gpu.manufacturer}</td>
                        <td>${gpu.memory_size} GB</td>
                        <td>${gpu.core_clock} MHz</td>
                        <td>${gpu.boost_clock} MHz</td>
                        <td>${EURO.format(gpu.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a GPU";
                setupFilter(tbody, gpus, ['name', 'manufacturer', 'memory_size']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedGpu = gpus[idx];
                        saveSelectedParts();
                        gpuTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showCpuSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.add('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
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
                            <a href="#" class="part-detail-link" data-type="cpu" data-part='${JSON.stringify(cpu)}'>
                                <img src="${cpu.image_url}" alt="${cpu.name}" class="img">
                                <span>${cpu.name}</span>
                            </a>
                        </td>
                        <td>${cpu.manufacturer}</td>
                        <td>${cpu.core_count}</td>
                        <td>${cpu.thread_count}</td>
                        <td>${cpu.socket}</td>
                        <td>${EURO.format(cpu.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a CPU";
                setupFilter(tbody, cpus, ['name', 'manufacturer', 'socket', 'core_count', 'thread_count']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedCpu = cpus[idx];
                        saveSelectedParts();
                        cpuTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showMotherboardSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.add('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
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
                            <a href="#" class="part-detail-link" data-type="motherboard" data-part='${JSON.stringify(mb)}'>
                                <img src="${mb.image_url}" alt="${mb.name}" class="img">
                                <span>${mb.name}</span>
                            </a>
                        </td>
                        <td>${mb.manufacturer}</td>
                        <td>${mb.socket}</td>
                        <td>${mb.chipset}</td>
                        <td>${mb.form_factor}</td>
                        <td>${EURO.format(mb.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a Motherboard";
                setupFilter(tbody, motherboards, ['name', 'manufacturer', 'form_factor', 'socket', 'chipset']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedMotherboard = motherboards[idx];
                        saveSelectedParts();
                        motherboardTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showRamSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.add('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
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
                            <a href="#" class="part-detail-link" data-type="ram" data-part='${JSON.stringify(ram)}'>
                                <img src="${ram.image_url}" alt="${ram.name}" class="img">
                                <span>${ram.name}</span>
                            </a>
                        </td>
                        <td>${ram.manufacturer}</td>
                        <td>${ram.capacity} GB</td>
                        <td>${ram.ram_speed} MHz</td>
                        <td>${ram.ram_type}</td>
                        <td>${EURO.format(ram.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add RAM";
                setupFilter(tbody, rams, ['name', 'manufacturer', 'capacity', 'ram_type']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedRam = rams[idx];
                        saveSelectedParts();
                        ramTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showSsdSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.add('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
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
                            <a href="#" class="part-detail-link" data-type="ssd" data-part='${JSON.stringify(ssd)}'>
                                <img src="${ssd.image_url}" alt="${ssd.name}" class="img">
                                <span>${ssd.name}</span>
                            </a>
                        </td>
                        <td>${ssd.manufacturer}</td>
                        <td>${ssd.capacity/1000} TB</td>
                        <td>${ssd.read_speed} MHz</td>
                        <td>${ssd.write_speed} MHz</td>
                        <td>${EURO.format(ssd.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add SSD";
                setupFilter(tbody, ssds, ['name', 'manufacturer', 'capacity']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedSsd = ssds[idx];
                        saveSelectedParts();
                        ssdTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showCpuCoolerSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.remove('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.add('cpu-cooler-gap');
        const ramTable = document.getElementById('ram-table');
        const cpuTable = document.getElementById('cpu-table');
        const gpuTable = document.getElementById('gpu-table');
        const motherboardTable = document.getElementById('motherboard-table');
        const ssdTable = document.getElementById('ssd-table');
        const cpuCoolerTable = document.getElementById('cpu_cooler-table');
        ramTable.style.display = "none";
        cpuTable.style.display = "none";
        gpuTable.style.display = "none";
        motherboardTable.style.display = "none";
        ssdTable.style.display = "none";
        cpuCoolerTable.style.display = "table";
        fetch('http://localhost:5000/api/cpu_coolers')
            .then(response => response.json())
            .then(cpuCoolers => {
                const tbody = cpuCoolerTable.querySelector('tbody');
                tbody.innerHTML = "";
                cpuCoolers.forEach(cooler => {
                    if (cooler.manufacturer)
                        cooler.manufacturer = cooler.manufacturer.charAt(0).toUpperCase() + cooler.manufacturer.slice(1).toLowerCase();
                    const match = (cooler.fan_size || '').match(/^(\d+)\s*[×x*]\s*(\d+mm)$/i);
                    if (match) {
                        cooler.fan_amount = match[1];
                        cooler.fan_size_only = match[2];
                    } else {
                        cooler.fan_amount = '';
                        cooler.fan_size_only = '';
                    }
                    if (cooler.socket) {
                        cooler.socket_list = cooler.socket
                            .replace(/Intel|AMD/gi, '') // Remove Intel/AMD labels
                            .split(/[,;]+/)
                            .map(s => s.trim())
                            .filter(s => s.length > 0);
                    } else {
                        cooler.socket_list = [];
                    }
                });

                cpuCoolers.forEach((cpuCooler, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <a href="#" class="part-detail-link" data-type="cpu_cooler" data-part='${JSON.stringify(cpuCooler)}'>
                                <img src="${cpuCooler.image_url}" alt="${cpuCooler.name}" class="img">
                                <span>${cpuCooler.name}</span>
                            </a>
                        </td>
                        <td>${cpuCooler.manufacturer}</td>
                        <td>${cpuCooler.fan_size} mm</td>
                        <td>${cpuCooler.socket.replace(';', ';<br>')}</td>
                        <td>${cpuCooler.cooling_type}</td>
                        <td>${EURO.format(cpuCooler.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });

                function customSocketFilter(col, val) {
                    Array.from(tbody.children).forEach((tr, idx) => {
                        const item = cpuCoolers[idx];
                        if (col === 'socket') {
                            tr.style.display = item.socket_list.includes(val) ? '' : 'none';
                        } else {
                            tr.style.display = (item[col] === val) ? '' : 'none';
                        }
                    });
                }

                setupFilter(tbody, cpuCoolers, ['name', 'manufacturer', 'cooling_type', 'fan_amount', 'fan_size_only', 'socket']);
                const sidebar = document.getElementById('filter-sidebar');
                const socketGroup = Array.from(sidebar.querySelectorAll('.filter-btn-group h4'))
                    .find(h4 => h4.textContent === 'Socket');
                if (socketGroup) {
                    socketGroup.parentElement.remove();
                }
                const allSockets = Array.from(new Set(cpuCoolers.flatMap(cooler => cooler.socket_list)));
                const group = document.createElement('div');
                group.className = 'filter-btn-group';
                const label = document.createElement('h4');
                label.textContent = 'Socket';
                group.appendChild(label);

                allSockets.forEach(socket => {
                    const btn = document.createElement('button');
                    btn.className = 'filter-btn';
                    btn.textContent = socket;
                    btn.onclick = () => {
                        sidebar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        customSocketFilter('socket', socket);
                    };
                    group.appendChild(btn);
                });

                // Add reset button
                const resetBtn = document.createElement('button');
                resetBtn.className = 'filter-btn';
                resetBtn.textContent = 'All';
                resetBtn.onclick = () => {
                    sidebar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    resetBtn.classList.add('active');
                    Array.from(tbody.children).forEach(tr => tr.style.display = '');
                };
                group.appendChild(resetBtn);

                sidebar.appendChild(group);

                builderTitle.textContent = "Add CPU Cooler";
                document.getElementById('filter-sidebar').style.display = 'block';

                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedCpuCooler = cpuCoolers[idx];
                        saveSelectedParts();
                        cpuCoolerTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showPsuSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.remove('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.add('psu-gap');
        document.querySelector('.builder-main-row').classList.remove('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
        const psuTable = document.getElementById('psu-table');
        document.getElementById('gpu-table').style.display = "none";
        document.getElementById('cpu-table').style.display = "none";
        document.getElementById('motherboard-table').style.display = "none";
        document.getElementById('ram-table').style.display = "none";
        document.getElementById('ssd-table').style.display = "none";
        document.getElementById('cpu_cooler-table').style.display = "none";
        document.getElementById('psu-table').style.display = "table";
        fetch('http://localhost:5000/api/psus')
            .then(response => response.json())
            .then(psus => {
                const tbody = psuTable.querySelector('tbody');
                tbody.innerHTML = "";
                psus.forEach((psu, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <a href="#" class="part-detail-link" data-type="powersupply" data-part='${JSON.stringify(psu)}'>
                                <img src="${psu.image_url}" alt="${psu.name}" class="img">
                                <span>${psu.name}</span>
                            </a>
                        </td>
                        <td>${psu.manufacturer}</td>
                        <td>${psu.wattage} W</td>
                        <td>${psu.efficiency_rating}</td>
                        <td>${psu.form_factor}</td>
                        <td>${EURO.format(psu.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a Powersupply";
                setupFilter(tbody, psus, ['name', 'manufacturer', 'wattage', 'efficiency_rating', 'form_factor']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedPsu = psus[idx];
                        saveSelectedParts();
                        psuTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    function showCaseSelection() {
        selectedGpuDiv.style.display = "none";
        document.querySelector('.builder-main-row').classList.remove('filter-bar-gap');
        document.querySelector('.builder-main-row').classList.remove('psu-gap');
        document.querySelector('.builder-main-row').classList.add('case-gap');
        document.querySelector('.builder-main-row').classList.remove('cpu-cooler-gap');
        const pcCaseTable = document.getElementById('case-table');
        document.getElementById('gpu-table').style.display = "none";
        document.getElementById('cpu-table').style.display = "none";
        document.getElementById('motherboard-table').style.display = "none";
        document.getElementById('ram-table').style.display = "none";
        document.getElementById('ssd-table').style.display = "none";
        document.getElementById('cpu_cooler-table').style.display = "none";
        document.getElementById('psu-table').style.display = "none";
        pcCaseTable.style.display = "table";
        let subtitle = document.getElementById('case-subtitle');
        const filterBar = document.getElementById('filter-bar');
        if (!subtitle) {
            subtitle = document.createElement('div');
            subtitle.id = 'case-subtitle';
            subtitle.textContent = "All Cases are Available in Black and White.";
            filterBar.parentNode.insertBefore(subtitle, filterBar);
        }
        subtitle.style.display = "block";
        pcCaseTable.style.display = "table";
        fetch('http://localhost:5000/api/cases')
            .then(response => response.json())
            .then(pcCases => {
                pcCases.forEach(pcCase => {
                    pcCase.front_panel_port_amounts = [];
                    pcCase.front_panel_port_types = [];
                    if (pcCase.front_panel_ports) {
                        pcCase.front_panel_ports.split(',').forEach(port => {
                            const match = port.match(/^(\d+)[×x*]\s*(.+)$/i);
                            if (match) {
                                pcCase.front_panel_port_amounts.push(match[1]);
                                pcCase.front_panel_port_types.push(match[2].trim());
                            } else {
                                pcCase.front_panel_port_amounts.push('1');
                                pcCase.front_panel_port_types.push(port.trim());
                            }
                        });
                    }

                    pcCase.drive_bay_amounts = [];
                    pcCase.drive_bay_types = [];
                    if (pcCase.drive_bays) {
                        pcCase.drive_bays.split('+').forEach(bay => {
                            const match = bay.match(/^(\d+)[×x*]\s*(.+)$/i);
                            if (match) {
                                pcCase.drive_bay_amounts.push(match[1]);
                                pcCase.drive_bay_types.push(match[2].trim());
                            } else {
                                pcCase.drive_bay_amounts.push('1');
                                pcCase.drive_bay_types.push(bay.trim());
                            }
                        });
                    }
                });

                const tbody = pcCaseTable.querySelector('tbody');
                tbody.innerHTML = "";
                pcCases.forEach((pcCase, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>
                            <a href="#" class="part-detail-link" data-type="case" data-part='${JSON.stringify(pcCase)}'>
                                <img src="${pcCase.image_url}" alt="${pcCase.name}" class="img">
                                <span>${pcCase.name}</span>
                            </a>
                        </td>
                        <td>${pcCase.manufacturer}</td>
                        <td>${pcCase.form_factor}</td>
                        <td>${pcCase.drive_bays}</td>
                        <td>${pcCase.expansion_slots}</td>
                        <td>${pcCase.front_panel_ports}</td>
                        <td>${EURO.format(pcCase.price)}</td>
                        <td><a class="select-btn" data-idx="${idx}">Add</a></td>
                    `;
                    tbody.appendChild(tr);
                });
                builderTitle.textContent = "Add a Case";
                setupFilter(tbody, pcCases, ['name', 'manufacturer', 'form_factor', 'drive_bay_amounts', 'drive_bay_types', 'expansion_slots', 'front_panel_port_amounts', 'front_panel_port_types']);
                document.getElementById('filter-sidebar').style.display = 'block';
                // Add event listeners
                tbody.querySelectorAll('.select-btn').forEach((btn) => {
                    btn.addEventListener('click', function() {
                        const idx = btn.getAttribute('data-idx');
                        selectedCase = pcCases[idx];
                        saveSelectedParts();
                        pcCaseTable.style.display = "none";
                        selectedGpuDiv.style.display = "flex";
                        builderTitle.textContent = "PC Builder";
                        renderSelectedTable();
                    });
                });
                tbody.querySelectorAll('.part-detail-link').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const partType = this.getAttribute('data-type');
                        const partData = JSON.parse(this.getAttribute('data-part'));
                        sessionStorage.setItem('selectedPartDetail', JSON.stringify({ type: partType, data: partData }));
                        sessionStorage.setItem('fromSelectionTable', 'true');
                        window.location.href = 'pc-part-detail.html';
                    });
                });
            });
    }

    // Initial render
    renderSelectedTable();
});