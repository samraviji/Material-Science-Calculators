function calculateTernary() {
  console.log("calculateTernary fired");

  const e1Select = document.getElementById("ternary-e1");
  const e2Select = document.getElementById("ternary-e2");
  const e3Select = document.getElementById("ternary-e3");

  const c1Input = document.getElementById("ternary-c1");
  const c2Input = document.getElementById("ternary-c2");
  const c3Input = document.getElementById("ternary-c3");

  const resultBox = document.getElementById("ternary-result");
  const extraBox = document.getElementById("ternary-extra");
  const aawNode = document.getElementById("ternary-aaw");
  const vecNode = document.getElementById("ternary-vec");
  const deltaNode = document.getElementById("ternary-delta");

  if (!e1Select || !e2Select || !e3Select || !c1Input || !c2Input || !c3Input || !resultBox || !extraBox || !aawNode || !vecNode || !deltaNode) {
    console.error("Ternary DOM elements missing");
    return;
  }

  const e1 = elementsData.find(el => el.s === e1Select.value);
  const e2 = elementsData.find(el => el.s === e2Select.value);
  const e3 = elementsData.find(el => el.s === e3Select.value);

  const c1 = parseFloat(c1Input.value);
  const c2 = parseFloat(c2Input.value);
  const c3 = parseFloat(c3Input.value);

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

  const avgAtomicWeight = x1 * e1.aw + x2 * e2.aw + x3 * e3.aw;

  const m1 = x1 * e1.aw;
  const m2 = x2 * e2.aw;
  const m3 = x3 * e3.aw;
  const massTotal = m1 + m2 + m3;

  const wt1 = (m1 / massTotal) * 100;
  const wt2 = (m2 / massTotal) * 100;
  const wt3 = (m3 / massTotal) * 100;

  const avgVEC = x1 * e1.v + x2 * e2.v + x3 * e3.v;

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
