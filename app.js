let deductionCount = 0;

function addDeduction() {
    deductionCount++;
    const deductionList = document.getElementById('deductionList');
    const deductionItem = document.createElement('div');
    deductionItem.className = 'deduction-item';
    deductionItem.id = `deduction-${deductionCount}`;
    deductionItem.innerHTML = `
        <input type="number" name="deduction" placeholder="Jumlah Potongan (RM)" required>
        <button type="button" onclick="removeDeduction(${deductionCount})">Buang</button>
    `;
    deductionList.appendChild(deductionItem);
}

function removeDeduction(id) {
    const deductionItem = document.getElementById(`deduction-${id}`);
    deductionItem.remove();
}

document.getElementById('zakatForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const pendapatan = parseFloat(document.getElementById('pendapatan').value);
    const negeri = document.getElementById('negeri').value;

     if (isNaN(pendapatan) || pendapatan <= 0) {
        alert('Sila masukkan jumlah pendapatan yang sah.');
        return;
    }

    let nisab;
    switch (negeri) {
        case '1': // Johor
            nisab = 15000;
            break;
        case '2': // Kedah
            nisab = 14000;
            break;
        case '3': // Kelantan
            nisab = 13000;
            break;
        case '4': // Melaka
            nisab = 16000;
            break;
        case '5': // Negeri Sembilan
            nisab = 15000;
            break;
        case '6': // Pahang
            nisab = 14500;
            break;
        case '7': // Perak
            nisab = 13500;
            break;
        case '8': // Perlis
            nisab = 12500;
            break;
        case '9': // Pulau Pinang
            nisab = 15500;
            break;
        case '10': // Sabah
            nisab = 12000;
            break;
        case '11': // Sarawak
            nisab = 14000;
            break;
        case '12': // Selangor
            nisab = 15000;
            break;
        case '13': // Terengganu
            nisab = 13000;
            break;
        case '14': // WP Kuala Lumpur
            nisab = 15000;
            break;
        case '15': // WP Labuan
            nisab = 14000;
            break;
        case '16': // WP Putrajaya
            nisab = 15000;
            break;
        default:
            nisab = 0; // Default value
    }

    let totalDeductions = 0;
    for (const [key, item] of Object.entries(items)) {
        if (key === 'kwsp') {
            totalDeductions += pendapatan * 0.11;
        } else if (key === 'isteri') {
            totalDeductions += Math.min(4, item.quantity) * 4000; // Max 4 wives
        } else if (key === 'anak') {
            totalDeductions += item.quantity * 2000;
        } else if (item.amount) {
            totalDeductions += item.quantity * parseFloat(item.amount);
        }
    }
    const manualDeductions = document.getElementsByName('deduction');
manualDeductions.forEach(deduction => {
const value = parseFloat(deduction.value);
if (!isNaN(value) && value > 0) {
    totalDeductions += value;
}
});

const netPendapatan = pendapatan - totalDeductions;
let zakat = netPendapatan >= nisab ? netPendapatan * 0.025 : 0;

document.getElementById('pendapatanResult').innerHTML = `
Jumlah Pendapatan Tahunan: RM ${pendapatan.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>
Jumlah Potongan: RM ${totalDeductions.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}<br>
Pendapatan Bersih: RM ${netPendapatan.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
`;
document.getElementById('zakatResult').innerText = `Jumlah Zakat Yang Perlu Dibayar: RM ${zakat.toLocaleString('en-MY', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
document.getElementById('result').style.display = 'block';
});

document.getElementById('zakatForm').addEventListener('reset', function() {
document.getElementById('result').style.display = 'none';
items = {};
renderItems();
document.getElementById('showDeductions').checked = false;
document.getElementById('deductionsContainer').style.display = 'none';
});
let items = {};

document.getElementById('showDeductions').addEventListener('change', function(e) {
document.getElementById('deductionsContainer').style.display = 
e.target.checked ? 'block' : 'none';
});

document.querySelectorAll('.add-button').forEach(button => {
button.addEventListener('click', () => {
const item = button.dataset.item;
if (!items[item]) {
    items[item] = {
        type: item,
        amount: button.dataset.amount || 0,
        quantity: 1
    };
    if (item === 'sumbangan' || item === 'tabunghaji' || item === 'takaful') {
        items[item].amount = 0; // Initialize custom amount to 0
    }
    renderItems();
    }
});
});

function renderItems() {
const selectedDeductions = document.querySelector('.selected-deductions');
selectedDeductions.innerHTML = '';

for (const [key, item] of Object.entries(items)) {
const div = document.createElement('div');
div.className = 'deduction-item';

let controls = '';
if (key === 'kwsp') {
    const amount = document.getElementById('pendapatan').value * 0.11;
    controls = `
        <span>RM${amount.toFixed(2)}</span>
        <button class="remove-btn" data-item="${key}">×</button>
    `;
} else if (key === 'isteri' || key === 'anak') {
    const maxValue = key === 'isteri' ? 4 : 99;
    const amount = key === 'isteri' ? 4000 : 2000;
    controls = `
        <div class="modern-quantity">
            <button class="quantity-btn minus" data-item="${key}">−</button>
            <input type="number" class="quantity-input" value="${item.quantity}" 
                data-item="${key}" min="1" max="${maxValue}">
            <button class="quantity-btn plus" data-item="${key}" 
                ${key === 'isteri' && item.quantity >= 4 ? 'disabled style="opacity: 0.5;"' : ''}>+</button>
            <span class="quantity-label">RM${(item.quantity * amount).toFixed(2)}</span>
        </div>
        <button class="remove-btn" data-item="${key}">×</button>
    `;
} else if (key === 'sumbangan' || key === 'tabunghaji' || key === 'takaful') {
    controls = `
        <div class="modern-quantity">
            <input type="number" class="amount-input" value="${item.amount || 0}" 
                data-item="${key}" min="0" step="100" placeholder="Masukkan jumlah (RM)">
            <span class="quantity-label">RM${(parseFloat(item.amount) || 0).toFixed(2)}</span>
        </div>
        <button class="remove-btn" data-item="${key}">×</button>
    `;
}

div.innerHTML = `
    <span>${formatLabel(key)}</span>
    <div style="display: flex; align-items: center; gap: 10px;">
        ${controls}
    </div>
`;

selectedDeductions.appendChild(div);
}

addDeductionControlListeners();
}

function formatLabel(key) {
const labels = {
isteri: 'Isteri',
anak: 'Anak',
kwsp: 'KWSP',
sumbangan: 'Sumbangan Ibu Bapa',
tabunghaji: 'Tabung Haji',
takaful: 'Takaful'
};
return labels[key];
}

function addDeductionControlListeners() {
document.querySelectorAll('.quantity-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
    const itemKey = e.target.dataset.item;
    if (btn.classList.contains('plus')) {
        items[itemKey].quantity++;
    } else {
        items[itemKey].quantity = Math.max(1, items[itemKey].quantity - 1);
    }
    renderItems();
});
});

document.querySelectorAll('.quantity-input').forEach(input => {
input.addEventListener('change', (e) => {
    const itemKey = e.target.dataset.item;
    items[itemKey].quantity = Math.max(1, parseInt(e.target.value) || 1);
    renderItems();
});
});

document.querySelectorAll('.remove-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
    delete items[e.target.dataset.item];
    renderItems();
});
});

// Add amount input listeners
document.querySelectorAll('.amount-input').forEach(input => {
input.addEventListener('input', (e) => {
    const itemKey = e.target.dataset.item;
    const value = parseFloat(e.target.value) || 0;
    items[itemKey].amount = value;
    renderItems();
});
});

// Add amount input listener for custom deductions
document.querySelectorAll('.amount-input').forEach(input => {
input.addEventListener('input', (e) => {
    const itemKey = e.target.dataset.item;
    const value = parseFloat(e.target.value) || 0;
    items[itemKey].amount = value;
    renderItems();
});
});
}

document.getElementById('pendapatan').addEventListener('input', renderItems);