import { create, all } from 'mathjs'

const math = create(all, {})

export class MatrixEngine {
  /**
   * Create an empty matrix with specified rows and cols
   */
  static createMatrix(rows, cols, fillVal = 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(fillVal))
  }

  /**
   * Create an identity matrix of size n
   */
  static createIdentity(n) {
    const mat = this.createMatrix(n, n, 0)
    for (let i = 0; i < n; i++) {
      mat[i][i] = 1
    }
    return mat
  }

  /**
   * Create a random matrix
   */
  static createRandom(rows, cols, min = -5, max = 10) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * (max - min + 1)) + min)
    )
  }

  /**
   * Add two matrices
   */
  static add(matrixA, matrixB) {
    const rA = matrixA.length
    const cA = matrixA[0]?.length || 0
    const rB = matrixB.length
    const cB = matrixB[0]?.length || 0

    if (rA !== rB || cA !== cB) {
      throw new Error(`Dimension mismatch: Cannot add ${rA}×${cA} matrix to ${rB}×${cB} matrix. Dimensions must match.`)
    }

    try {
      const result = math.add(matrixA, matrixB)
      return Array.isArray(result) ? result : result.toArray()
    } catch (err) {
      throw new Error(`Addition failed: ${err.message}`)
    }
  }

  /**
   * Subtract two matrices (A - B)
   */
  static subtract(matrixA, matrixB) {
    const rA = matrixA.length
    const cA = matrixA[0]?.length || 0
    const rB = matrixB.length
    const cB = matrixB[0]?.length || 0

    if (rA !== rB || cA !== cB) {
      throw new Error(`Dimension mismatch: Cannot subtract ${rB}×${cB} matrix from ${rA}×${cA} matrix.`)
    }

    try {
      const result = math.subtract(matrixA, matrixB)
      return Array.isArray(result) ? result : result.toArray()
    } catch (err) {
      throw new Error(`Subtraction failed: ${err.message}`)
    }
  }

  /**
   * Multiply two matrices (A * B)
   */
  static multiply(matrixA, matrixB) {
    const rA = matrixA.length
    const cA = matrixA[0]?.length || 0
    const rB = matrixB.length
    const cB = matrixB[0]?.length || 0

    if (cA !== rB) {
      throw new Error(
        `Multiplication impossible: Columns of Matrix A (${cA}) must equal Rows of Matrix B (${rB}). Resulting matrix would be ${rA}×${cB}.`
      )
    }

    try {
      const result = math.multiply(matrixA, matrixB)
      return Array.isArray(result) ? result : result.toArray()
    } catch (err) {
      throw new Error(`Multiplication failed: ${err.message}`)
    }
  }

  /**
   * Transpose of matrix
   */
  static transpose(matrix) {
    try {
      const result = math.transpose(matrix)
      return Array.isArray(result) ? result : result.toArray()
    } catch (err) {
      throw new Error(`Transpose failed: ${err.message}`)
    }
  }

  /**
   * Determinant of square matrix
   */
  static determinant(matrix) {
    const rows = matrix.length
    const cols = matrix[0]?.length || 0

    if (rows !== cols) {
      throw new Error(`Determinant requires a square matrix (${rows}×${cols} is not square).`)
    }

    try {
      const det = math.det(matrix)
      // Clean near-zero floating point results
      return Math.abs(det) < 1e-12 ? 0 : Number(det.toFixed(8))
    } catch (err) {
      throw new Error(`Determinant calculation failed: ${err.message}`)
    }
  }

  /**
   * Inverse of square matrix
   */
  static inverse(matrix) {
    const rows = matrix.length
    const cols = matrix[0]?.length || 0

    if (rows !== cols) {
      throw new Error(`Matrix inverse requires a square matrix (${rows}×${cols} is not square).`)
    }

    const det = this.determinant(matrix)
    if (Math.abs(det) < 1e-12) {
      throw new Error(`Singular matrix: Determinant is 0, so the inverse does not exist.`)
    }

    try {
      const inv = math.inv(matrix)
      const raw = Array.isArray(inv) ? inv : inv.toArray()
      // Round very close floating point errors
      return raw.map(row =>
        row.map(cell => (Math.abs(cell) < 1e-12 ? 0 : Number(cell.toFixed(8))))
      )
    } catch (err) {
      throw new Error(`Inversion failed: ${err.message}`)
    }
  }

  /**
   * Multiply matrix by scalar
   */
  static scalarMultiply(matrix, scalar) {
    try {
      const result = math.multiply(matrix, Number(scalar))
      return Array.isArray(result) ? result : result.toArray()
    } catch (err) {
      throw new Error(`Scalar multiplication failed: ${err.message}`)
    }
  }

  /**
   * Trace of square matrix (sum of diagonal elements)
   */
  static trace(matrix) {
    const rows = matrix.length
    const cols = matrix[0]?.length || 0
    if (rows !== cols) {
      throw new Error(`Trace requires a square matrix.`)
    }
    let sum = 0
    for (let i = 0; i < rows; i++) {
      sum += matrix[i][i]
    }
    return sum
  }

  /**
   * Format matrix to string (e.g. for copying or export)
   */
  static toString(matrix) {
    if (!matrix || !Array.isArray(matrix)) return ''
    return matrix.map(row => '[' + row.map(v => Number.isFinite(v) ? v : '?').join(',\t') + ']').join('\n')
  }
}
