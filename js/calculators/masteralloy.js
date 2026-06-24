function generateMasterAlloyInputs() {
  const count = parseInt(document.getElementById("ma-elements").value);
  const area = document.getElementById("ma-input-area");

  if (!area) return;

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

          <div class="input-group">
            <label for="ma-orig-${i}">Original wt%</label>
            <input type="number" id="ma-orig-${i}" step="any" placeholder="Example: 0.10" />
          </div>

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
  const massInput = document.getElementById("ma-mass");
  const countInput = document.getElementById("ma-elements");
  const resultBox = document.getElementById("masteralloy-result");

  if (!massInput || !countInput || !resultBox) return;

  const originalMass = parseFloat(massInput.value);
  const count = parseInt(countInput.value);

  if (isNaN(originalMass) || originalMass <= 0) {
    resultBox.innerHTML = `<span style="color:#ff6b6b;">Please enter a valid original melt mass.</span>`;
    return;
  }

  let additions = [];
  let totalAddition = 0;
  let errors = [];

  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`ma-name-${i}`)?.value.trim() || `Element ${i}`;
    const orig = parseFloat(document.getElementById(`ma-orig-${i}`)?.value);
    const target = parseFloat(document.getElementById(`ma-target-${i}`)?.value);
    const master = parseFloat(document.getElementById(`ma-master-${i}`)?.value);

    if ([orig, target, master].some(v => isNaN(v))) {
      errors.push(`${name}: please fill all fields.`);
      continue;
    }

    if (master <= 0 || master > 100) {
      errors.push(`${name}: master alloy wt% must be between 0 and 100.`);
      continue;
    }

    if (orig < 0 || target < 0 || orig > 100 || target > 100) {
      errors.push(`${name}: original and target wt% must be between 0 and 100.`);
      continue;
    }

    if (target < orig) {
      errors.push(`${name}: this version only handles increasing composition by adding master alloy.`);
      continue;
    }

    if (target === orig) {
      additions.push({
        name,
        original: orig,
        target: target,
        master: master,
        addition: 0
      });
      continue;
    }

    const origFrac = orig / 100;
    const targetFrac = target / 100;
    const masterFrac = master / 100;

    const denominator = masterFrac - targetFrac;

    if (Math.abs(denominator) < 1e-12) {
      errors.push(`${name}: master alloy composition is too close to target composition.`);
      continue;
    }

    const x = originalMass * (targetFrac - origFrac) / denominator;

    if (!isFinite(x) || x < 0) {
      errors.push(`${name}: no valid positive master alloy addition found.`);
      continue;
    }

    additions.push({
      name,
      original: orig,
      target: target,
      master: master,
      addition: x
    });

    totalAddition += x;
  }

  if (errors.length > 0) {
    resultBox.innerHTML = `
      <div style="color:#ff6b6b;">
        <b>Please fix these issues:</b><br>
        ${errors.join("<br>")}
      </div>
    `;
    return;
  }

  const finalMass = originalMass + totalAddition;

  let html = `
    <h3>Master Alloy Addition Results</h3>
    <p><b>Original melt mass:</b> ${originalMass.toFixed(4)}</p>
    <p><b>Total master alloy added:</b> ${totalAddition.toFixed(4)}</p>
    <p><b>Final melt mass:</b> ${finalMass.toFixed(4)}</p>
    <hr>
  `;

  additions.forEach(item => {
    const finalElementMass =
      originalMass * (item.original / 100) +
      item.addition * (item.master / 100);

    const finalWtPct = (finalElementMass / finalMass) * 100;

    html += `
      <div style="margin-bottom:14px;">
        <b>${item.name}</b><br>
        Original wt%: ${item.original}<br>
        Target wt%: ${item.target}<br>
        Master alloy: Al-${item.name} (${item.master} wt%)<br>
        <span style="color:#7dd3fc;"><b>Add ${item.addition.toFixed(4)} g</b></span><br>
        Final check: ${finalWtPct.toFixed(4)} wt%
      </div>
    `;
  });

  resultBox.innerHTML = html;
}