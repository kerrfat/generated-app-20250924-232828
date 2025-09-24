# LexiLeap: The Playful Word Game Universe

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kerrfat/generated-app-20250924-232828)

LexiLeap is a vibrant and engaging web application designed to make vocabulary building fun for all ages. It's a universe of word games, including crosswords, scrabble-style challenges, word searches, anagrams, and mini-quizzes. The application is built with a 'Kid Playful' aesthetic, featuring bright colors, rounded shapes, and delightful animations to create an encouraging and enjoyable learning environment. Each game is powered by a flexible JSON-based system, allowing for easy content management and expansion.

## ✨ Key Features

-   **Multiple Game Types:** Enjoy a variety of word games including Crosswords, Word Searches, Scrabble-style challenges, Anagrams, and timed Mini-Quizzes.
-   **Dynamic Content:** Games are defined using a flexible JSON-based system, making it easy to add new puzzles and categories.
-   **Categories & Difficulty:** Filter games by theme and select a difficulty level that's right for you.
-   **Playful User Experience:** A kid-friendly but adult-accessible design with rounded buttons, emojis, confetti, and smooth animations.
-   **Analytics:** Tracks game plays, scores, and completion times to help improve the experience.
-   **Simple Registration:** An optional, non-intrusive newsletter registration to stay updated.
-   **Admin Panel:** A secure page for administrators to manage game content, view analytics, and export newsletter data.

## 🚀 Technology Stack

-   **Frontend:** React, TypeScript, Vite, Tailwind CSS
-   **UI Components:** shadcn/ui, Radix UI
-   **State Management:** Zustand
-   **Animations:** Framer Motion
-   **Icons:** Lucide React
-   **Backend:** Cloudflare Workers, Hono
-   **Storage:** Cloudflare Durable Objects
-   **Tooling:** Bun, ESLint, TypeScript

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd lexileap
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, which includes the Vite frontend and the local Wrangler server for the backend, run:

```bash
bun run dev
```

This will start the frontend on `http://localhost:3000` (or another available port) and the Cloudflare Worker locally. The Vite development server is configured to proxy API requests to the worker, so you can interact with the full application seamlessly.

## 🏗️ Project Structure

-   `src/`: Contains the React frontend application code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utilities, API clients, and mock data.
-   `worker/`: Contains the Cloudflare Worker backend code (Hono API).
-   `shared/`: TypeScript types and data shared between the frontend and backend.
-   `public/`: Static assets.

## 🔧 Development

### Frontend

The frontend is a standard Vite + React application. You can create new components, pages, and hooks inside the `src` directory. Styling is done using Tailwind CSS and shadcn/ui components.

### Backend

The backend is a Hono application running on Cloudflare Workers. API routes are defined in `worker/user-routes.ts`. Data persistence is handled by a single global Durable Object, abstracted via Entity classes in `worker/entities.ts`.

## 部署 (Deployment)

This application is designed to be deployed to the Cloudflare global network.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Build and Deploy:**
    The `deploy` script in `package.json` handles building the frontend and deploying the worker.
    ```bash
    bun run deploy
    ```

This command will build the static assets, bundle the worker code, and deploy everything to your Cloudflare account.

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kerrfat/generated-app-20250924-232828)

## 🔮 Future Features

-   **Multiplayer:** Real-time, turn-based game modes.
-   **Paid Content:** Premium game packs and subscriptions.
-   **Progress Sync:** Save user progress across devices.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.