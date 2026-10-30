// diagnostics.js - Car Diagnostics & Restoration Advisor (with cost ranges + loading)

export function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  const text = document.getElementById('loading-text');
  if (text) text.textContent = message;
  if (overlay) overlay.classList.add('show');
}

export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('show');
}

export function renderDiagnostics() {
  const results = document.getElementById('diag-results');
  if (results) results.classList.add('d-none');
}

export function runDiagnosis() {
  const make = document.getElementById('diag-make').value.trim();
  const model = document.getElementById('diag-model').value.trim();
  const year = parseInt(document.getElementById('diag-year').value) || 0;
  const mileage = parseInt(document.getElementById('diag-mileage').value) || 0;
  const condition = document.getElementById('diag-condition').value;

  const symptoms = [];
  document.querySelectorAll('#diag-symptoms input[type="checkbox"]:checked').forEach(cb => {
    symptoms.push(cb.value);
  });

  if (!make || !model || !year) {
    alert('Please enter at least Make, Model and Year.');
    return;
  }

  // Show loading screen
  showLoading('Analysing vehicle...');

  // Small delay so the loading screen is visible
  setTimeout(() => {
    const age = new Date().getFullYear() - year;
    const recommendations = generateRecommendations({ make, model, year, age, mileage, condition, symptoms });
    displayResults(make, model, year, mileage, recommendations);
    hideLoading();
  }, 900);
}

