alert("JS Loaded");
let arr = [];
let comparisons = 0;
let swaps = 0;
let isSorted = false;
let baseArray = [];


function generateArray() {
    arr = [];
    comparisons = 0;
    swaps = 0;
    isSorted = false;

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

function loadRuns() {
    let container = document.getElementById("history");
    let btn = document.getElementById("runsBtn");

    // 🔁 Toggle OFF
    if (container.innerHTML !== "") {
        container.innerHTML = "";
        btn.innerText = "View Past Runs";
        return;
    }

    // 🔁 Toggle ON
    btn.innerText = "Hide Past Runs";

    fetch("https://sorting-backend-zc9n.onrender.com/runs")
    .then(res => res.json())
    .then(data => {
        let output = "<h3>Past Runs</h3>";
        output += "<table><tr><th>Algorithm</th><th>Size</th><th>Comparisons</th><th>Swaps</th></tr>";

        data.forEach(run => {
            output += `<tr>
                <td>${run.algorithm}</td>
                <td>${run.size}</td>
                <td>${run.comparisons}</td>
                <td>${run.swaps}</td>
            </tr>`;
        });

        output += "</table>";
        container.innerHTML = output;
    })
    .catch(err => console.log(err));
}

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

function markSorted() {
    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add("sorted");
    }
    isSorted = true;

    // 🔥 SEND DATA TO BACKEND
    fetch("https://sorting-backend-zc9n.onrender.com/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            algorithm: document.getElementById("algo").value,
            comparisons: comparisons,
            swaps: swaps,
            size: arr.length
        })
    })
    .then(res => res.json())
    .then(data => console.log("Saved:", data))
    .catch(err => console.error("Error:", err));
}

function startSort() {
    if (isSorted) {
        alert("Array already sorted. Generate a new array.");
        return;
    }

    let algo = document.getElementById("algo").value;

    // reset stats before sorting
    comparisons = 0;
    swaps = 0;
    updateStats();

    if (algo === "bubble") {
        bubbleSort();
    } else {
        selectionSort();
    }
}

function loadAnalytics() {
    let container = document.getElementById("analytics");
    let btn = document.getElementById("analyticsBtn");

    // 🔁 Toggle OFF
    if (container.innerHTML !== "") {
        container.innerHTML = "";
        btn.innerText = "Show Analytics";
        return;
    }

    // 🔁 Toggle ON
    btn.innerText = "Hide Analytics";

    fetch("https://sorting-backend-zc9n.onrender.com/runs")
    .then(res => res.json())
    .then(data => {

        let stats = {};

        data.forEach(run => {
            if (!stats[run.algorithm]) {
                stats[run.algorithm] = {
                    totalComp: 0,
                    totalSwaps: 0,
                    count: 0
                };
            }

            stats[run.algorithm].totalComp += run.comparisons;
            stats[run.algorithm].totalSwaps += run.swaps;
            stats[run.algorithm].count++;
        });

        let output = "<h3>Analytics</h3>";
        output += "<table><tr><th>Algorithm</th><th>Avg Comparisons</th><th>Avg Swaps</th></tr>";

        for (let algo in stats) {
            let avgComp = Math.round(stats[algo].totalComp / stats[algo].count);
            let avgSwaps = Math.round(stats[algo].totalSwaps / stats[algo].count);

            output += `<tr>
                <td>${algo}</td>
                <td>${avgComp}</td>
                <td>${avgSwaps}</td>
            </tr>`;
        }

        output += "</table>";
        container.innerHTML = output;
    })
    .catch(err => console.log(err));
}

function generateBaseArray() {
    baseArray = [];

    for (let i = 0; i < 30; i++) {
        baseArray.push(Math.floor(Math.random() * 200) + 20);
    }

    renderArray("array1", baseArray);
    renderArray("array2", baseArray);

    document.getElementById("comp1").innerText = 0;
    document.getElementById("swap1").innerText = 0;
    document.getElementById("comp2").innerText = 0;
    document.getElementById("swap2").innerText = 0;
}

function renderArray(containerId, array) {
    let container = document.getElementById(containerId);
    container.innerHTML = "";

    array.forEach(value => {
        let bar = document.createElement("div");
        bar.style.height = value + "px";
        bar.classList.add("bar");
        container.appendChild(bar);
    });
}

async function bubbleSortCompare(arr, containerId, compId, swapId) {
    let bars = document.getElementById(containerId).children;
    let comparisons = 0;
    let swaps = 0;
    let speed = document.getElementById("speed").value;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {

            comparisons++;
            document.getElementById(compId).innerText = comparisons;

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

                document.getElementById(swapId).innerText = swaps;
            }

            bars[j].classList.remove("active");
            bars[j+1].classList.remove("active");
        }
    }
}

async function selectionSortCompare(arr, containerId, compId, swapId) {
    let bars = document.getElementById(containerId).children;
    let comparisons = 0;
    let swaps = 0;
    let speed = document.getElementById("speed").value;

    for (let i = 0; i < arr.length; i++) {
        let min = i;

        for (let j = i + 1; j < arr.length; j++) {

            comparisons++;
            document.getElementById(compId).innerText = comparisons;

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

            document.getElementById(swapId).innerText = swaps;
        }

        bars[min].classList.remove("active");
    }
}

function compareMode() {
    generateBaseArray();

    let arr1 = [...baseArray];
    let arr2 = [...baseArray];

    bubbleSortCompare(arr1, "array1", "comp1", "swap1");
    selectionSortCompare(arr2, "array2", "comp2", "swap2");

    setTimeout(() => {
        saveComparisonRun();
    }, 2000); //delay
}

function saveComparisonRun() {
    fetch("https://sorting-backend-zc9n.onrender.com/saveComparison", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            algorithm1: "bubble",
            algorithm2: "selection",
            comp1: parseInt(document.getElementById("comp1").innerText),
            comp2: parseInt(document.getElementById("comp2").innerText),
            swap1: parseInt(document.getElementById("swap1").innerText),
            swap2: parseInt(document.getElementById("swap2").innerText),
            size: baseArray.length
        })
    })
    .then(res => res.json())
    .then(data => console.log("Comparison saved:", data))
    .catch(err => console.error(err));
}

function loadComparisons() {
    let container = document.getElementById("comparisons");
    let btn = document.getElementById("compareBtn");

    if (container.innerHTML !== "") {
        container.innerHTML = "";
        btn.innerText = "View Comparisons";
        return;
    }

    document.getElementById("history").innerHTML = "";
    document.getElementById("analytics").innerHTML = "";

    document.getElementById("runsBtn").innerText = "View Past Runs";
    document.getElementById("analyticsBtn").innerText = "Show Analytics";

    btn.innerText = "Hide Comparisons";

    fetch("https://sorting-backend-zc9n.onrender.com/comparisons")
    .then(res => res.json())
    .then(data => {

        let output = "<h3>Comparison History</h3>";
        output += "<table><tr><th>Algo 1</th><th>Algo 2</th><th>Comp1</th><th>Comp2</th><th>Swap1</th><th>Swap2</th><th>Size</th></tr>";

        data.forEach(run => {
            output += `<tr>
                <td>${run.algorithm1}</td>
                <td>${run.algorithm2}</td>
                <td>${run.comp1}</td>
                <td>${run.comp2}</td>
                <td>${run.swap1}</td>
                <td>${run.swap2}</td>
                <td>${run.size}</td>
            </tr>`;
        });

        output += "</table>";

        container.innerHTML = output;
    })
    .catch(err => console.log(err));
}