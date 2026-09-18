# Setup — two things to do, about 6 minutes

You run **one command**. Then you click through **one web page**. That's the whole setup.

Everything else — installing tools, checking your GitHub login, creating the folder, writing all the
project files, testing the Pokémon sprite CDN, creating the GitHub repo, making the first commit and
pushing it — is handled by the script.

---

## Thing 1 — Run the setup script

**Step A.** Save `setup.sh` from this chat to your **Downloads** folder.

**Step B.** Open the Terminal app (press `Cmd + Space`, type `Terminal`, hit Enter) and paste this
exact line, then press Enter:

```bash
bash ~/Downloads/setup.sh
```

That's it. Watch it work. It prints a ✓ for every step it finishes.

### What it will ask you for

Only two things, and possibly neither:

- **Your Mac password** — only if it has to install Node or the GitHub CLI. Homebrew asks, not me.
  Nothing appears on screen as you type; that's normal. Type it and press Enter.
- **Nothing else.** The script never asks you to make a decision.

### If it stops with a red ✗

It will tell you exactly what to do in plain language, and it's safe to run the same command again
as many times as you like — it skips anything already done. The two most likely messages:

| Message | What to do |
|---|---|
| `Homebrew is not installed` | Paste the install command it gives you, let it finish, then run `bash ~/Downloads/setup.sh` again |
| `GitHub CLI is not logged in` | Run `gh auth login` (choose **GitHub.com** → **HTTPS** → **Yes** → **Login with a web browser**), then run the setup script again |

### What "done" looks like

A green block at the bottom with your new GitHub repo URL, and the two commands to start working.
Your project will be at `~/Projects/pelipper-post`.

---

## Thing 2 — Connect Vercel (one time, in your browser)

This is the only part that can't be automated — Vercel's GitHub connection has to be authorized by
you, by hand, once. After this, **every push deploys automatically forever.**

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Find **pelipper-post** in the repository list and click **Import**
   - Don't see it? Click **Adjust GitHub App Permissions** and grant Vercel access to the repo.
3. Change nothing. Click **Deploy**.
4. Wait about 30 seconds. When it finishes, click **Continue to Dashboard**, then **Visit** to get
   your live URL.
5. Copy that URL into `PELIPPER-POST-STATUS.md`, in the Live links table. Or just paste it into
   Claude Code and say *"put this in the status doc as the live Vercel URL"* — easier.

**You don't need to touch Vercel again.** From here on, every time Claude Code pushes at the end of
a phase, Vercel rebuilds your live site by itself.

### ⚠️ A note on what Vercel builds — read this before Phase 2

You'll import the repo while Phase 1 is still plain HTML, so Vercel deploys it as a static site.
That part is fine.

**What is not fine:** Vercel decides the Framework Preset **once, when you import the repo**, and
never revisits it. It does **not** notice later that the project became a Vue app. Because this repo
was imported as plain HTML, it is pinned to **"Other"** — so when Phase 2 adds a build step, Vercel
will go on serving raw files and **your live site will go blank or 404.** Nothing warns you about
this. The deploy reports success.

*(An earlier version of this file said Vercel switches over on its own. It doesn't. Ignore that.)*

**The fix — Phase 2 creates a `vercel.json` at the repo root:**

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

A `vercel.json` in the repo **overrides whatever the dashboard thinks**, which is why this is the
better fix: it's version controlled, it explains itself, and it survives anyone re-importing the
project later. The `rewrites` line is the single-page-app fallback so the one route still resolves.

**Timing matters.** A `vercel.json` already exists at the repo root, but it holds only
`{ "outputDirectory": "." }` — that's an unrelated fix for the static deploy 404 (see §8 of
`PELIPPER-POST-STATUS.md`). Phase 2 **overwrites** it with the config above. The `framework` and
`buildCommand` keys must not be added before then: there's no `package.json` yet, so telling Vercel
to run a Vite build today would break the static deploy. The Phase 2 prompt handles the swap — you
don't need to edit it yourself.

