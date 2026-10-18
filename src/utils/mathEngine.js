import { create, all } from 'mathjs'

// Initialize mathjs instance
const math = create(all, {})

/**
 * Configure trigonometry to respect DEG or RAD mode
 */
export class MathCalculatorEngine {
  constructor() {
    this.angleMode = 'DEG' // 'DEG' or 'RAD'
    this.precision = 8
    this.displayFormat = 'standard' // 'standard', 'scientific', 'engineering', 'fraction'
  }

  setAngleMode(mode) {
    this.angleMode = mode === 'RAD' ? 'RAD' : 'DEG'
  }

  setPrecision(precision) {
    this.precision = Math.max(0, Math.min(16, precision))
  }

  setDisplayFormat(format) {
    this.displayFormat = format
  }

  /**
   * Helper to convert degrees to radians if in DEG mode
   */
  toRadians(degrees) {
    return (degrees * Math.PI) / 180
  }

  toDegrees(radians) {
    return (radians * 180) / Math.PI
  }

  /**
   * Build custom scope with angle-aware trigonometry and helper functions
   */
  getCustomScope() {
    const isDeg = this.angleMode === 'DEG'

    return {
      // Trigonometric functions
      sin: (x) => {
        const rad = isDeg ? this.toRadians(x) : x
        const res = Math.sin(rad)
        // Clean up floating point near-zeros like sin(180 deg) = 0
        return Math.abs(res) < 1e-15 ? 0 : res
      },
      cos: (x) => {
        const rad = isDeg ? this.toRadians(x) : x
        const res = Math.cos(rad)
        // Clean up floating point near-zeros like cos(90 deg) = 0
        return Math.abs(res) < 1e-15 ? 0 : res
      },
      tan: (x) => {
        const rad = isDeg ? this.toRadians(x) : x
        // Check for undefined tan(90 + 180k)
        const cosVal = Math.cos(rad)
        if (Math.abs(cosVal) < 1e-15) {
          throw new Error('Tangent undefined at 90° + k·180°')
        }
        const res = Math.tan(rad)
        return Math.abs(res) < 1e-15 ? 0 : res
      },
      asin: (x) => {
        if (x < -1 || x > 1) {
          throw new Error('Domain error for asin: -1 ≤ x ≤ 1')
        }
        const rad = Math.asin(x)
        return isDeg ? this.toDegrees(rad) : rad
      },
      acos: (x) => {
        if (x < -1 || x > 1) {
          throw new Error('Domain error for acos: -1 ≤ x ≤ 1')
        }
        const rad = Math.acos(x)
        return isDeg ? this.toDegrees(rad) : rad
      },
      atan: (x) => {
        const rad = Math.atan(x)
        return isDeg ? this.toDegrees(rad) : rad
      },
      atan2: (y, x) => {
        const rad = Math.atan2(y, x)
        return isDeg ? this.toDegrees(rad) : rad
      },

      // Hyperbolic functions
      sinh: (x) => Math.sinh(x),
      cosh: (x) => Math.cosh(x),
      tanh: (x) => Math.tanh(x),
      asinh: (x) => Math.asinh(x),
      acosh: (x) => {
        if (x < 1) throw new Error('Domain error for acosh: x ≥ 1')
        return Math.acosh(x)
      },
      atanh: (x) => {
        if (x <= -1 || x >= 1) throw new Error('Domain error for atanh: -1 < x < 1')
        return Math.atanh(x)
      },

      // Logarithms
      log: (x, base) => {
        if (x <= 0) throw new Error('Domain error: log argument must be > 0')
        if (base !== undefined) {
          if (base <= 0 || base === 1) throw new Error('Base must be > 0 and ≠ 1')
          return Math.log(x) / Math.log(base)
        }
        return Math.log10(x) // Default log is base 10 in standard scientific calculators
      },
      log10: (x) => {
        if (x <= 0) throw new Error('Domain error: log10 argument must be > 0')
        return Math.log10(x)
      },
      log2: (x) => {
        if (x <= 0) throw new Error('Domain error: log2 argument must be > 0')
        return Math.log2(x)
      },
      ln: (x) => {
        if (x <= 0) throw new Error('Domain error: ln argument must be > 0')
        return Math.log(x)
      },

      // Roots and Powers
      sqrt: (x) => {
        if (x < 0) {
          // Return complex number representation
          return math.complex(0, Math.sqrt(-x))
        }
        return Math.sqrt(x)
      },
      cbrt: (x) => Math.cbrt(x),
      nthRoot: (x, n) => {
        if (n === 0) throw new Error('Root degree cannot be 0')
        if (x < 0 && n % 2 === 0) {
          throw new Error('Even root of negative number is complex')
        }
        return x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)
      },

      // Permutations and Combinations
      nPr: (n, r) => {
        n = Math.floor(n)
        r = Math.floor(r)
        if (n < 0 || r < 0 || r > n) throw new Error('Invalid values: require 0 ≤ r ≤ n')
        let result = 1
        for (let i = n; i > n - r; i--) {
          result *= i
        }
        return result
      },
      nCr: (n, r) => {
        n = Math.floor(n)
        r = Math.floor(r)
        if (n < 0 || r < 0 || r > n) throw new Error('Invalid values: require 0 ≤ r ≤ n')
        if (r === 0 || r === n) return 1
        if (r > n / 2) r = n - r
        let result = 1
        for (let i = 1; i <= r; i++) {
          result = (result * (n - i + 1)) / i
        }
        return result
      },

      // Number theory
      gcd: (...args) => math.gcd(...args),
      lcm: (...args) => math.lcm(...args),
      mod: (a, b) => {
        if (b === 0) throw new Error('Cannot modulo by zero')
        return ((a % b) + b) % b
      },

      // Constants
      pi: Math.PI,
      PI: Math.PI,
      e: Math.E,
      E: Math.E,
      phi: 1.618033988749895, // Golden ratio

      // Random helpers
      rand: () => Math.random(),
      randInt: (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
      },

      // Absolute and Sign
      abs: (x) => Math.abs(x),
      fact: (x) => {
        if (x < 0) throw new Error('Factorial of negative number undefined')
        if (Math.floor(x) !== x) throw new Error('Factorial currently supports non-negative integers')
        if (x > 170) throw new Error('Factorial overflow (>170!)')
        return math.factorial(x)
      }
    }
  }

  /**
   * Preprocess human-friendly expressions into valid math.js syntax
   */
  preprocessExpression(expr) {
    if (!expr || typeof expr !== 'string') return ''

    let sanitized = expr.trim()

    // Replace display symbols with mathjs equivalents
    sanitized = sanitized
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/e(?![a-zA-Z0-9_])/g, 'e')
      .replace(/√\s*(\d+(\.\d+)?|[a-zA-Z]+|\([^)]+\))/g, 'sqrt($1)')
      .replace(/∛\s*(\d+(\.\d+)?|[a-zA-Z]+|\([^)]+\))/g, 'cbrt($1)')

    // Handle percentage syntax properly:
    // Case 1: X + Y% -> X + (X * Y / 100)
    // Case 2: X - Y% -> X - (X * Y / 100)
    // Case 3: X * Y% -> X * (Y / 100)
    // Case 4: X / Y% -> X / (Y / 100)
    // Case 5: Isolated N% -> (N / 100)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)%/g, '($1 $3 ($1 * $4 / 100))')
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)')

    // Handle postfix factorial: e.g. 5! -> fact(5) or (3+2)! -> fact(3+2)
    sanitized = sanitized.replace(/(\([^()]+\)|\d+(\.\d+)?|[a-zA-Z_]\w*)!/g, 'fact($1)')

    // Replace "mod" keyword with mod(a, b) or keep standard % if operator
    // Allow nPr and nCr syntax like "5 nPr 2" -> "nPr(5, 2)"
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s+nPr\s+(\d+(\.\d+)?)/gi, 'nPr($1, $3)')
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s+nCr\s+(\d+(\.\d+)?)/gi, 'nCr($1, $3)')
    sanitized = sanitized.replace(/(\d+(\.\d+)?)\s+mod\s+(\d+(\.\d+)?)/gi, 'mod($1, $3)')

    // Auto-close missing open parentheses
    let openCount = 0
    for (const char of sanitized) {
      if (char === '(') openCount++
      if (char === ')') openCount--
    }
    if (openCount > 0) {
      sanitized += ')'.repeat(openCount)
    }

    return sanitized
  }

  /**
   * Evaluate mathematical expression safely
   */
  evaluate(expression) {
    if (!expression || expression.trim() === '') {
      return { result: null, raw: null, error: null }
    }

    try {
      const processed = this.preprocessExpression(expression)
      const scope = this.getCustomScope()
      
      const compiled = math.compile(processed)
      const rawResult = compiled.evaluate(scope)

      // Handle special edge cases
      if (rawResult === undefined || rawResult === null) {
        return { result: null, raw: null, error: 'Empty expression' }
      }

      if (typeof rawResult === 'number' && !Number.isFinite(rawResult)) {
        if (Number.isNaN(rawResult)) {
          return { result: null, raw: null, error: 'Result is undefined (NaN)' }
        }
        return { result: null, raw: null, error: 'Cannot divide by zero (Infinity)' }
      }

      // Format result based on display preferences
      const formatted = this.formatResult(rawResult)

      return {
        result: formatted,
        raw: rawResult,
        error: null
      }
    } catch (err) {
      let message = err.message || 'Syntax Error'
      if (message.includes('Parenthesis ) expected') || message.includes('Unexpected type of argument')) {
        message = 'Invalid expression syntax'
      } else if (message.includes('Undefined symbol')) {
        message = message.replace('Undefined symbol', 'Unknown symbol')
      }
      return {
        result: null,
        raw: null,
        error: message
      }
    }
  }

  /**
   * Format result nicely (standard, scientific, engineering, fraction)
   */
  formatResult(val, customFormat = null) {
    const formatToUse = customFormat || this.displayFormat

    if (val === null || val === undefined) return ''

    // If complex number
    if (typeof val === 'object' && val.isComplex) {
      const re = Number(val.re.toFixed(this.precision))
      const im = Number(val.im.toFixed(this.precision))
      if (im === 0) return `${re}`
      if (re === 0) return `${im}i`
      return `${re} ${im > 0 ? '+' : '-'} ${Math.abs(im)}i`
    }

    if (typeof val !== 'number') {
      return String(val)
    }

    // Fraction format
    if (formatToUse === 'fraction') {
      return this.toFractionString(val)
    }

    // Scientific format
    if (formatToUse === 'scientific') {
      return val.toExponential(this.precision)
    }

    // Engineering format (exponent is multiple of 3)
    if (formatToUse === 'engineering') {
      return this.toEngineeringString(val)
    }

    // Standard format with intelligent precision
    if (Number.isInteger(val)) {
      return val.toString()
    }

    // Round to precision and strip trailing zeros
    const rounded = Number(val.toPrecision(this.precision))
    
    // Very small or very large numbers default to scientific
    if (Math.abs(rounded) > 1e14 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
      return rounded.toExponential()
    }

    // Convert to string and trim trailing zeroes after decimal
    const str = rounded.toString()
    if (str.includes('.')) {
      return str.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
    }
    return str
  }

  /**
   * Convert decimal number to Exact Irreducible Fraction and Mixed Fraction
   */
  toFractionString(decimal) {
    if (!Number.isFinite(decimal)) return String(decimal)
    if (Number.isInteger(decimal)) return `${decimal}`

    try {
      const frac = math.fraction(decimal)
      const n = frac.n * frac.s
      const d = frac.d

      if (d === 1) return `${n}`

      // Mixed number check
      const whole = Math.floor(Math.abs(n) / d)
      const remainder = Math.abs(n) % d

      if (whole > 0 && remainder > 0) {
        const sign = n < 0 ? '-' : ''
        return `${sign}${whole} ${remainder}/${d} (${n}/${d})`
      }

      return `${n}/${d}`
    } catch {
      return decimal.toString()
    }
  }

  /**
   * Engineering notation (exponent multiple of 3)
   */
  toEngineeringString(num) {
    if (num === 0) return '0'
    const exp = Math.floor(Math.log10(Math.abs(num)))
    const engExp = Math.floor(exp / 3) * 3
    const mantissa = num / Math.pow(10, engExp)
    const formattedMantissa = Number(mantissa.toFixed(this.precision))
    return `${formattedMantissa}e${engExp >= 0 ? '+' : ''}${engExp}`
  }

  /**
   * Prime checker with prime factorization breakdown
   */
  checkPrime(n) {
    n = Math.floor(Math.abs(Number(n)))
    if (!Number.isFinite(n) || n > 9007199254740991) {
      return { isPrime: false, error: 'Number too large or invalid' }
    }
    if (n < 2) {
      return { isPrime: false, number: n, factors: [], message: `${n} is neither prime nor composite.` }
    }
    if (n === 2 || n === 3) {
      return { isPrime: true, number: n, factors: [n], message: `${n} is a prime number!` }
    }
    if (n % 2 === 0) {
      const factors = this.getPrimeFactors(n)
      return { isPrime: false, number: n, factors, message: `${n} is composite (divisible by 2).` }
    }

    const limit = Math.sqrt(n)
    for (let i = 3; i <= limit; i += 2) {
      if (n % i === 0) {
        const factors = this.getPrimeFactors(n)
        return { isPrime: false, number: n, factors, message: `${n} is composite (divisible by ${i}).` }
      }
    }

    return { isPrime: true, number: n, factors: [n], message: `${n} is a prime number!` }
  }

  /**
   * Prime factors breakdown
   */
  getPrimeFactors(n) {
    const factors = []
    let divisor = 2
    let temp = n

    while (temp >= 2) {
      if (temp % divisor === 0) {
        factors.push(divisor)
        temp = temp / divisor
      } else {
        divisor = divisor === 2 ? 3 : divisor + 2
        if (divisor * divisor > temp) {
          if (temp > 1) factors.push(temp)
          break
        }
      }
    }
    return factors
  }
}

export const mathEngine = new MathCalculatorEngine()
