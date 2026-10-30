// diagnostics.js - Car Diagnostics & Restoration Advisor

export function renderDiagnostics() {
  // Static form is already in HTML – just ensure results are cleared on first load
  const results = document.getElementById('diag-results');
  if (results) results.classList.add('d-none');
}

export function runDiagnosis() {
  const make = document.getElementById('diag-make').value.trim();
  const model = document.getElementById('diag-model').value.trim();
  const year = parseInt(document.getElementById('diag-year').value) || 0;
  const mileage = parseInt(document.getElementById('diag-mileage').value) || 0;
  const condition = document.getElementById('diag-condition').value;

  // Collect selected symptoms
  const symptoms = [];
  document.querySelectorAll('#diag-symptoms input[type="checkbox"]:checked').forEach(cb => {
    symptoms.push(cb.value);
  });

  if (!make || !model || !year) {
    alert('Please enter at least Make, Model and Year.');
    return;
  }

  const age = new Date().getFullYear() - year;
  const recommendations = generateRecommendations({ make, model, year, age, mileage, condition, symptoms });

  displayResults(make, model, year, mileage, recommendations);
}

function generateRecommendations({ make, model, year, age, mileage, condition, symptoms }) {
  const recs = {
    priority: [],      // Must do soon
    recommended: [],   // Should do
    optional: [],      // Nice to have for like-new
    notes: []
  };

  // --- Mileage-based services ---
  if (mileage >= 10000 && mileage < 30000) {
    recs.recommended.push('Minor service (oil + filter change)');
  }
  if (mileage >= 30000) {
    recs.priority.push('Full service (oil, filters, spark plugs if petrol)');
  }
  if (mileage >= 60000) {
    recs.priority.push('Timing belt / chain inspection or replacement');
    recs.recommended.push('Transmission fluid change');
  }
  if (mileage >= 90000) {
    recs.priority.push('Major service + coolant flush');
    recs.recommended.push('Fuel system clean / injector service');
  }
  if (mileage >= 120000) {
    recs.priority.push('Thorough inspection of suspension, mounts and engine seals');
  }

  // --- Age-based ---
  if (age >= 5) {
    recs.recommended.push('Battery test & possible replacement');
    recs.recommended.push('Brake fluid flush (every 2–3 years)');
  }
  if (age >= 8) {
    recs.recommended.push('Air-conditioning service & regas');
    recs.optional.push('Rubber bushes and mounts inspection');
  }
  if (age >= 12) {
    recs.priority.push('Full underbody inspection for rust');
    recs.recommended.push('Radiator and cooling system check');
  }
  if (age >= 15) {
    recs.priority.push('Comprehensive restoration assessment recommended');
    recs.notes.push('Vehicles older than 15 years often need body, interior and mechanical attention to feel “like new”.');
  }

  // --- Condition based ---
  if (condition === 'Poor') {
    recs.priority.push('Full mechanical inspection before any major spend');
    recs.priority.push('Address safety items first (brakes, tyres, lights, steering)');
  }
  if (condition === 'Fair') {
    recs.recommended.push('Focus on reliability items first, then cosmetics');
  }

  // --- Symptom-based advice ---
  const symptomMap = {
    'engine-noise': 'Engine noise – check valve clearances, timing chain/belt, oil pressure and mounts',
    'smoke': 'Exhaust smoke – blue = oil burning, white = coolant, black = rich mixture. Needs diagnosis',
    'overheating': 'Overheating – check radiator, water pump, thermostat, coolant level and head gasket',
    'vibration': 'Vibration – inspect engine mounts, wheels balance/alignment, driveshafts and tyres',
    'brake-issues': 'Brake issues – inspect pads, discs, fluid, calipers and ABS sensors',
    'electrical': 'Electrical problems – test battery, alternator, starter and check for parasitic drain',
    'ac-not-cold': 'A/C not cold – check gas level, compressor, condenser and cabin filter',
    'rust': 'Rust present – treat and repair body panels, sills, wheel arches and underbody',
    'oil-leak': 'Oil leaks – inspect valve cover gasket, sump, oil filter housing and rear main seal',
    'rough-idle': 'Rough idle – clean throttle body, check spark plugs, injectors and vacuum leaks',
    'hard-start': 'Hard starting – test battery, starter, fuel pressure and glow plugs (diesel)',
    'warning-light': 'Warning light on – scan for fault codes (OBD-II) before guessing'
  };

  symptoms.forEach(s => {
    if (symptomMap[s]) {
      recs.priority.push(symptomMap[s]);
    }
  });

  // --- Make/Model specific common tips (examples) ---
  const makeLower = make.toLowerCase();
  if (makeLower.includes('toyota') || makeLower.includes('lexus')) {
    recs.notes.push('Toyota/Lexus: Generally very reliable. Focus on regular oil changes and water pump/timing on higher mileage models.');
  }
  if (makeLower.includes('bmw') || makeLower.includes('mercedes') || makeLower.includes('audi')) {
    recs.notes.push('German premium: Watch for oil leaks, electronic issues, suspension components and costly service items as they age.');
  }
  if (makeLower.includes('volkswagen') || makeLower.includes('vw')) {
    recs.notes.push('Volkswagen: Check DSG service history (if applicable), water pump and carbon build-up on direct injection engines.');
  }
  if (makeLower.includes('ford') && model.toLowerCase().includes('ranger')) {
    recs.notes.push('Ford Ranger: Inspect propshaft, rear leaf springs and turbo pipes on higher mileage examples.');
  }

  // --- Path to “like new” ---
  recs.optional.push('Professional detail (paint correction + ceramic coating)');
  recs.optional.push('Interior deep clean / leather restoration');
  recs.optional.push('New tyres (if older than 5–6 years or worn)');
  recs.optional.push('Replace all fluids (brake, coolant, transmission, differential)');
  recs.optional.push('Upgrade worn interior plastics and lights if faded');

  // Remove duplicates
  recs.priority = [...new Set(recs.priority)];
  recs.recommended = [...new Set(recs.recommended)];
  recs.optional = [...new Set(recs.optional)];

  return recs;
}

function displayResults(make, model, year, mileage, recs) {
  const container = document.getElementById('diag-results');
  const content = document.getElementById('diag-results-content');

  let html = `
    <div class="mb-3">
      <h5 class="mb-1">${make} ${model} (${year})</h5>
      <p class="text-muted small mb-0">Mileage: ${mileage.toLocaleString()} km</p>
    </div>
  `;

  if (recs.priority.length) {
    html += `<div class="mb-3">
      <h6 class="text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Priority – Do These First</h6>
      <ul class="mb-0">${recs.priority.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>`;
  }

  if (recs.recommended.length) {
    html += `<div class="mb-3">
      <h6 class="text-warning"><i class="bi bi-tools"></i> Recommended</h6>
      <ul class="mb-0">${recs.recommended.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>`;
  }

  if (recs.optional.length) {
    html += `<div class="mb-3">
      <h6 class="text-success"><i class="bi bi-stars"></i> To Make It Feel Like New</h6>
      <ul class="mb-0">${recs.optional.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>`;
  }

  if (recs.notes.length) {
    html += `<div class="alert alert-info small mb-0">
      <strong>Notes:</strong><br>${recs.notes.join('<br>')}
    </div>`;
  }

  content.innerHTML = html;
  container.classList.remove('d-none');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function initDiagnostics() {
  document.getElementById('btn-run-diagnosis')?.addEventListener('click', runDiagnosis);
}