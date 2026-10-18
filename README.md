# OmniCalc Pro — All-in-One Scientific & Matrix Calculator

**OmniCalc Pro** is a modern, high-precision scientific calculator and linear algebra studio built with **React**, **Tailwind CSS**, and **math.js**. It features full support for basic arithmetic, advanced trigonometry, hyperbolic functions, logarithms, matrix computations, number theory tools, memory management, and calculation history.

---

## 🚀 Live Demo & Key Features

### 1. Basic Arithmetic & Precedence
- **Operations**: Addition (`+`), subtraction (`−`), multiplication (`×`), division (`÷`), modulo (`mod`), and percentages (`%`).
- **Mathematical Precedence**: Full BODMAS/PEMDAS order of operations parsing.
- **Percentages**: Intelligently handles percentages (e.g. `200 + 10% = 220`, `50% * 200 = 100`).
- **Decimals & Sign**: Decimals (`.`), negative numbers, negation key (`±`).
- **Parentheses**: Automatic closing of nested parentheses and syntax validation.

### 2. Scientific Calculations
- **Trigonometry**: `sin`, `cos`, `tan` with real-time `DEG` (degrees) and `RAD` (radians) mode switching.
- **Inverse Trigonometry**: `sin⁻¹` (`asin`), `cos⁻¹` (`acos`), `tan⁻¹` (`atan`).
- **Hyperbolic Functions**: `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`.
- **Logarithms**: Common logarithm (`log` / base 10), natural logarithm (`ln` / base $e$), `10ˣ`, and `eˣ`.
- **Powers & Exponents**: $x^2$, $x^3$, $x^y$, square roots ($\sqrt{x}$), cube roots ($\sqrt[3]{x}$), and $n$-th roots ($^y\sqrt{x}$).
- **Factorials**: Postfix factorial ($n!$) with bounds validation.
- **Mathematical Constants**: Archimedes' constant $\pi$ (Pi), Euler's number $e$, and the golden ratio $\phi$.

### 3. Linear Algebra & Matrix Studio
- Dedicated interactive studio supporting matrices from $1\times 1$ up to $5\times 5$ (presets for $2\times 2$, $3\times 3$, and $4\times 4$).
- **Matrix Addition & Subtraction**: $A + B$, $A - B$ with automatic dimension compatibility validation.
- **Matrix Multiplication**: $A \times B$ ensuring columns of $A$ match rows of $B$.
- **Determinant**: $\det(A)$ and $\det(B)$ for square matrices.
- **Inverse Matrix**: $A^{-1}$ and $B^{-1}$ with singular matrix ($\det = 0$) protection.
- **Transpose**: $A^T$ and $B^T$.
- **Trace**: $\text{Tr}(A)$ and $\text{Tr}(B)$.
- **Scalar Multiplication**: $k \cdot A$ and $k \cdot B$.
- **Chained Computations**: Instant "Store in Matrix A" and "Store in Matrix B" forwarding.

### 4. Advanced Number Theory Tools
- **Prime Number Checker & Factorization**: Analyzes any integer, tests for primality, and provides its prime factorization tree (e.g. $180 = 2^2 \times 3^2 \times 5$).
- **GCD & LCM Solver**: Computes the Greatest Common Divisor and Least Common Multiple of multiple comma-separated values.
- **Permutations ($nPr$) & Combinations ($nCr$)**: High-precision combinatorics solver.
- **Fraction & Mixed Number Converter**: Converts any decimal into its exact irreducible rational fraction and mixed number ($2.75 \rightarrow 2\ 3/4$).
- **Random Number Generator**: Cryptographic/uniform random generator with bounds, batch size, and uniqueness toggles.

### 5. Memory Management & History
- **Memory Operations**: `MC` (Clear), `MR` (Recall), `M+` (Add), `M-` (Subtract), and `MS` (Store) with persistent indicator badge.
- **Calculation History**: Automatic timestamped logs, filter/search, one-click expression/result reuse, text export, and entry removal.
- **Local Persistence**: Calculation history, memory, precision, theme, and angle mode persist across browser refreshes via `LocalStorage`.

### 6. User Experience & Aesthetics
- **Display**: Dual-line layout with live preview results as you type and fraction toggle button (`a/b ⇄ 0.0`).
- **Themes**: Dark Slate, Modern Clean Light, and Cyberpunk Neon.
- **Tactile Audio**: Synthesized Web Audio API mechanical feedback on keypresses and calculations.
- **Responsive Layout**: Optimized for desktop, tablets, and smartphones.

---

## ⌨️ Physical Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `0` - `9` | Input numbers |
| `+`, `-`, `*`, `/` | Basic arithmetic (`+`, `−`, `×`, `÷`) |
| `Enter` or `=` | Calculate expression |
| `Backspace` | Delete last character |
| `Escape` | All Clear (`AC`) |
| `(`, `)` | Parentheses |
| `^` | Power / Exponent ($x^y$) |
| `%` | Percentage |
| `!` | Factorial ($n!$) |
| `s`, `c`, `t` | Trigonometric `sin(`, `cos(`, `tan(` |
| `l`, `n` | `log(` (base 10) and `ln(` (natural log) |
| `r` | Square root `sqrt(` |
| `p`, `e` | Constants $\pi$ and $e$ |
| `h` | Toggle calculation history drawer |
| `?` | Open keyboard shortcuts cheatsheet |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite |
| **Mathematical Engine** | [math.js](https://mathjs.org/) (Safe evaluation; zero `eval()`) |
| **Styling** | Vanilla CSS + Tailwind CSS v4 |
| **Iconography** | Lucide React |
| **Audio** | HTML5 Web Audio API Synthesizer |
| **State & Persistence** | React Hooks (`useState`, `useEffect`, `useCallback`) + `localStorage` |

---

## 📦 Getting Started & Local Development

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app will be accessible at `http://localhost:5173/`.

### 3. Production Build
```bash
npm run build
```
The bundled production files will be output to the `dist/` directory.

---

## 🌐 Deployment Guidelines

### Option A: Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root and follow the prompts.
3. Or link your GitHub repository on [vercel.com](https://vercel.com) for automated continuous deployment.

### Option B: Netlify
1. Build the production app: `npm run build`
2. Drag and drop the `dist/` folder into Netlify Drop, or connect via Git.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Option C: AWS EC2 (Nginx + Ubuntu)
1. Launch an Ubuntu EC2 instance and connect via SSH.
2. Install Node.js, npm, and Nginx:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm nginx git
   ```
3. Clone the repository and build:
   ```bash
   git clone <REPO_URL> && cd calculator-appl
   npm install && npm run build
   ```
4. Copy the `dist` folder to Nginx's web root:
   ```bash
   sudo rm -rf /var/www/html/*
   sudo cp -r dist/* /var/www/html/
   ```
5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```
