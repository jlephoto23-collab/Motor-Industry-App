// diagnostics.js - Car Diagnostics & Restoration Advisor (Expanded)

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

  const age = new Date().getFullYear() - year;
  const recommendations = generateRecommendations({ make, model, year, age, mileage, condition, symptoms });

  displayResults(make, model, year, mileage, recommendations);
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

  // ========== GENERAL MILEAGE-BASED SERVICES ==========
  if (mileage >= 10000 && mileage < 30000) {
    recs.recommended.push('Minor service (oil + oil filter)');
  }
  if (mileage >= 30000) {
    recs.priority.push('Full service (oil, oil filter, air filter, cabin filter)');
  }
  if (mileage >= 60000) {
    recs.priority.push('Spark plugs replacement (petrol) or glow plug check (diesel)');
    recs.recommended.push('Brake fluid flush');
  }
  if (mileage >= 90000) {
    recs.priority.push('Timing belt / chain inspection or replacement');
    recs.recommended.push('Coolant flush + new thermostat if needed');
    recs.recommended.push('Fuel filter replacement');
  }
  if (mileage >= 120000) {
    recs.priority.push('Major service + full inspection of suspension, mounts and seals');
    recs.recommended.push('Transmission fluid & filter change');
  }
  if (mileage >= 180000) {
    recs.priority.push('Thorough engine health check (compression / leak-down test recommended)');
  }

  // ========== AGE-BASED ==========
  if (age >= 5) {
    recs.recommended.push('Battery load test & possible replacement');
    recs.recommended.push('Brake fluid replacement (every 2–3 years)');
  }
  if (age >= 8) {
    recs.recommended.push('Air-conditioning service & regas');
    recs.optional.push('Inspect all rubber bushes, mounts and drive belts');
  }
  if (age >= 12) {
    recs.priority.push('Full underbody and sill inspection for rust');
    recs.recommended.push('Radiator, hoses and water pump check');
  }
  if (age >= 15) {
    recs.priority.push('Comprehensive restoration assessment recommended');
    recs.notes.push('Vehicles older than 15 years usually need body, interior and mechanical attention to feel “like new”.');
  }
  if (age >= 25) {
    recs.notes.push('Classic / project vehicle territory. Focus on rust repair, reliable running gear and period-correct restoration.');
  }

  // ========== CONDITION ==========
  if (condition === 'Poor') {
    recs.priority.unshift('Full mechanical & safety inspection before spending money on cosmetics');
    recs.priority.push('Fix brakes, tyres, lights, steering and suspension first');
  }
  if (condition === 'Fair') {
    recs.recommended.push('Focus on reliability first, then cosmetics and comfort');
  }

  // ========== SYMPTOM-BASED ==========
  const symptomMap = {
    'engine-noise': 'Engine noise – check valve clearances, timing chain/belt tensioner, oil pressure and engine mounts',
    'smoke': 'Exhaust smoke – Blue = burning oil, White = coolant (possible head gasket), Black = rich mixture / turbo issues',
    'overheating': 'Overheating – inspect radiator, water pump, thermostat, viscous fan / electric fans, head gasket and coolant condition',
    'vibration': 'Vibration – check engine/gearbox mounts, wheel balance & alignment, propshaft, CV joints and tyre condition',
    'brake-issues': 'Brake issues – inspect pads, discs/drums, brake fluid, calipers, master cylinder and ABS sensors',
    'electrical': 'Electrical problems – test battery, alternator output, starter and check for parasitic battery drain',
    'ac-not-cold': 'A/C not cold – check refrigerant level, compressor clutch, condenser, expansion valve and cabin filter',
    'rust': 'Rust present – treat and repair sills, wheel arches, floor pans, boot floor and chassis rails as priority',
    'oil-leak': 'Oil leaks – common areas: valve cover gasket, sump gasket, oil filter housing, cam seals, rear main seal',
    'rough-idle': 'Rough idle – clean throttle body, check spark plugs/coils, injectors, vacuum leaks and MAF/MAP sensor',
    'hard-start': 'Hard starting – test battery & starter, fuel pressure, crank/cam sensors and glow plugs (diesel)',
    'warning-light': 'Warning light on – perform full OBD-II scan before replacing parts'
  };

  symptoms.forEach(s => {
    if (symptomMap[s]) recs.priority.push(symptomMap[s]);
  });

  // ========== BRAND / MODEL SPECIFIC ADVICE ==========

  // --- TOYOTA ---
  if (makeLower.includes('toyota') || makeLower.includes('lexus')) {
    recs.notes.push('Toyota / Lexus: Extremely reliable if serviced regularly. Focus on oil changes and water pump + timing components on higher mileage engines.');
    if (modelLower.includes('hilux') || modelLower.includes('fortuner') || modelLower.includes('land cruiser')) {
      recs.recommended.push('Check rear leaf springs, bushes and propshaft joints (common on bakkies)');
      recs.recommended.push('Inspect turbo pipes and intercooler for leaks (diesel models)');
    }
    if (modelLower.includes('corolla') || modelLower.includes('yaris') || modelLower.includes('aviso')) {
      recs.optional.push('Water pump and thermostat are common wear items around 90–120k km');
    }
  }

  // --- BMW ---
  if (makeLower.includes('bmw')) {
    recs.notes.push('BMW: Great to drive but can be expensive as they age. Oil leaks, cooling system and electronic issues are common.');
    recs.priority.push('Cooling system inspection (radiator, water pump, thermostat, expansion tank) – a known weak area');
    recs.recommended.push('Check for oil leaks at valve cover gasket, oil filter housing gasket and oil pan');
    recs.recommended.push('Inspect VANOS system and valve cover for leaks on N-series engines');
    if (age >= 8 || mileage >= 100000) {
      recs.recommended.push('Check electric water pump (many modern BMWs) and auxiliary coolant pump');
    }
    recs.optional.push('Suspension bushes and control arms wear faster than average – listen for knocks');
  }

  // --- MERCEDES-BENZ ---
  if (makeLower.includes('mercedes') || makeLower.includes('benz') || makeLower.includes('merc')) {
    recs.notes.push('Mercedes-Benz: Comfortable and strong, but balance shaft gears, ABC suspension (on some models) and electronics can be costly.');
    recs.recommended.push('Check for oil leaks and balance shaft gear issues (especially M272/M273 engines)');
    recs.recommended.push('Inspect air suspension / ABC system if fitted – leaks are expensive');
    recs.recommended.push('Service the automatic transmission (7G-Tronic etc.) if not done recently');
    if (modelLower.includes('c-class') || modelLower.includes('e-class') || modelLower.includes('clk')) {
      recs.optional.push('Check door lock actuators and window regulators – common failure points');
    }
    if (modelLower.includes('sprinter') || modelLower.includes('vito') || modelLower.includes('viano')) {
      recs.recommended.push('Inspect turbo, DPF (if fitted) and injectors on higher mileage diesels');
    }
  }

  // --- FORD ---
  if (makeLower.includes('ford')) {
    recs.notes.push('Ford: Generally good value. Focus on known issues per model.');
    if (modelLower.includes('ranger') || modelLower.includes('everest')) {
      recs.recommended.push('Inspect propshaft, rear leaf springs and bushes');
      recs.recommended.push('Check turbo pipes, intercooler and EGR system on diesel models');
      recs.optional.push('Manual gearboxes can develop bearing noise on higher mileage examples');
    }
    if (modelLower.includes('focus') || modelLower.includes('fiesta') || modelLower.includes('eco sport')) {
      recs.recommended.push('Check dual-mass flywheel and clutch on manual models with higher km');
      recs.recommended.push('Inspect Powershift (DPS6) transmission service history if automatic');
    }
    if (modelLower.includes('transit') || modelLower.includes('custom')) {
      recs.recommended.push('Check turbo, injectors and DPF on diesel Transits');
    }
  }

  // --- FIAT UNO ---
  if (makeLower.includes('fiat') || modelLower.includes('uno')) {
    recs.notes.push('Fiat Uno: Simple, light and easy to work on. Rust and electrical gremlins are the main enemies.');
    recs.priority.push('Thorough rust inspection (sills, floor, wheel arches, rear valance)');
    recs.recommended.push('Check carburettor / fuel injection system and ignition components');
    recs.recommended.push('Inspect CV joints and driveshafts');
    recs.optional.push('Replace all fluids and service the brakes for a big improvement in feel');
    if (age >= 20) {
      recs.notes.push('Many Unos are now project / classic cars. Focus on solid body and reliable running.');
    }
  }

  // --- ALFA ROMEO ---
  if (makeLower.includes('alfa') || makeLower.includes('romeo')) {
    recs.notes.push('Alfa Romeo: Characterful and fun, but need regular care. Electrical issues and timing components are important.');
    recs.priority.push('Timing belt + water pump replacement if not recently done (critical on many Alfas)');
    recs.recommended.push('Check for oil leaks and cam cover gasket condition');
    recs.recommended.push('Inspect electrical system – battery, alternator, earth points and window regulators');
    recs.optional.push('Suspension bushes and drop links wear quite quickly – knock over bumps is common');
    if (modelLower.includes('147') || modelLower.includes('156') || modelLower.includes('159') || modelLower.includes('giulietta')) {
      recs.recommended.push('Check dual-mass flywheel and clutch on higher mileage cars');
    }
  }

  // --- TRUCKS / BAKKIES / COMMERCIAL ==========
  if (isTruck) {
    recs.notes.push('Commercial / Bakkie / Truck: These work hard. Focus on drivetrain, suspension and cooling.');
    recs.recommended.push('Inspect rear suspension (leaf springs, bushes, shackles)');
    recs.recommended.push('Check propshaft U-joints and centre bearing');
    recs.recommended.push('Inspect clutch (manual) or transmission service history (auto)');
    recs.recommended.push('Cooling system and intercooler (if turbo diesel) are critical under load');
    if (mileage >= 150000) {
      recs.priority.push('Full drivetrain inspection recommended for high-mileage work vehicles');
    }
  }

  // ========== PATH TO “LIKE NEW” ==========
  recs.optional.push('Professional detail with paint correction + ceramic coating');
  recs.optional.push('Interior deep clean / leather or fabric restoration');
  recs.optional.push('New tyres if older than 5–6 years or worn');
  recs.optional.push('Replace all major fluids (engine, gearbox, differential, brake, coolant)');
  recs.optional.push('Refresh faded exterior plastics and restore headlights');
  recs.optional.push('New wiper blades, cabin filter and a full set of quality floor mats');

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