**If you'd rather click it:** Project → Settings → Build & Deployment → Framework Preset → **Vite**,
then redeploy. Same result, but nothing in the repo records that you did it.

**How you'll know it broke:** the live URL goes blank, 404s, or shows raw text after a Phase 2 push.
Tell Claude Code: *"the live site is blank after the Vue scaffold — check `vercel.json`."*

### Optional — password protection

The capstone lists this as optional. It's in **Project → Settings → Deployment Protection**. I'd
**leave it off**: it requires anyone viewing the site to have a Vercel account, which would block
the Protogen facilitator reviewing your submission. There's nothing sensitive in the project — every
number is fabricated Pokémon data.

---

## Then start building

```bash
cd ~/Projects/pelipper-post && claude
```

The first time you run `claude` it opens a browser to log you in. After that, open
`CLAUDE-CODE-PROMPTS.md` and paste the **Phase 1** prompt.

Work one phase at a time. Look at the result in your browser after each one. Redirect in plain
language when something's off — the redirect prompts at the bottom of `CLAUDE-CODE-PROMPTS.md` are
written for exactly that.

---

## Reference — what the script actually did

You don't need to read this. It's here so you know nothing surprising happened.

| Step | What it did |
|---|---|
| 1 | Confirmed you're on macOS and Homebrew exists |
| 2 | Installed or verified **Node.js 20+** and npm |
| 3 | Installed or verified the **GitHub CLI** (`gh`) |
| 4 | Installed or verified **Claude Code** |
| 5 | Confirmed your GitHub login and wired up Git credentials (`gh auth setup-git`) |
| 6 | Set your Git name and email, if they weren't already set |
| 7 | Created `~/Projects/pelipper-post` |
| 8 | Wrote `BRIEF.md`, `CLAUDE.md`, `PELIPPER-POST-STATUS.md`, `CLAUDE-CODE-PROMPTS.md`, `SETUP.md`, `.gitignore`, `scripts/validate-data.mjs`, and `.claude/settings.local.json` |
| 9 | Tested the Pokémon sprite CDN from your machine and recorded the working URL in `PELIPPER-POST-STATUS.md` |
| 10 | Ran `git init`, made the first commit, created the **public** GitHub repo `pelipper-post`, and pushed |

### Why `.claude/settings.local.json` matters

It pre-approves the `git`, `gh`, and `npm` commands Claude Code needs, so it commits and pushes at
the end of each phase without stopping to ask you every single time. `CLAUDE.md` is what tells it to
actually do so. Force-push and hard-reset are explicitly denied, so it can't rewrite your history.

---

## Troubleshooting

**`bash: /Users/you/Downloads/setup.sh: No such file or directory`**
The file saved somewhere else. Find it in Finder, then type `bash ` (with a space) in Terminal and
drag the file into the Terminal window — it fills in the path for you. Press Enter.

**The script says the project folder already exists**
You've run it before successfully. Just `cd ~/Projects/pelipper-post && claude` and carry on. If you
genuinely want to start over: `mv ~/Projects/pelipper-post ~/Projects/pelipper-post-old` then re-run.

**Claude Code asks permission for git commands anyway**
Confirm the file exists: `ls ~/Projects/pelipper-post/.claude/settings.local.json`. If it's there,
quit Claude Code and restart it. As a fallback, launch with
`claude --permission-mode acceptEdits`.

**Port 5173 already in use** (after Phase 2)
Tell Claude Code: *"kill the process on port 5173 and restart the dev server."*

**A Vercel build fails**
Tell Claude Code: *"the Vercel build failed — run `npm run build` locally, fix every TypeScript
error, then commit and push."* This is almost always `vue-tsc` catching something the dev server
was willing to ignore.

**Sprites don't show up**
The script already tested the CDN and wrote the result into section 8 of
`PELIPPER-POST-STATUS.md`. Tell Claude Code: *"sprites aren't loading — check the working URL
pattern in the status doc and fix `src/utils/sprites.ts`."*
