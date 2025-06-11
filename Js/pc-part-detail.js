document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('part-detail-container');
    const partDetail = JSON.parse(sessionStorage.getItem('selectedPartDetail'));
    const fromSelectionTable = sessionStorage.getItem('fromSelectionTable') === 'true';
    if (!partDetail) {
        container.innerHTML = "<p>No part selected.</p>";
        return;
    }
    const { type, data } = partDetail;

    // Generate specs
    function getSpecsHtml(type, data) {
        switch (type) {
            case 'cpu':
                return `
                    <ul class="specs">
                        <li><span>Cores:</span> ${data.core_count}</li>
                        <li><span>Threads:</span> ${data.thread_count}</li>
                        <li><span>Base Clock:</span> ${data.base_clock} MHz</li>
                        <li><span>Boost Clock:</span> ${data.boost_clock} MHz</li>
                        <li><span>Socket:</span> ${data.socket}</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                        <li><span>Integrated Graphics:</span> ${data.integrated_graphics}</li>
                    </ul>`;
            case 'gpu':
                return `
                    <ul class="specs">
                        <li><span>Memory:</span> ${data.memory_size} GB ${data.memory_type}</li>
                        <li><span>Core Clock:</span> ${data.core_clock} MHz</li>
                        <li><span>Boost Clock:</span> ${data.boost_clock} MHz</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                        <li><span>Slot:</span> ${data.slot}</li>
                    </ul>`;
            case 'motherboard':
                return `
                    <ul class="specs">
                        <li><span>Socket:</span> ${data.socket}</li>
                        <li><span>Chipset:</span> ${data.chipset}</li>
                        <li><span>Form Factor:</span> ${data.form_factor}</li>
                        <li><span>Expansion Slots:</span> ${data.expansion_slots}</li>
                        <li><span>RAM Type:</span> ${data.ram_type}</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                    </ul>`;
            case 'ram':
                return `
                    <ul class="specs">
                        <li><span>Capacity:</span> ${data.capacity} GB</li>
                        <li><span>Speed:</span> ${data.ram_speed} MHz</li>
                        <li><span>Type:</span> ${data.ram_type}</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                    </ul>`;
            case 'ssd':
                return `
                    <ul class="specs">
                        <li><span>Capacity:</span> ${data.capacity} GB</li>
                        <li><span>Form Factor:</span> ${data.form_factor}</li>
                        <li><span>Interface:</span> ${data.interface}</li>
                        <li><span>Read Speed:</span> ${data.read_speed} MB/s</li>
                        <li><span>Write Speed:</span> ${data.write_speed} MB/s</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                    </ul>`;
            case 'cpu_cooler':
                return `
                    <ul class="specs">
                        <li><span>Fan Size:</span> ${data.fan_size} mm</li>
                        <li><span>Socket:</span> ${data.socket}</li>
                        <li><span>Max RPM:</span> ${data.max_rpm}</li>
                        <li><span>Noise Level:</span> ${data.noise_level}</li>
                        <li><span>Cooling Type:</span> ${data.cooling_type}</li>
                        <li><span>TDP:</span> ${data.tdp} W</li>
                    </ul>`;
            case 'psu':
                return `
                    <ul class="specs">
                        <li><span>Wattage:</span> ${data.wattage} W</li>
                        <li><span>Efficiency:</span> ${data.efficiency_rating}</li>
                        <li><span>Form Factor:</span> ${data.form_factor}</li>
                    </ul>`;
            case 'case':
                return `
                    <ul class="specs">
                        <li><span>Form Factor:</span> ${data.form_factor}</li>
                        <li><span>Drive Bays:</span> ${data.drive_bays}</li>
                        <li><span>Expansion Slots:</span> ${data.expansion_slots}</li>
                        <li><span>Front Panel Ports:</span> ${data.front_panel_ports}</li>
                    </ul>`;
            default:
                return '';
        }
    }

    container.innerHTML = `
        <div class="product-img">
            <img src="${data.image_url}" alt="${data.name}" style="max-width:300px;">
        </div>
        <div class="prebuilt-pc-info">
            <h2 class="title">${data.name}</h2>
            <span class="price">€${data.price}</span>
            ${getSpecsHtml(type, data)}
            ${fromSelectionTable ? `
            <button class="add-button" id="add-part-btn">
                <span>Add to build</span>
            </button>
            ` : ''}
        </div>
    `;

    // Add button
    if (fromSelectionTable) {
        document.getElementById('add-part-btn').addEventListener('click', function() {
            sessionStorage.setItem('addPartToBuild', JSON.stringify({ type, data }));
            sessionStorage.removeItem('fromSelectionTable'); // Clean up
            window.location.href = 'pc-builder.html';
        });
    }
});
