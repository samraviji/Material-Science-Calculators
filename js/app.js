document.addEventListener("DOMContentLoaded", () => {
  buildTable();
  populateTernarySelects();
  updateBadges();
  updateCompositionLabels();
  resetResultsOnly();
  resetExplorerPanel();

  if (typeof drawHallChart === "function") drawHallChart();

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => showCalc(btn.dataset.mode));
  });

  const resetBtn = document.getElementById("reset-selection-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetTable);

  const hallBtn = document.getElementById("hall-btn");
  if (hallBtn) hallBtn.addEventListener("click", calculateHallPetch);

  const atwtBtn = document.getElementById("atwt-btn");
  if (atwtBtn) atwtBtn.addEventListener("click", calcAtWt);

  const wtatBtn = document.getElementById("wtat-btn");
  if (wtatBtn) wtatBtn.addEventListener("click", calcWtAt);

  const densityBtn = document.getElementById("density-btn");
  if (densityBtn) densityBtn.addEventListener("click", calculateDensity);

  const diffusionBtn = document.getElementById("diffusion-btn");
  if (diffusionBtn) diffusionBtn.addEventListener("click", calculateDiffusion);

  const ternaryBtn = document.getElementById("ternary-btn");
  if (ternaryBtn) ternaryBtn.addEventListener("click", calculateTernary);

const maMode = document.getElementById("ma-mode");
if (maMode && typeof generateMasterAlloyInputs === "function") {
  maMode.addEventListener("change", generateMasterAlloyInputs);
}
  const maElements = document.getElementById("ma-elements");
  if (maElements && typeof generateMasterAlloyInputs === "function") {
    maElements.addEventListener("change", generateMasterAlloyInputs);
    generateMasterAlloyInputs();
  }

  const masterAlloyBtn = document.getElementById("masteralloy-btn");
  if (masterAlloyBtn && typeof calculateMasterAlloy === "function") {
    masterAlloyBtn.addEventListener("click", calculateMasterAlloy);
  }
});