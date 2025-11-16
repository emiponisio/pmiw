const terms = document.querySelectorAll(".term");
const definitions = document.querySelectorAll(".definition");
const result = document.getElementById("result");

let draggedTerm = null;

terms.forEach(term => {
  term.addEventListener("dragstart", e => {
    draggedTerm = term;
    e.dataTransfer.setData("text/plain", term.id);
  });
});

definitions.forEach(def => {
  def.addEventListener("dragover", e => {
    e.preventDefault();
    def.classList.add("over");
  });

  def.addEventListener("dragleave", () => {
    def.classList.remove("over");
  });

  def.addEventListener("drop", e => {
    e.preventDefault();
    def.classList.remove("over");
    const termId = e.dataTransfer.getData("text/plain");

    if (def.dataset.term === termId) {
      def.appendChild(draggedTerm);
      result.textContent = "✅ ¡Correcto!";
      result.style.color = "green";
    } else {
      result.textContent = "❌ Intenta de nuevo";
      result.style.color = "red";
    }
  });
});

