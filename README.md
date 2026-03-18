# arch-to-code 📐

> Visual Infrastructure as Code. Draw it. Generate it.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/Status-Beta-brightgreen.svg)]()

`arch-to-code` is a client-side web application that lets you visually drag-and-drop cloud architecture components onto an interactive canvas. Once connected, an LLM (OpenAI) instantly compiles your visual graph into production-ready HashiCorp Terraform (`main.tf`) code.

Built with React, Vite, React Flow (`@xyflow/react`), and the [`@dinakars777/react-glass-ui`](https://github.com/dinakars777/react-glass-ui) design system.

---

## Why?

Writing Terraform, AWS CDK, or Kubernetes YAML by hand is tedious and error-prone. `arch-to-code` bridges the gap between high-level architecture diagrams and DevOps execution — what you draw is exactly what gets deployed.

---

## Features

- **Interactive Canvas** — Drag and drop AWS nodes: EC2, S3, RDS, Lambda, VPC, IAM, and more
- **Smart Routing** — Connect nodes to define dependencies, security group rules, and network topology
- **AI Terraform Generation** — Click "Generate Terraform" to compile your diagram into valid HCL instantly
- **Secure by Design** — Your OpenAI API key lives only in browser local state, never sent to an intermediate server
- **Glassmorphism UI** — Fluid, animated interface built with pure CSS glassmorphism

---

## 🚀 Getting Started

This is a fully client-side Vite app — no backend required.

```bash
git clone https://github.com/dinakars777/arch-to-code
cd arch-to-code
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

You'll be prompted to enter your OpenAI API key on first use. It's stored only in your browser's local state.

---

## Built With

| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| `@xyflow/react` | Canvas & node routing |
| `lucide-react` | Icons |
| `openai` | Terraform generation via LLM |
| `@dinakars777/react-glass-ui` | Glassmorphism design system |

---

## Roadmap

- [ ] GCP and Azure node support
- [ ] Export to AWS CDK (TypeScript)
- [ ] Export to Kubernetes YAML
- [ ] Save/load diagrams locally
- [ ] Multi-cloud architecture support

---

## License

MIT
