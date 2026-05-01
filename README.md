# arch-to-code 📐

> Visual Infrastructure as Code. Draw it. Generate it.

🔗 **[Live Demo](https://dinakars777.github.io/arch-to-code/)**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Status](https://img.shields.io/badge/Status-Beta-brightgreen.svg)]()

Drag cloud architecture components onto a canvas. Connect them. Click generate. Get Terraform code.

Client-side only. Your OpenAI key stays in your browser.

Built with React, Vite, React Flow, and [`@dinakars777/react-glass-ui`](https://github.com/dinakars777/react-glass-ui).

---

## Why?

Writing Terraform by hand is slow. Diagrams are faster but don't deploy. This tool does both — what you draw becomes what you deploy.

---

## Features

- **Interactive Canvas** — Drag AWS nodes: EC2, S3, RDS, Lambda, VPC, IAM
- **Smart Routing** — Connect nodes to define dependencies and network topology
- **AI Terraform Generation** — Click generate, get valid HCL
- **Secure** — Your OpenAI key stays in browser local storage, never leaves your machine
- **Glassmorphism UI** — Fluid, animated interface

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
