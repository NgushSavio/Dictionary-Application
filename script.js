const input = document.querySelector("input");
const button = document.querySelector("button");
const dictionary = document.querySelector(".dictionary-app"); // ✅ added dot for class selector

// Fetch function
async function dictionaryFn(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const data = await res.json();
  return data[0];
}

// Click event (was BigInt.addEventListener before)
button.addEventListener("click", fetchandCreateCard);

// Add Enter key support
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchandCreateCard();
  }
});

// Main logic
async function fetchandCreateCard() {
  const word = input.value.trim();
  if (!word) {
    alert("Please enter a word!");
    return;
  }

  try {
    const data = await dictionaryFn(word);
    console.log(data);

    // Safely extract part of speech
    let partOfSpeechArray = [];
    for (let i = 0; i < data.meanings.length; i++) {
      partOfSpeechArray.push(data.meanings[i].partOfSpeech);
    }

    // Extract safely (avoid errors when undefined)
    const definition = data.meanings[0]?.definitions[0]?.definition || "No definition found";
    const example = data.meanings[0]?.definitions[0]?.example || "No example available";
    const phonetic = data.phonetic || "N/A";
    const audio = data.phonetics[0]?.audio || "";

    // Render card
    dictionary.innerHTML = `
      <div class="card">
        <div class="property">
          <span>Word:</span>
          <span>${data.word}</span>
        </div>
        <div class="property">
          <span>Phonetics:</span>
          <span>${phonetic}</span>
        </div>
        <div class="property">
          <span>Audio:</span>
          ${
            audio
              ? `<audio controls src="${audio}"></audio>`
              : `<span>No audio available</span>`
          }
        </div>
        <div class="property">
          <span>Definition:</span>
          <span>${definition}</span>
        </div>
        <div class="property">
          <span>Example:</span>
          <span>${example}</span>
        </div>
        <div class="property">
          <span>Part of Speech:</span>
          <span>${partOfSpeechArray.join(", ")}</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    dictionary.innerHTML = `
      <div class="card">
        <div class="property">
          <span>Error:</span>
          <span>Word not found. Please try another one!</span>
        </div>
      </div>
    `;
  }
}

