function handleInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculate();
}

function addRow() {
    const container = document.getElementById('dynamic-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="Other Allowance" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="salary-input" placeholder="0" oninput="handleInput(this)">
            <button type="button" class="btn-del" onclick="this.closest('.tr').remove(); calculate();">×</button>
        </div>
    `;
    container.appendChild(row);
}

function calculate() {
    const inputs = document.querySelectorAll('.salary-input');
    let totalGross = 0;

    inputs.forEach(input => {
        let val = Number(input.value.replace(/,/g, "")) || 0;
        totalGross += val;
    });

    // Bangladesh Tax Law: Lower of (1/3 of Total) or (500,000)
    let exempted = Math.min(totalGross / 3, 500000);
    let taxable = totalGross - exempted;

    // Set Values with rounding and formatting
    document.getElementById('total-gross').innerText = Math.round(totalGross).toLocaleString();
    document.getElementById('exempted-amount').innerText = `(${Math.round(exempted).toLocaleString()})`;
    document.getElementById('taxable-employment').innerText = Math.round(taxable).toLocaleString();
    updateGrandSummary()
}

//****************Income from Rent************************

/**
 * 1. Handling Input with Commas
 */
function handleRentInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateRent();
}

/**
 * 2. Helper to get numeric values
 */
function getRentNum(id) {
    let val = document.getElementById(id).value.replace(/,/g, "");
    return Math.round(Number(val) || 0);
}

/**
 * 3. Main Calculation Step-by-Step
 */
function calculateRent() {
    // Step 1: Annual Value
    const grossRent = getRentNum('r-gross-rent');
    const vacancy = getRentNum('r-vacancy');
    const annualValue = Math.max(0, grossRent - vacancy);

    // Step 2: Deductions
    // Repair & Maintenance based on Property Type
    const rnmRate = parseFloat(document.getElementById('r-prop-type').value);
    const repairAndMaint = annualValue * rnmRate;

    const munTax = getRentNum('r-mun-tax');
    const landRev = getRentNum('r-land-revenue');
    const loanInterest = getRentNum('r-loan-interest');
    const insurance = getRentNum('r-insurance');

    const totalDeductions = repairAndMaint + munTax + landRev + loanInterest + insurance;

    // Step 3: Net Income
    const netRentalIncome = Math.max(0, annualValue - totalDeductions);

    // Update UI Boxes (Rounding and Commas)
    document.getElementById('r-annual-value').innerText = Math.round(annualValue).toLocaleString();
    document.getElementById('r-total-deductions').innerText = `(${Math.round(totalDeductions).toLocaleString()})`;
    document.getElementById('r-net-rent').innerText = Math.round(netRentalIncome).toLocaleString();
    updateGrandSummary()
}

//************Income from Rent */

//************Income from Agriculture */
/**
 * 1. Handling Input with Commas
 */
function handleAgriInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateAgri();
}

/**
 * 2. Helper to get numeric values
 */
function getAgriNum(id) {
    let val = document.getElementById(id).value.replace(/,/g, "");
    return Math.round(Number(val) || 0);
}

/**
 * 3. Calculation Logic
 */
function calculateAgri() {
    const cropSale = getAgriNum('ag-crop-sale');
    const borgaIncome = getAgriNum('ag-borga');

    // Step 1: Gross Income (Total of both)
    const grossIncome = cropSale + borgaIncome;

    // Step 2: Production Cost (Rule: 60% of crop sales ONLY)
    const productionCost = cropSale * 0.60;

    // Step 3: Taxable Income
    const taxableIncome = grossIncome - productionCost;

    // Update UI Boxes
    document.getElementById('ag-gross-income').innerText = Math.round(grossIncome).toLocaleString();
    document.getElementById('ag-prod-cost').innerText = `(${Math.round(productionCost).toLocaleString()})`;
    document.getElementById('ag-taxable-income').innerText = Math.round(taxableIncome).toLocaleString();
    updateGrandSummary()
}

//***************Agriculture Income section end */

//**************Income from Business */
/**
 * 1. Handling Input with Commas
 */
function handleBusinessInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateBusiness();
}

/**
 * 2. Add New Business Row
 */
function addBusinessRow() {
    const container = document.getElementById('business-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="Source Name" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="business-input salary-input" placeholder="0" oninput="handleBusinessInput(this)">
            <button type="button" class="btn-del" onclick="removeBusinessRow(this)">×</button>
        </div>
    `;
    container.appendChild(row);
}

/**
 * 3. Remove Business Row
 */
function removeBusinessRow(btn) {
    btn.closest('.tr').remove();
    calculateBusiness();
}

/**
 * 4. Calculation Logic
 */
function calculateBusiness() {
    const inputs = document.querySelectorAll('.business-input');
    let totalBusiness = 0;

    inputs.forEach(input => {
        let val = Number(input.value.replace(/,/g, "")) || 0;
        totalBusiness += val;
    });

    // Update the result box with rounding and commas
    document.getElementById('total-business-income').innerText = Math.round(totalBusiness).toLocaleString();
    updateGrandSummary()
}

//**********Business Income End */

//********Capital Gain Starts */
/**
 * 1. Handling Input with Commas
 */
function handleCGInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateCG();
}

