## ShadowKeep: App Summary
ShadowKeep is a high-performance, offline-first Cognitive Operating System designed for deep work and intentionality. Unlike standard to-do lists that just track what you need to do, ShadowKeep tracks how you think, ensuring you learn from your actions.
It features a "Tactical/Cyber-Noir" aesthetic designed to reduce eye strain and induce a state of flow.
Distinct & Important Features:
The Matrix (Objectives & Tasks):
A command-line inspired task manager with sub-objectives, project stacks, and "Strategic Intent" fields (defining why a task matters).
Includes Protocol Timers for focused work sessions attached directly to tasks.
The Vault (Notes):
A rich-text knowledge base.
Synthesis Engine ("The Loop"): A unique feature that forces you to review completed tasks and decisions, extracting "Lessons" that are automatically saved to your Vault.
Decision Journal:
Prevents hindsight bias by forcing you to log the context, expected outcome, and confidence level (1-100%) before making a decision.
Includes an automated Review Protocol to audit decisions after the fact.
Triage Protocol:
A dedicated mode to rapidly process a backlog. It presents tasks one by one, forcing you to Pin, Defer, Delegate, or Purge them immediately.
Focus Protocol (Acoustic Shield):
A built-in Pomodoro-style timer that generates Brown Noise or White Noise directly in the browser to block distractions.
Flow Audit (Analytics):
Visualizes your "Biological Prime Time" (when you are most clear-headed) and tracks "Inertia" (tasks that have been stale for >72 hours).
System Utilities:
Global Search (Ctrl + K): Instant access to any note, task, or setting.
Recycle Bin: Safety net that holds deleted items for 15 days before permanent deletion.
Floating Widget: A mini-window that stays on screen to keep your active task visible while you work in other apps.


## How to Run Locally (For GitHub Users)
Since this project is built with React, TypeScript, and Vite, it is very easy to run on any laptop.
Prerequisites:
You need Node.js installed on your computer. If you don't have it, download the "LTS" version from nodejs.org.
## Steps:
1. Clone the Repository
2. Open your terminal (Command Prompt, PowerShell, or Terminal) and run:
3. 
code
Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
Install Dependencies

This downloads the necessary libraries (React, Lucide Icons, etc.) to your machine:

npm install

Run the App

Start the local development server:
npm run dev

Open in Browser
The terminal will show a local link, usually:
http://localhost:5173
Click that link or paste it into your browser to launch ShadowKeep.
Optional: Build for Production
If you want to create a static version to host on a server (like Netlify or Vercel):
npm run build
This creates a dist folder with the optimized files.