function generateRecommendations({ make, model, year, age, mileage, condition, symptoms }) {
  const recs = {
    priority: [],
    recommended: [],
    optional: [],
    notes: []
  };

  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  const isTruck = /truck|bakkie|ranger|hilux|amarok|navara|d-max|land cruiser|fortuner|patrol|sprinter|crafter|transit|triton|l200|bt-50|tundra|sierra|f-150|f150|ram|silverado/i.test(make + ' ' + model);
  const isClassicBmw = makeLower.includes('bmw') && year <= 1998;

  // Mileage-based
  if (mileage >= 10000 && mileage < 30000) {
    recs.recommended.push('Minor service (oil + oil filter) — R800 – R1 500');
  }
  if (mileage >= 30000) {
    recs.priority.push('Full service (oil, oil filter, air filter, cabin filter) — R1 800 – R3 500');
  }
  if (mileage >= 60000) {
    recs.priority.push('Spark plugs replacement (petrol) or glow plug check (diesel) — R900 – R2 500');
    recs.recommended.push('Brake fluid flush — R600 – R1 200');
  }
  if (mileage >= 90000) {
    recs.priority.push('Timing belt / chain inspection or replacement — R4 500 – R12 000');
    recs.recommended.push('Coolant flush + new thermostat if needed — R1 200 – R2 800');
    recs.recommended.push('Fuel filter replacement — R500 – R1 200');
  }
  if (mileage >= 120000) {
    recs.priority.push('Major service + full inspection of suspension, mounts and seals — R3 500 – R7 000');
    recs.recommended.push('Transmission fluid & filter change — R2 500 – R5 500');
  }
  if (mileage >= 180000) {
    recs.priority.push('Thorough engine health check (compression / leak-down test) — R1 500 – R3 000');
  }

  // Age-based
  if (age >= 5) {
    recs.recommended.push('Battery load test & possible replacement — R1 400 – R2 800');
    recs.recommended.push('Brake fluid replacement (every 2–3 years) — R600 – R1 200');
  }
  if (age >= 8) {
    recs.recommended.push('Air-conditioning service & regas — R1 200 – R2 500');
    recs.optional.push('Inspect all rubber bushes, mounts and drive belts — R800 – R2 000 (parts extra)');
  }
  if (age >= 12) {
    recs.priority.push('Full underbody and sill inspection for rust — R800 – R1 500 (inspection only)');
    recs.recommended.push('Radiator, hoses and water pump check — R2 500 – R6 000 if replacement needed');
  }
  if (age >= 15) {
    recs.priority.push('Comprehensive restoration assessment recommended — R1 500 – R3 000');
    recs.notes.push('Vehicles older than 15 years usually need body, interior and mechanical attention to feel “like new”.');
  }
  if (age >= 25) {
    recs.notes.push('Classic / project vehicle territory. Focus on rust repair, reliable running gear and period-correct restoration.');
  }

  // Condition
  if (condition === 'Poor') {
    recs.priority.unshift('Full mechanical & safety inspection before spending money on cosmetics — R1 500 – R3 000');
    recs.priority.push('Fix brakes, tyres, lights, steering and suspension first');
  }
  if (condition === 'Fair') {
    recs.recommended.push('Focus on reliability first, then cosmetics and comfort');
  }

  // Symptoms
  const symptomMap = {
    'engine-noise': 'Engine noise – check valve clearances, timing chain/belt tensioner, oil pressure and engine mounts — R1 500 – R8 000+',
    'smoke': 'Exhaust smoke – Blue = burning oil, White = coolant (possible head gasket), Black = rich mixture / turbo issues — Diagnosis R1 200 – R2 500',
    'overheating': 'Overheating – inspect radiator, water pump, thermostat, fans, head gasket — R2 500 – R15 000 depending on cause',
    'vibration': 'Vibration – check mounts, wheel balance & alignment, propshaft, CV joints — R1 000 – R6 000',
    'brake-issues': 'Brake issues – pads, discs, fluid, calipers — R1 800 – R6 500 (axle set)',
    'electrical': 'Electrical problems – battery, alternator, starter, parasitic drain — R1 200 – R5 000',
    'ac-not-cold': 'A/C not cold – gas, compressor, condenser — R1 500 – R9 000',
    'rust': 'Rust present – sills, arches, floors, chassis — R3 000 – R25 000+ depending on severity',
    'oil-leak': 'Oil leaks – valve cover, sump, filter housing, seals — R1 500 – R7 000',
    'rough-idle': 'Rough idle – throttle body, plugs/coils, injectors, vacuum leaks — R1 000 – R4 500',
    'hard-start': 'Hard starting – battery, starter, fuel pressure, sensors, glow plugs — R1 200 – R5 500',
    'warning-light': 'Warning light on – full OBD-II scan first — R600 – R1 200'
  };

  symptoms.forEach(s => {
    if (symptomMap[s]) recs.priority.push(symptomMap[s]);
  });

  // Brand specific
  if (makeLower.includes('toyota') || makeLower.includes('lexus')) {
    recs.notes.push('Toyota / Lexus: Extremely reliable if serviced regularly. Focus on oil changes and water pump + timing components on higher mileage engines.');
    if (modelLower.includes('hilux') || modelLower.includes('fortuner') || modelLower.includes('land cruiser')) {
      recs.recommended.push('Check rear leaf springs, bushes and propshaft joints — R2 500 – R8 000');
      recs.recommended.push('Inspect turbo pipes and intercooler for leaks (diesel) — R1 500 – R4 500');
    }
  }

  if (makeLower.includes('bmw')) {
    recs.notes.push('BMW: Great to drive but can be expensive as they age. Oil leaks, cooling system and electronic issues are common.');
    if (isClassicBmw) {
      recs.notes.push('Classic BMW (E30/E36 era): These are now highly collectible. Focus on rust, cooling system, and original character.');
      recs.priority.push('Rust inspection & repair (sills, jacking points, rear arches, floor pans) — R5 000 – R30 000+');
      recs.priority.push('Cooling system overhaul (radiator, water pump, thermostat, hoses) — R4 500 – R9 000');
      recs.recommended.push('Valve cover gasket + oil filter housing gasket (common leaks) — R2 500 – R5 500');
      recs.recommended.push('Timing belt + water pump (M20 engine in 325i/is) — R5 500 – R9 500');
      recs.recommended.push('Service the manual gearbox or automatic — R2 500 – R6 000');
      recs.optional.push('New poly bushes or quality OEM-style suspension refresh — R6 000 – R15 000');
      recs.optional.push('Interior restoration (seats, door cards, headliner) — R8 000 – R25 000');
      recs.optional.push('Period-correct wheels refinish + quality tyres — R8 000 – R18 000');
    } else {
      recs.priority.push('Cooling system inspection (radiator, water pump, thermostat, expansion tank) — R4 000 – R11 000');
      recs.recommended.push('Check for oil leaks at valve cover gasket, oil filter housing gasket and oil pan — R3 000 – R9 000');
      recs.recommended.push('Inspect VANOS system and valve cover for leaks on N-series engines — R4 000 – R12 000');
      if (age >= 8 || mileage >= 100000) {
        recs.recommended.push('Check electric water pump and auxiliary coolant pump — R5 000 – R12 000');
      }
      recs.optional.push('Suspension bushes and control arms — R6 000 – R16 000');
    }
  }

  if (makeLower.includes('mercedes') || makeLower.includes('benz') || makeLower.includes('merc')) {
    recs.notes.push('Mercedes-Benz: Comfortable and strong, but balance shaft gears, ABC suspension and electronics can be costly.');
    recs.recommended.push('Check for oil leaks and balance shaft gear issues (M272/M273) — R15 000 – R35 000 if needed');
    recs.recommended.push('Inspect air suspension / ABC system if fitted — R8 000 – R40 000+');
    recs.recommended.push('Service the automatic transmission — R4 000 – R8 500');
  }

  if (makeLower.includes('ford')) {
    recs.notes.push('Ford: Generally good value. Focus on known issues per model.');
    if (modelLower.includes('ranger') || modelLower.includes('everest')) {
      recs.recommended.push('Inspect propshaft, rear leaf springs and bushes — R3 000 – R9 000');
      recs.recommended.push('Check turbo pipes, intercooler and EGR system — R2 500 – R7 000');
    }
  }

  if (makeLower.includes('fiat') || modelLower.includes('uno')) {
    recs.notes.push('Fiat Uno: Simple, light and easy to work on. Rust and electrical gremlins are the main enemies.');
    recs.priority.push('Thorough rust inspection (sills, floor, wheel arches) — R3 000 – R15 000 to repair');
    recs.recommended.push('Check carburettor / fuel injection and ignition components — R1 500 – R4 500');
    recs.recommended.push('Inspect CV joints and driveshafts — R2 000 – R5 500');
  }

  if (makeLower.includes('alfa') || makeLower.includes('romeo')) {
    recs.notes.push('Alfa Romeo: Characterful and fun, but need regular care. Timing components are critical.');
    recs.priority.push('Timing belt + water pump replacement if not recently done — R5 500 – R11 000');
    recs.recommended.push('Check for oil leaks and cam cover gasket — R2 500 – R6 000');
    recs.recommended.push('Inspect electrical system and window regulators — R1 500 – R5 000');
  }

  if (isTruck) {
    recs.notes.push('Commercial / Bakkie / Truck: These work hard. Focus on drivetrain, suspension and cooling.');
    recs.recommended.push('Inspect rear suspension (leaf springs, bushes, shackles) — R3 500 – R12 000');
    recs.recommended.push('Check propshaft U-joints and centre bearing — R2 500 – R7 000');
    recs.recommended.push('Cooling system and intercooler (turbo diesel) — R3 000 – R9 000');
  }

  // Like-new path
  recs.optional.push('Professional detail with paint correction + ceramic coating — R4 500 – R12 000');
  recs.optional.push('Interior deep clean / leather or fabric restoration — R2 500 – R8 000');
  recs.optional.push('New quality tyres (set of 4) — R6 000 – R16 000');
  recs.optional.push('Replace all major fluids (engine, gearbox, diff, brake, coolant) — R3 500 – R7 500');
  recs.optional.push('Refresh faded exterior plastics and restore headlights — R1 500 – R4 000');

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
      <p class="text-muted small mb-0">Mileage: ${mileage.toLocaleString()} km &nbsp;|&nbsp; Estimated costs in ZAR</p>
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
      <strong>Brand / Model Notes:</strong><br>${recs.notes.join('<br><br>')}
    </div>`;
  }

  content.innerHTML = html;
  container.classList.remove('d-none');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function initDiagnostics() {
  document.getElementById('btn-run-diagnosis')?.addEventListener('click', runDiagnosis);
}