document.addEventListener("DOMContentLoaded", () => {
  if (typeof buildTable === "function") buildTable();
  if (typeof populateTernarySelects === "function") populateTernarySelects();
  if (typeof updateBadges === "function") updateBadges();
  if (typeof updateCompositionLabels === "function") updateCompositionLabels();
  if (typeof resetResultsOnly === "function") resetResultsOnly();
  if (typeof resetExplorerPanel === "function") resetExplorerPanel();
  if (typeof drawHallChart === "function") drawHallChart();

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => showCalc(btn.dataset.mode));
  });

  const resetBtn = document.getElementById("reset-selection-btn");
  if (resetBtn && typeof resetTable === "function") {
    resetBtn.addEventListener("click", resetTable);
  }

  const hallBtn = document.getElementById("hall-btn");
  if (hallBtn && typeof calculateHallPetch === "function") {
    hallBtn.addEventListener("click", calculateHallPetch);
  }

  const atwtBtn = document.getElementById("atwt-btn");
  if (atwtBtn && typeof calcAtWt === "function") {
    atwtBtn.addEventListener("click", calcAtWt);
  }

  const wtatBtn = document.getElementById("wtat-btn");
  if (wtatBtn && typeof calcWtAt === "function") {
    wtatBtn.addEventListener("click", calcWtAt);
  }

  const densityBtn = document.getElementById("density-btn");
  if (densityBtn && typeof calculateDensity === "function") {
    densityBtn.addEventListener("click", calculateDensity);
  }

  const diffusionBtn = document.getElementById("diffusion-btn");
  if (diffusionBtn && typeof calculateDiffusion === "function") {
    diffusionBtn.addEventListener("click", calculateDiffusion);
  }

  const ternaryBtn = document.getElementById("ternary-btn");
  if (ternaryBtn && typeof calculateTernary === "function") {
    ternaryBtn.addEventListener("click", calculateTernary);
  }
});
