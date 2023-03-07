const container = document.getElementById("container");
const checkOrderBtn = document.getElementById("checkOrderBtn");
const success = document.getElementById("success");
const error = document.getElementById("error");
const nextBtn = document.getElementById("nextOrderBtn");
const againBtn = document.getElementById("playAgainBtn");

let trial = 0;
let currentOrder = [];
let correctOrder = [];

// Initial visibility
checkOrderBtn.style.display = "inline";
success.style.display = "none";
error.style.display = "none";

// Create a Fischer-Yates shuffle function
const fisherYates = (toShuffle = []) => {
  for (let i = toShuffle.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [toShuffle[i], toShuffle[randomIndex]] = [
      toShuffle[randomIndex],
      toShuffle[i],
    ];
  }
  return toShuffle;
};

const sizePossibleValues = ["size-1", "size-2", "size-3", "size-4"];
const colorPossibleValues = ["color-1", "color-2", "color-3", "color-4"];

let sizeRandomValues = fisherYates(sizePossibleValues);
let colorRandomValues = fisherYates(colorPossibleValues);

const items = [
  {
    code: `<!-- Triangle -->
        <div
          id="triangle"
          class="shape"
          data-shape="shape-1"
          data-size="${sizeRandomValues[0]}"
          data-color="${colorRandomValues[0]}"
        >
          <svg class="${sizeRandomValues[0]} ${colorRandomValues[0]}" viewBox="0,0, 100, 100">
            <polygon points="50,5 5,95 95,95" stroke="black" stroke-width="3" />
          </svg>
        </div>`,
  },
  {
    code: `<!-- Square -->
        <div
          id="square"
          class="shape"
          data-shape="shape-2"
          data-size="${sizeRandomValues[1]}"
          data-color="${colorRandomValues[1]}"
        >
          <svg class="${sizeRandomValues[1]} ${colorRandomValues[1]}" viewBox="0,0, 100, 100">
            <rect
              x="3"
              y="3"
              width="94"
              height="94"
              stroke="black"
              stroke-width="3"
            />
          </svg>
        </div>`,
  },
  {
    code: `<!-- Pentagon -->
        <div
          id="pentagon"
          class="shape"
          data-shape="shape-3"
          data-size="${sizeRandomValues[2]}"
          data-color="${colorRandomValues[2]}"
        >
          <svg class="${sizeRandomValues[2]} ${colorRandomValues[2]}" viewBox="0,0, 100, 100">
            <polygon
              height="100"
              width="100"
              points="50,5 5,45 15,95 85,95 95,45"
              stroke="black"
              stroke-width="3"
            />
          </svg>
        </div>`,
  },
  {
    code: `<!-- Hexagon -->
        <div
          id="hexagon"
          class="shape"
          data-shape="shape-4"
          data-size="${sizeRandomValues[3]}"
          data-color="${colorRandomValues[3]}"
        >
          <svg class="${sizeRandomValues[3]} ${colorRandomValues[3]}" viewBox="0,0, 100, 100">
            <polygon
              points="30,5 70,5 95,50 70,95 30,95 5,50"
              stroke="black"
              stroke-width="3"
            />
          </svg>
        </div>`,
  },
];

let randomItems = [];

