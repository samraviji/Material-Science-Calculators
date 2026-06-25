function generateMasterAlloyInputs() {
  const count = parseInt(document.getElementById("ma-elements").value);
  const mode = document.getElementById("ma-mode")?.value || "baseline";
  const area = document.getElementById("ma-input-area");
  const massLabel = document.getElementById("ma-mass-label");

  if (!area) return;

  if (massLabel) {
    massLabel.textContent =
      mode === "baseline" ? "Baseline alloy mass" : "Target final alloy mass";
  }

  let html = "";

  for (let i = 1; i <= count; i++) {
    html += `
      <div class="panel-card" style="margin-top:16px;">
        <h3>Element ${i}</h3>

        <div class="input-row">
          <div class="input-group">
            <label for="ma-name-${i}">Element name</label>
            <input type="text" id="ma-name-${i}" placeholder="Example: Mn" />
          </div>

          ${
            mode === "baseline"
              ? `
          <div class="input-group">
            <label for="ma-orig-${i}">Original wt% in baseline alloy</label>
            <input type="number" id="ma-orig-${i}" step="any" placeholder="Example: 0.10" />
          </div>
          `
              : `<input type="hidden" id="ma-orig-${i}" value="0" />`
          }

          <div class="input-group">
            <label for="ma-target-${i}">Target wt%</label>
            <input type="number" id="ma-target-${i}" step="any" placeholder="Example: 0.25" />
          </div>

          <div class="input-group">
            <label for="ma-master-${i}">Master alloy wt% of this element</label>
            <input type="number" id="ma-master-${i}" step="any" placeholder="Example: 10" />
          </div>
        </div>
      </div>
    `;
  }

  area.innerHTML = html;
}

function calculateMasterAlloy() {
  const mode = document.getElementById("ma-mode")?.value || "baseline";
  const M = parseFloat(document.getElementById("ma-mass").value);
  const n = parseInt(document.getElementById("ma-elements").value);
  const resultBox = document.getElementById("masteralloy-result");

  if (isNaN(M) || M <= 0) {
    resultBox.innerHTML = "Please enter a valid mass.";
    return;
  }

  let names = [];
  let orig = [];
  let target = [];
  let master = [];

  for (let i = 1; i <= n; i++) {
    names.push(document.getElementById(`ma-name-${i}`).value || `Element ${i}`);
    orig.push(parseFloat(document.getElementById(`ma-orig-${i}`).value) / 100);
    target.push(parseFloat(document.getElementById(`ma-target-${i}`).value) / 100);
    master.push(parseFloat(document.getElementById(`ma-master-${i}`).value) / 100);
  }

  if ([...orig, ...target, ...master].some(v => isNaN(v))) {
    resultBox.innerHTML = "Please fill all fields.";
    return;
  }

  if (mode === "baseline") {
  if (n > 3) {
    resultBox.innerHTML =
      "Baseline mode currently supports up to 3 elements. For 4–6 elements, use Make alloy from scratch.";
    return;
  }

  calculateBaselineMode(M, n, names, orig, target, master, resultBox);
} else {
  calculateScratchMode(M, n, names, target, master, resultBox);
}

function calculateBaselineMode(M, n, names, orig, target, master, resultBox) {
  let additions = [];

  if (n === 1) {
    additions = [
      M * (target[0] - orig[0]) / (master[0] - target[0])
    ];
  }

  if (n === 2) {
    const a1 = master[0] - target[0];
    const b1 = -target[0];
    const c1 = M * (target[0] - orig[0]);

    const a2 = -target[1];
    const b2 = master[1] - target[1];
    const c2 = M * (target[1] - orig[1]);

    const det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < 1e-12) {
      resultBox.innerHTML = "No unique solution for 2-element system.";
      return;
    }

    additions = [
      (c1 * b2 - c2 * b1) / det,
      (a1 * c2 - a2 * c1) / det
    ];
  }

  if (n === 3) {
    const a1 = master[0] - target[0];
    const b1 = -target[0];
    const c1 = -target[0];
    const d1 = M * (target[0] - orig[0]);

    const a2 = -target[1];
    const b2 = master[1] - target[1];
    const c2 = -target[1];
    const d2 = M * (target[1] - orig[1]);

    const a3 = -target[2];
    const b3 = -target[2];
    const c3 = master[2] - target[2];
    const d3 = M * (target[2] - orig[2]);

    const det =
      a1 * (b2 * c3 - b3 * c2) -
      b1 * (a2 * c3 - a3 * c2) +
      c1 * (a2 * b3 - a3 * b2);

    if (Math.abs(det) < 1e-12) {
      resultBox.innerHTML = "No unique solution for 3-element system.";
      return;
    }

    const detX =
      d1 * (b2 * c3 - b3 * c2) -
      b1 * (d2 * c3 - d3 * c2) +
      c1 * (d2 * b3 - d3 * b2);

    const detY =
      a1 * (d2 * c3 - d3 * c2) -
      d1 * (a2 * c3 - a3 * c2) +
      c1 * (a2 * d3 - a3 * d2);

    const detZ =
      a1 * (b2 * d3 - b3 * d2) -
      b1 * (a2 * d3 - a3 * d2) +
      d1 * (a2 * b3 - a3 * b2);

    additions = [detX / det, detY / det, detZ / det];
  }

  if (additions.some(x => !isFinite(x) || x < 0)) {
    resultBox.innerHTML =
      "Negative or invalid master alloy mass calculated. Target may be unachievable.";
    return;
  }

  const finalMass = M + additions.reduce((a, b) => a + b, 0);

  let output = "<h3>Modify Existing Baseline Alloy Results</h3>";

  for (let i = 0; i < n; i++) {
    const finalElementMass = M * orig[i] + additions[i] * master[i];
    const finalWt = (finalElementMass / finalMass) * 100;

    output += `
      <p>
        <b>${names[i]}</b><br>
        Add <b>${additions[i].toFixed(4)} g</b> of Al-${names[i]} master alloy (${(master[i] * 100).toFixed(2)} wt%).<br>
        Final ${names[i]} = ${finalElementMass.toFixed(4)} g → ${finalWt.toFixed(4)} wt%
      </p>
    `;
  }

  output += `<p><b>Final melt mass:</b> ${finalMass.toFixed(4)} g</p>`;

  resultBox.style.display = "block";
  resultBox.innerHTML = output;
}