/**
 * 2. Helper to get numeric values
 */
function getCGNum(id) {
    let val = document.getElementById(id).value.replace(/,/g, "");
    return Math.round(Number(val) || 0);
}

/**
 * 3. Add/Remove Dynamic Rows
 */
function addCGRow() {
    const container = document.getElementById('cg-dynamic-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="Other Asset" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="cg-input salary-input" placeholder="0" oninput="handleCGInput(this)">
            <button type="button" class="btn-del" onclick="this.closest('.tr').remove(); calculateCG();">×</button>
        </div>
    `;
    container.appendChild(row);
}

/**
 * 4. Calculation Logic
 */
function calculateCG() {
    // Share Logic: Only amount exceeding 5,000,000 is taxable
    const rawShareGain = getCGNum('cg-share-raw');
    const shareExemption = Math.min(rawShareGain, 5000000);
    const taxableShareGain = Math.max(0, rawShareGain - shareExemption);
    
    // Update Share Exemption Display
    document.getElementById('cg-share-exempt').innerText = `(${Math.round(shareExemption).toLocaleString()})`;

    // Sum other static inputs
    let totalCG = getCGNum('cg-land') + taxableShareGain + getCGNum('cg-mach-old') + getCGNum('cg-mach-new');

    // Sum dynamic inputs
    const dynamicInputs = document.querySelectorAll('#cg-dynamic-rows .cg-input');
    dynamicInputs.forEach(input => {
        totalCG += Number(input.value.replace(/,/g, "")) || 0;
    });

    // Update the final result box
    document.getElementById('total-cg-income').innerText = Math.round(totalCG).toLocaleString();
    updateGrandSummary()
}

//*********CP End */

//********Financial Assets Income */
/**
 * 1. Handling Input with Commas
 */
function handleFinInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateFinancial();
}

/**
 * 2. Helper to get numeric values
 */
function getFinNum(id) {
    let val = document.getElementById(id).value.replace(/,/g, "");
    return Math.round(Number(val) || 0);
}

/**
 * 3. Add/Remove Dynamic Rows
 */
function addFinRow() {
    const container = document.getElementById('fin-dynamic-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="e.g., Bond Interest" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="fin-input salary-input" placeholder="0" oninput="handleFinInput(this)">
            <button type="button" class="btn-del" onclick="this.closest('.tr').remove(); calculateFinancial();">×</button>
        </div>
    `;
    container.appendChild(row);
}

/**
 * 4. Calculation Logic
 */
function calculateFinancial() {
    let totalFin = 0;
    
    // Sum all inputs with class 'fin-input' (Static + Dynamic)
    const allInputs = document.querySelectorAll('.fin-input');
    allInputs.forEach(input => {
        let val = Number(input.value.replace(/,/g, "")) || 0;
        totalFin += val;
    });

    // Update the final result box with rounding and commas
    document.getElementById('total-fin-income').innerText = Math.round(totalFin).toLocaleString();
    updateGrandSummary()
}

//********Financial Asset end********

//*******Other sources */
/**
 * 1. Handling Input with Commas
 */
function handleOtherInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateOtherSources();
}

