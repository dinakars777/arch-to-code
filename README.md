# arch-to-code 📐

> Visual Infrastructure as Code. Draw it. Generate it.

`arch-to-code` is a stunning, client-side web application that lets you visually drag-and-drop cloud architecture components onto an interactive canvas. Once connected, an LLM (OpenAI) instantly compiles your visual graph into production-ready HashiCorp Terraform (`main.tf`) code.

Built entirely with React, Vite, React Flow (`@xyflow/react`), and the premium `@dinakars777/react-glass-ui` design system.

![arch-to-code demo](https://img.shields.io/badge/Status-Beta-brightgreen.svg)

## Why?
Writing AWS CDK, Terraform, or Kubernetes YAML files is notoriously tedious and error-prone. With `arch-to-code`, you bridge the gap between High-Level Architecture Diagrams and DevOps execution. What you draw is exactly what gets deployed.

## 🚀 Getting Started

Since this is a client-side Vite application, you can run it locally with zero backend dependencies:

```bash
git clone https://github.com/dinakars777/arch-to-code
cd arch-to-code
npm install
npm run dev
```

Then, open `http://localhost:5173` in your browser.

## Features
* **Interactive Canvas**: Drag and drop visual nodes like EC2, S3, RDS, Lambda, VPC, and IAM.
* **Smart Routing**: Connect nodes to establish explicit dependencies, security group rules, and network architectures.
* **Instant Compilation**: Click "Generate Terraform" to let the integrated AI instantly compile your entire diagram into valid HCL code.
* **Secure by Design**: Your OpenAI API key is purely retained in your browser's local state and is never transmitted to an intermediate server, ensuring maximum security.
* **Glassmorphism UI**: A breathtaking, fluid, and animated interface completely utilizing pure CSS Glassmorphism logic.

## Built With
- React 18 + TypeScript
- Vite
- `@xyflow/react` (Canvas & Routing)
- `lucide-react` (Icons)
- `@dinakars777/react-glass-ui` (Interface)

## License
MIT
