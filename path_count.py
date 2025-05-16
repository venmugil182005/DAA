# def multiply(A, B):
#     n = len(A)
#     result = [[0]*n for _ in range(n)]
#     for i in range(n):
#         for j in range(n):
#             for k in range(n):
#                 result[i][j] += A[i][k] * B[k][j]
#     return result

# def matrix_power(matrix, k):
#     n = len(matrix)
#     result = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
#     while k > 0:
#         if k % 2 == 1:
#             result = multiply(result, matrix)
#         matrix = multiply(matrix, matrix)
#         k //= 2
#     return result

# # Take user input
# n = int(input("Enter number of vertices: "))
# e = int(input("Enter number of edges: "))

# # Initialize adjacency matrix
# adj = [[0]*n for _ in range(n)]

# print("Enter each edge as 'u v' (from u to v):")
# for _ in range(e):
#     u, v = map(int, input().split())
#     adj[u][v] = 1

# k = int(input("Enter path length k: "))
# i = int(input("Enter start vertex i: "))
# j = int(input("Enter end vertex j: "))

# # Compute A^k
# power_matrix = matrix_power(adj, k)

# # Output the number of paths
# print(f"Number of paths of length {k} from vertex {i} to {j}: {power_matrix[i][j]}")
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

def multiply(A, B):
    n = len(A)
    result = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                result[i][j] += A[i][k] * B[k][j]
    return result

def matrix_power(matrix, k):
    n = len(matrix)
    result = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
    while k > 0:
        if k % 2 == 1:
            result = multiply(result, matrix)
        matrix = multiply(matrix, matrix)
        k //= 2
    return result

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compute', methods=['POST'])
def compute():
    data = request.json
    n = data['vertices']
    edges = data['edges']
    k = data['k']
    i = data['start']
    j = data['end']
    
    adj = [[0]*n for _ in range(n)]
    for edge in edges:
        u, v = edge
        adj[u][v] = 1

    power_matrix = matrix_power(adj, k)
    result = power_matrix[i][j]
    
    return jsonify({
        "adjMatrix": adj,
        "powerMatrix": power_matrix,
        "result": result
    })

if __name__ == '__main__':
    app.run(debug=True)

