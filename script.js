let arr = [];
let comparisons = 0;
let swaps = 0;

function generateArray() {
    arr = [];
    comparisons = 0;
    swaps = 0;

    document.getElementById("comp").innerText = 0;
    document.getElementById("swap").innerText = 0;

    let container = document.getElementById("array");
    container.innerHTML = "";

    for (let i = 0; i < 30; i++) {
        let value = Math.floor(Math.random() * 200) + 20;
        arr.push(value);

        let bar = document.createElement("div");
        bar.style.height = value + "px";
        bar.classList.add("bar");

        container.appendChild(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
    document.getElementById("comp").innerText = comparisons;
    document.getElementById("swap").innerText = swaps;
}

// 🔵 Bubble Sort
async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
    let speed = document.getElementById("speed").value;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {

            comparisons++;
            updateStats();

            bars[j].classList.add("active");
            bars[j+1].classList.add("active");

            await sleep(speed);

            if (arr[j] > arr[j+1]) {
                swaps++;

                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;

                bars[j].style.height = arr[j] + "px";
                bars[j+1].style.height = arr[j+1] + "px";

                updateStats();
            }

            bars[j].classList.remove("active");
            bars[j+1].classList.remove("active");
        }
    }

    markSorted();
}

// 🟣 Selection Sort
async function selectionSort() {
    let bars = document.getElementsByClassName("bar");
    let speed = document.getElementById("speed").value;

    for (let i = 0; i < arr.length; i++) {
        let min = i;

        for (let j = i + 1; j < arr.length; j++) {

            comparisons++;
            updateStats();

            bars[j].classList.add("active");
            bars[min].classList.add("active");

            await sleep(speed);

            if (arr[j] < arr[min]) {
                bars[min].classList.remove("active");
                min = j;
                bars[min].classList.add("active");
            }

            bars[j].classList.remove("active");
        }

        if (min !== i) {
            swaps++;

            let temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;

            bars[i].style.height = arr[i] + "px";
            bars[min].style.height = arr[min] + "px";

            updateStats();
        }

        bars[min].classList.remove("active");
    }

    markSorted();
}

// 🟢 Mark all bars sorted
function markSorted() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add("sorted");
    }
}

// 🚀 Start Sorting
function startSort() {
    let algo = document.getElementById("algo").value;

    if (algo === "bubble") {
        bubbleSort();
    } else {
        selectionSort();
    }
}