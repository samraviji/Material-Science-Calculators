function calculateMasterAlloy() {
  const M = parseFloat(document.getElementById("ma-mass").value);
  const n = parseInt(document.getElementById("ma-elements").value);
  const resultBox = document.getElementById("masteralloy-result");

  if (isNaN(M) || M <= 0) {
    resultBox.innerHTML = "Please enter a valid original melt mass.";
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

  let additions = [];

  if (n === 1) {
    const x = M * (target[0] - orig[0]) / (master[0] - target[0]);
    additions = [x];
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

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;

    additions = [x, y];
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
    resultBox.innerHTML = "Negative or invalid master alloy mass calculated. Target may be unachievable.";
    return;
  }

  const finalMass = M + additions.reduce((a, b) => a + b, 0);

  let output = "<h3>Results</h3>";

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