const possibleOrders = [
  {
    id: "1",
    label:
      "Trie de la forme la <strong>plus petite</strong> à la forme la <strong>plus grande</strong>.",
    expectedOrder: ["size-1", "size-2", "size-3", "size-4"],
    attribute: "data-size",
  },
  {
    id: "2",
    label:
      "Trie de la forme la <strong>plus grande</strong> à la forme la <strong>plus petite</strong>.",
    expectedOrder: ["size-4", "size-3", "size-2", "size-1"],
    attribute: "data-size",
  },
  {
    id: "3",
    label:
      "Trie de la forme la <strong>plus claire</strong> à la forme la <strong>plus foncée</strong>.",
    expectedOrder: ["color-1", "color-2", "color-3", "color-4"],
    attribute: "data-color",
  },
  {
    id: "4",
    label:
      "Trie de la forme la <strong>plus foncée</strong> à la forme la <strong>plus claire</strong>.",
    expectedOrder: ["color-4", "color-3", "color-2", "color-1"],
    attribute: "data-color",
  },
  {
    id: "5",
    label:
      "Trie de la forme avec le <strong>moins de côtés</strong> à la forme avec le <strong>plus de côtés</strong>.",
    expectedOrder: ["shape-1", "shape-2", "shape-3", "shape-4"],
    attribute: "data-shape",
  },
  {
    id: "6",
    label:
      "Trie de la forme avec le <strong>plus de côtés</strong> à la forme avec le <strong>moins de côtés</strong>.",
    expectedOrder: ["shape-4", "shape-3", "shape-2", "shape-1"],
    attribute: "data-shape",
  },
];

shuffleOrders = fisherYates(possibleOrders);

// Populate container with shapes
function populateContainer() {
  if (trial < shuffleOrders.length) {
    nextBtn.style.display = "inline";
    againBtn.style.display = "none";
  } else {
    trial = 0;
    nextBtn.style.display = "none";
    againBtn.style.display = "inline";
  }
  container.innerHTML = "";
  randomItems = fisherYates(items);
  randomItems.forEach((item) => {
    container.insertAdjacentHTML("beforeend", item.code);
  });
  // Update current order of shapes
  currentOrder = Array.from(container.children).map(
    (shape) => shape.attributes[shuffleOrders[trial].attribute].value
  );

  // Check wheter the order is the same as the expected order from start
  while (arraysEqual(currentOrder, shuffleOrders[trial].expectedOrder)) {
    populateContainer();
  }

  // Show instructions
  document.getElementById("instructions").innerHTML =
    shuffleOrders[trial].label;

  // Reset button
  checkOrderBtn.style.display = "inline";
  success.style.display = "none";
  error.style.display = "none";
}

populateContainer();

// Show instructions
document.getElementById("instructions").innerHTML = shuffleOrders[trial].label;

// Initialize sortablejs library on the container element
const sortable = new Sortable(container, {
  animation: 150,

  onStart: (evt) => {
    checkOrderBtn.style.display = "inline";
    success.style.display = "none";
    error.style.display = "none";
  },
  onEnd: (evt) => {
    // Update current order of shapes
    currentOrder = Array.from(container.children).map(
      (shape) => shape.attributes[shuffleOrders[trial].attribute].value
    );

    console.log(currentOrder);

    // Move element to new position in array
    const item = evt.item;
    const fromIndex = evt.oldIndex;
    const toIndex = evt.newIndex;
    const items = Array.from(container.children);
    items.splice(fromIndex, 1);
    items.splice(toIndex, 0, item);
  },
});

// Check order of shapes when button is clicked
checkOrderBtn.addEventListener("click", () => {
  correctOrder = shuffleOrders[trial].expectedOrder;

  console.log(currentOrder, correctOrder);
  if (arraysEqual(currentOrder, correctOrder)) {
    checkOrderBtn.style.display = "none";
    success.style.display = "block";
    error.style.display = "none";
  } else {
    checkOrderBtn.style.display = "none";
    success.style.display = "none";
    error.style.display = "block";
  }
});

// Helper function to check if two arrays are equal
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

// Next trial
document.getElementById("nextOrderBtn").addEventListener("click", () => {
  trial++;
  populateContainer();
});

// Again trial
document.getElementById("playAgainBtn").addEventListener("click", () => {
  trial = 0;
  randomItems = fisherYates(items);
  shuffleOrders = fisherYates(possibleOrders);
  populateContainer();
  checkOrderBtn.style.display = "inline";
  success.style.display = "none";
  error.style.display = "none";
});
