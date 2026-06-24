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
  const originalMass = parseFloat(document.getElementById("ma-mass").value);
  const count = parseInt(document.getElementById("ma-elements").value);
  const resultBox = document.getElementById("masteralloy-result");

  if (isNaN(originalMass) || originalMass <= 0) {
    resultBox.innerHTML = "Please enter a valid original melt mass.";
    return;
  }

  let totalAddition = 0;
  let output = "<h3>Results</h3>";

  for (let i = 1; i <= count; i++) {
    const name = document.getElementById(`ma-name-${i}`).value || `Element ${i}`;
    const orig = parseFloat(document.getElementById(`ma-orig-${i}`).value);
    const target = parseFloat(document.getElementById(`ma-target-${i}`).value);
    const master = parseFloat(document.getElementById(`ma-master-${i}`).value);

    if (isNaN(orig) || isNaN(target) || isNaN(master)) {
      resultBox.innerHTML = `Please fill all fields for ${name}.`;
      return;
    }

    const x =
      originalMass * ((target / 100) - (orig / 100)) /
      ((master / 100) - (target / 100));

    if (!isFinite(x) || x < 0) {
      resultBox.innerHTML = `Cannot calculate valid addition for ${name}.`;
      return;
    }

    totalAddition += x;

    output += `
      <p>
        <b>${name}</b><br>
        Original wt%: ${orig}<br>
        Target wt%: ${target}<br>
        Master alloy: Al-${name} (${master} wt%)<br>
        Add <b>${x.toFixed(4)}</b> g of Al-${name} master alloy.
      </p>
    `;
  }

  const finalMass = originalMass + totalAddition;

  output += `<p><b>Final melt mass:</b> ${finalMass.toFixed(4)} g</p>`;

  resultBox.innerHTML = output;
}