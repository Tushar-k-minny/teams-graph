# Team Skill Map

A premium, interactive graph visualization tool built to map out team members and their associated technical skills. Built using Next.js, React, Cytoscape.js, and Tailwind CSS.

## 🚀 Features

- **Interactive Graph Visualization:** Leverage Cytoscape.js to build, traverse, and manage a map of your team's ecosystem.
- **Dynamic Entities:**
  - **People Nodes:** Users and Team Members.
  - **Skill Nodes:** Specific tools, languages, and frameworks.
  - **Relations:** Edges mapping team members to skills with varying proficiency levels (`Learning`, `Familiar`, `Expert`).
- **Premium UI & Glassmorphism:** Designed using dark, semi-transparent frosted panels, glowing gradients, and animated interactions.
- **Multiple Graph Layouts:** Seamlessly switch between different automated topological structures:
  - 2-Column Structure (Breadthfirst)
  - Fluid Clustering (Cose)
  - Grid Structure
  - Circular Radial
  - Concentric Circles
- **Minimap / Trackpad:** Traverse large graph networks easily using an anchored, toggleable minimized view of the map.
- **Detailed Sidebar:** Click on any person, skill, or connection to open an expansive details panel to review, edit, or delete the data.
- **CSV Data Import:** Bulk ingest teams, skills, and mapping rules quickly.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Graph Engine:** [Cytoscape.js](https://js.cytoscape.org/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Package Manager:** [Bun](https://bun.sh/) (or your preferred manager: npm, yarn, pnpm)

## 📦 Setting Up the App

The project expects a modern Node.js environment. We heavily recommend using [Bun](https://bun.sh/) for ultra-fast dependency resolution and execution.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd teams-graph
```

### 2. Install Dependencies
Make sure you are in the project root folder.
```bash
# If using bun (recommended)
bun install

# Alternatively, using npm
npm install

# Alternatively, using yarn
yarn install
```

## 🏃‍♂️ Running the Application

### Development Server
After installing dependencies, spin up the local development server:
```bash
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production
To create an optimized production build:
```bash
bun run build
# or: npm run build
```

To start the production server:
```bash
bun run start
# or: npm run start
```

## 💡 How to Use

1. **Add Nodes:** Use the top floating Action Bar to create new `People` and `Skills`.
2. **Connect Things:** Click `Add Connection` in the top bar, pick a source (Person) and target (Skill), and specify a proficiency Level.
3. **Inspect Elements:** Click on any element directly on the canvas (or edge line) to peel open the dynamic side panel.
4. **Layout Navigation:** Use the Zoom controls and the Layout Dropdown at the bottom right to reorganize the visual tree structure on the fly.
5. **Drag & Pan:** Hold click anywhere on the background to pan around, or click + drag any specific node to repin it physically. Use the expanding Minimap at the top right to jump to specific sectors if you get lost!