function calculateScratchMode(Mfinal, n, names, target, master, resultBox) {
  let additions = [];
  let totalMaster = 0;

  for (let i = 0; i < n; i++) {
    if (master[i] <= target[i]) {
      resultBox.innerHTML =
        `${names[i]}: master alloy wt% must be higher than target wt%.`;
      return;
    }

    const x = (Mfinal * target[i]) / master[i];

    if (!isFinite(x) || x < 0) {
      resultBox.innerHTML = `Invalid result for ${names[i]}.`;
      return;
    }

    additions.push(x);
    totalMaster += x;
  }

  const pureAl = Mfinal - totalMaster;

  if (pureAl < 0) {
    resultBox.innerHTML =
      "Master alloy additions exceed target final mass. Check target wt% and master alloy wt%.";
    return;
  }

  let output = "<h3>Make Alloy From Scratch Results</h3>";

  for (let i = 0; i < n; i++) {
    const elementMass = additions[i] * master[i];
    const finalWt = (elementMass / Mfinal) * 100;

    output += `
      <p>
        <b>${names[i]}</b><br>
        Add <b>${additions[i].toFixed(4)} g</b> of Al-${names[i]} master alloy (${(master[i] * 100).toFixed(2)} wt%).<br>
        Final ${names[i]} = ${elementMass.toFixed(4)} g → ${finalWt.toFixed(4)} wt%
      </p>
    `;
  }

  output += `
    <hr>
    <p><b>Add pure Al:</b> ${pureAl.toFixed(4)} g</p>
    <p><b>Final alloy mass:</b> ${Mfinal.toFixed(4)} g</p>
  `;

  resultBox.style.display = "block";
  resultBox.innerHTML = output;
}