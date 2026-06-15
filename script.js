const search = document.getElementById("search");

search.addEventListener("input", () => {

  const text = search.value.toLowerCase();

  document.querySelectorAll(".card").forEach(card => {

    card.style.display =
      card.innerText.toLowerCase().includes(text)
      ? "block"
      : "none";

  });

});