/**
 * 2. Add New Row
 */
function addOtherRow() {
    const container = document.getElementById('other-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="Source Name" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="other-input salary-input" placeholder="0" oninput="handleOtherInput(this)">
            <button type="button" class="btn-del" onclick="removeOtherRow(this)">×</button>
        </div>
    `;
    container.appendChild(row);
}

/**
 * 3. Remove Row
 */
function removeOtherRow(btn) {
    btn.closest('.tr').remove();
    calculateOtherSources();
}

/**
 * 4. Calculation Logic
 */
function calculateOtherSources() {
    const inputs = document.querySelectorAll('.other-input');
    let totalOther = 0;

    inputs.forEach(input => {
        let val = Number(input.value.replace(/,/g, "")) || 0;
        totalOther += val;
    });

    // Update the result box with rounding and commas
    document.getElementById('total-other-income').innerText = Math.round(totalOther).toLocaleString();
    updateGrandSummary()
}

//*********ENd */

//************Spouse or Minor Kid */
/**
 * 1. Handling Input with Commas
 */
function handleSpouseMinorInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateSpouseMinor();
}

/**
 * 2. Add New Row
 */
function addSpouseMinorRow() {
    const container = document.getElementById('spouse-minor-rows');
    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML = `
        <input type="text" placeholder="Source Name" style="flex:2; border:none; border-bottom:1px solid #eee; outline:none; margin-right:10px;">
        <div class="amount-with-del">
            <input type="text" class="spouse-minor-input salary-input" placeholder="0" oninput="handleSpouseMinorInput(this)">
            <button type="button" class="btn-del" onclick="this.closest('.tr').remove(); calculateSpouseMinor();">×</button>
        </div>
    `;
    container.appendChild(row);
}

/**
 * 3. Remove Row
 */
function removeSpouseMinorRow(btn) {
    btn.closest('.tr').remove();
    calculateSpouseMinor();
}

/**
 * 4. Calculation Logic
 */
function calculateSpouseMinor() {
    const inputs = document.querySelectorAll('.spouse-minor-input');
    let totalAggregated = 0;

    inputs.forEach(input => {
        let val = Number(input.value.replace(/,/g, "")) || 0;
        totalAggregated += val;
    });

    // Update the result box with rounding and commas
    document.getElementById('total-spouse-minor-income').innerText = Math.round(totalAggregated).toLocaleString();
    updateGrandSummary()
}

//************END */

//******TOTAL INCOME SUMMARY REVIEW  */
function updateGrandSummary() {
    // 1. Collect totals from all IDs defined in previous sections
    const heads = [
        { id: "taxable-employment", row: "sum-row-1", val: "sum-val-1" },
        { id: "r-net-rent", row: "sum-row-2", val: "sum-val-2" },
        { id: "ag-taxable-income", row: "sum-row-3", val: "sum-val-3" },
        { id: "total-business-income", row: "sum-row-4", val: "sum-val-4" },
        { id: "total-cg-income", row: "sum-row-5", val: "sum-val-5" },
        { id: "total-fin-income", row: "sum-row-6", val: "sum-val-6" },
        { id: "total-other-income", row: "sum-row-7", val: "sum-val-7" },
        { id: "total-spouse-minor-income", row: "sum-row-8", val: "sum-val-8" }
    ];

    let grandTotal = 0;

    heads.forEach(head => {
        // Get the value from the specific head's result box
        let textVal = document.getElementById(head.id).innerText.replace(/,/g, "");
        let value = Math.round(Number(textVal) || 0);

        // Update the summary row value
        document.getElementById(head.val).innerText = value.toLocaleString('en-US');

        // Toggle visibility: If 0, hide; If > 0, show
        if (value > 0) {
            document.getElementById(head.row).style.display = "flex";
            grandTotal += value;
        } else {
            document.getElementById(head.row).style.display = "none";
        }
    });

    // 2. Update Grand Total Box
    document.getElementById('grand-total-income').innerText = Math.round(grandTotal).toLocaleString('en-US');
}

/** * IMPORTANT: You must call updateGrandSummary() at the end of 
 * every individual section's calculate function.
 * Example: In calculateAgri(), add updateGrandSummary() at the bottom.
 */

//*****************END******** */

//*****************Invstment************* */

function handleRebateInput(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
    calculateTaxRebate();
}

function getVal(id) {
    let el = document.getElementById(id);
    let val = (el.tagName === "SPAN") ? el.innerText : el.value;
    return Math.round(Number(val.replace(/,/g, "")) || 0);
}

function calculateTaxRebate() {
    // 1. Insurance Logic: Lower of Paid or 10% of Policy
    let insPaid = getVal('ins-paid');
    let insPolicyTenPercent = getVal('ins-policy') * 0.10;
    let allowableInsurance = Math.min(insPaid, insPolicyTenPercent);
    document.getElementById('res-insurance').innerText = Math.round(allowableInsurance).toLocaleString();

    // 2. Capped Investments
    let sanchay = Math.min(getVal('reb-sanchay'), 500000);
    let fdr = Math.min(getVal('reb-fdr'), 120000);
    
    // 3. Total Allowable Investment
    let actualInvestment = getVal('reb-rpf') + allowableInsurance + sanchay + fdr + getVal('reb-shares');

    // 4. Comparison Logic
    // Pull Grand Total from the Summary Card we built earlier
    let totalTaxableIncome = getVal('grand-total-income'); 
    
    let opt1 = actualInvestment * 0.15;
    let opt2 = totalTaxableIncome * 0.03;
    let opt3 = 1000000;

    // Determine the lower of three
    let finalRebate = Math.min(opt1, opt2, opt3);

    // Update UI
    document.getElementById('reb-opt-1').innerText = Math.round(opt1).toLocaleString();
    document.getElementById('reb-opt-2').innerText = Math.round(opt2).toLocaleString();
    document.getElementById('final-rebate-amount').innerText = Math.round(finalRebate).toLocaleString();
}
//******************Rebate Calculation END******** */

//******************Tax Liablity Calculation */
function formatV6(el) {
    let val = el.value.replace(/[^0-9]/g, "");
    el.value = val ? Number(val).toLocaleString('en-US') : "";
}

function runV6FinalCalculation() {
    // 1. DATA GATHERING
    const totalTaxable = getVal('grand-total-income');
    const actualRebate = getVal('final-rebate-amount');

    // 2. SEGREGATION (V6 Logic)
    // B = C1 (Shares > 5M) + C2 (Machinery > 5y)
    const c1_shares = Math.max(0, getVal('cg-share-raw') - 5000000);
    const c2_mach = getVal('cg-mach-old');
    const capGainB = c1_shares + c2_mach;

    // C = Minimum Tax (FDR, Savings, Dividend)
    const minTaxC = getVal('fin-fdr') + getVal('fin-savings') + getVal('fin-dividend');

    // D = Final Settlement (Land + Sanchaypatra)
    const finalD = getVal('cg-land') + getVal('fin-sanchay');

    // A = Regular (Remaining)
    const regularA = Math.max(0, totalTaxable - (capGainB + minTaxC + finalD));

    // Update Segregation UI
    setV6UI('v6-seg-a', regularA);
    setV6UI('v6-seg-b', capGainB);
    setV6UI('v6-seg-c', minTaxC);
    setV6UI('v6-seg-d', finalD);
    document.getElementById('v6-segregation-card').style.display = "block";

    // 3. SLAB CALCULATION (A + C)
    const slabBasis = regularA + minTaxC;
    const slabData = computeV6Slabs(slabBasis);
    
    // 4. TAX COMPUTATION
    const cgTax = capGainB * 0.15;
    const grossTax = slabData.totalTax + cgTax;
    const netTax_i = Math.max(0, grossTax - actualRebate);

    // 5. TAX PAID (ii)
    const tdsSanchay = getVal('fin-sanchay') * 0.10;
    const tdsFdr = getVal('fin-fdr') * 0.10;
    const tdsSavings = (getVal('fin-savings') + getVal('fin-dividend')) * 0.10;
    const tdsLand = getVal('v6-land-tds');
    const aitSalary = getVal('v6-salary-ait');
    const aitOther = getVal('v6-other-ait');

    const totalPaid_ii = tdsSanchay + tdsFdr + tdsSavings + tdsLand + aitSalary + aitOther;
    const ultimateSettlement = netTax_i - totalPaid_ii;

    // UI UPDATES
    document.getElementById('v6-slab-container').innerHTML = slabData.html;
    setV6UI('v6-cgtax', cgTax);
    setV6UI('v6-gross-total', grossTax);
    setV6UI('v6-rebate', actualRebate);
    setV6UI('v6-net-i', netTax_i);

    setV6UI('v6-tds-sanchay', tdsSanchay);
    setV6UI('v6-tds-land', tdsLand);
    setV6UI('v6-tds-fdr', tdsFdr);
    setV6UI('v6-tds-savings', tdsSavings);
    setV6UI('v6-tds-salary', aitSalary);
    setV6UI('v6-tds-other', aitOther);
    setV6UI('v6-total-paid-ii', totalPaid_ii);

    const finalValEl = document.getElementById('v6-final-val');
    finalValEl.innerText = Math.abs(Math.round(ultimateSettlement)).toLocaleString();
    
    if (ultimateSettlement >= 0) {
        document.getElementById('v6-final-label').innerText = "Income Tax Payable (Payable)";
        finalValEl.style.color = "#27ae60";
    } else {
        document.getElementById('v6-final-label').innerText = "Income Tax Refundable (Refund)";
        finalValEl.style.color = "#d63031";
    }

    document.getElementById('v6-computation-card').style.display = "block";
}

function computeV6Slabs(total) {
    const slabs = [
        { label: "1st Up to Tk.", limit: 350000, rate: 0 },
        { label: "On next Remaining", limit: 100000, rate: 0.05 },
        { label: "On next Remaining", limit: 400000, rate: 0.10 },
        { label: "On next Remaining", limit: 500000, rate: 0.15 },
        { label: "On next Remaining", limit: 500000, rate: 0.20 },
        { label: "On next Remaining", limit: 100000, rate: 0.25 },
        { label: "On rest", limit: Infinity, rate: 0.30 }
    ];
    let remaining = total;
    let totalTax = 0;
    let html = "";
    slabs.forEach(s => {
        let chunk = Math.min(Math.max(0, remaining), s.limit);
        let tax = chunk * s.rate;
        totalTax += tax;
        remaining -= chunk;
        if(chunk > 0 || s.limit === 350000) {
            html += `<div class="tr"><label>${s.label} ${s.limit === Infinity ? 'Rest' : s.limit.toLocaleString()}</label><span>${Math.round(tax).toLocaleString()}</span></div>`;
        }
    });
    return { totalTax, html };
}

function setV6UI(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = Math.round(val).toLocaleString();
}

//************TAX Calculation END */