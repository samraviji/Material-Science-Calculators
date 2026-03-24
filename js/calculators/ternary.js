function calculateTernary() {
  const e1Symbol = document.getElementById("ternary-e1")?.value;
  const e2Symbol = document.getElementById("ternary-e2")?.value;
  const e3Symbol = document.getElementById("ternary-e3")?.value;

  const c1 = parseFloat(document.getElementById("ternary-c1")?.value);
  const c2 = parseFloat(document.getElementById("ternary-c2")?.value);
  const c3 = parseFloat(document.getElementById("ternary-c3")?.value);

  const resultBox = document.getElementById("ternary-result");
  const extraBox = document.getElementById("ternary-extra");
  const aawNode = document.getElementById("ternary-aaw");
  const vecNode = document.getElementById("ternary-vec");
  const deltaNode = document.getElementById("ternary-delta");

  if (!resultBox || !extraBox || !aawNode || !vecNode || !deltaNode) return;

  const e1 = elementsData.find(el => el.s === e1Symbol);
  const e2 = elementsData.find(el => el.s === e2Symbol);
  const e3 = elementsData.find(el => el.s === e3Symbol);

  if (!e1 || !e2 || !e3) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "Please select three valid elements.";
    extraBox.style.display = "none";
    return;
  }

  if ([c1, c2, c3].some(v => Number.isNaN(v))) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "Please enter valid atomic percentages for all three elements.";
    extraBox.style.display = "none";
    return;
  }

  if (c1 < 0 || c2 < 0 || c3 < 0) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "Atomic percentages cannot be negative.";
    extraBox.style.display = "none";
    return;
  }

  const total = c1 + c2 + c3;
  if (Math.abs(total - 100) > 0.05) {
    resultBox.style.display = "block";
    resultBox.innerHTML = `Atomic percentages must sum to 100. Current total = ${total.toFixed(2)}.`;
    extraBox.style.display = "none";
    return;
  }

  const x1 = c1 / 100;
  const x2 = c2 / 100;
  const x3 = c3 / 100;

  // Average atomic weight
  const avgAtomicWeight = x1 * e1.aw + x2 * e2.aw + x3 * e3.aw;

  // Convert at% -> wt%
  const m1 = x1 * e1.aw;
  const m2 = x2 * e2.aw;
  const m3 = x3 * e3.aw;
  const massTotal = m1 + m2 + m3;

  const wt1 = (m1 / massTotal) * 100;
  const wt2 = (m2 / massTotal) * 100;
  const wt3 = (m3 / massTotal) * 100;

  // Average VEC
  const avgVEC = x1 * e1.v + x2 * e2.v + x3 * e3.v;

  // Size misfit parameter delta (%)
  const rBar = x1 * e1.rad + x2 * e2.rad + x3 * e3.rad;
  const delta = Math.sqrt(
    x1 * Math.pow(1 - e1.rad / rBar, 2) +
    x2 * Math.pow(1 - e2.rad / rBar, 2) +
    x3 * Math.pow(1 - e3.rad / rBar, 2)
  ) * 100;

  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <b>Ternary composition summary</b><br><br>
    Atomic %: ${e1.s} ${c1.toFixed(2)}%, ${e2.s} ${c2.toFixed(2)}%, ${e3.s} ${c3.toFixed(2)}%<br>
    Weight %: ${e1.s} ${wt1.toFixed(2)}%, ${e2.s} ${wt2.toFixed(2)}%, ${e3.s} ${wt3.toFixed(2)}%
  `;

  extraBox.style.display = "grid";
  aawNode.textContent = avgAtomicWeight.toFixed(3);
  vecNode.textContent = avgVEC.toFixed(3);
  deltaNode.textContent = `${delta.toFixed(3)}%`;
}
