let edges = [];

// Function to add edge input fields dynamically
function addEdgeInput() {
  const edgesDiv = document.getElementById("edges");
  const edgeInput = document.createElement("div");
  edgeInput.innerHTML = `
    <input type="number" class="input-field edge-input" placeholder="u">
    <input type="number" class="input-field edge-input" placeholder="v">
  `;
  edgesDiv.appendChild(edgeInput);
}

// Function to handle graph submission
function submitGraph() {
  const vertices = parseInt(document.getElementById("vertices").value);
  const k = parseInt(document.getElementById("k").value);
  const start = parseInt(document.getElementById("start").value);
  const end = parseInt(document.getElementById("end").value);

  // Collect edges from input fields
  edges = [];
  const edgeInputs = document.querySelectorAll(".edge-input");
  for (let i = 0; i < edgeInputs.length; i += 2) {
    const u = parseInt(edgeInputs[i].value);
    const v = parseInt(edgeInputs[i + 1].value);
    if (!isNaN(u) && !isNaN(v)) {
      edges.push([u, v]);
    }
  }

  // Validate inputs
  if (
    isNaN(vertices) || isNaN(k) || isNaN(start) || isNaN(end) ||
    start < 0 || start >= vertices || end < 0 || end >= vertices
  ) {
    alert("Please fill in all fields correctly and ensure vertices are within range.");
    return;
  }

  console.log("Vertices:", vertices, "Edges:", edges, "k:", k, "Start:", start, "End:", end);

  // Create adjacency matrix
  const adjMatrix = Array.from({ length: vertices }, () => Array(vertices).fill(0));
  edges.forEach(([u, v]) => {
    if (u >= 0 && u < vertices && v >= 0 && v < vertices) {
      adjMatrix[u][v] += 1; // Increment for directed graph
    }
  });

  console.log("Adjacency Matrix:", adjMatrix);

  // Calculate number of paths of length k using matrix exponentiation
  const startTime = performance.now(); // Start timing
  const result = countPaths(adjMatrix, start, end, k);
  const endTime = performance.now(); // End timing

  // Calculate time complexity
  const timeComplexity = `O(${vertices}^3 * log(${k}))`;
  const executionTime = (endTime - startTime).toFixed(2); // Execution time in milliseconds

  // Display the result
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `
    Number of paths of length ${k} from ${start} to ${end}: ${result}<br>
    Time Complexity: ${timeComplexity}<br>
    Execution Time: ${executionTime} ms
  `;
}

// Function to calculate number of paths of length k using matrix exponentiation
function countPaths(adjMatrix, start, end, k) {
  const n = adjMatrix.length;

  // Helper function to multiply two matrices
  function multiplyMatrices(a, b) {
    const result = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let l = 0; l < n; l++) {
          result[i][j] += a[i][l] * b[l][j];
        }
      }
    }
    return result;
  }

  // Helper function to perform matrix exponentiation
  function matrixExponentiation(matrix, exp) {
    let result = Array.from({ length: n }, (_, i) => Array(n).fill(0));
    for (let i = 0; i < n; i++) result[i][i] = 1; // Identity matrix

    while (exp > 0) {
      if (exp % 2 === 1) result = multiplyMatrices(result, matrix);
      matrix = multiplyMatrices(matrix, matrix);
      exp = Math.floor(exp / 2);
    }
    return result;
  }

  // Perform matrix exponentiation
  const poweredMatrix = matrixExponentiation(adjMatrix, k);
  return poweredMatrix[start][end];
}
