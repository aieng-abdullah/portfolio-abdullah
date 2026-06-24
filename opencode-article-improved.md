# My Experience With OpenCode: Powerful AI Coding Tool… Until It Broke in Large Repos

> **TL;DR:** OpenCode is excellent for small-to-medium repositories, but large monorepos expose its limits. The main problems come from unbounded context processing, repeated filesystem searches, heavy ripgrep/glob operations, and long-running session memory growth. The practical fix is simple: control the scope before you open the session.

*How scope kills performance — and what that reveals about the real limits of AI coding agents*

I have been using AI coding tools long enough to stop being impressed by demos.

What I care about now is production behavior. What happens when the project is messy, the repo is large, and the session runs for three hours?

That is the test I put OpenCode through. And the results taught me something important — not just about this tool, but about the architectural constraints every AI coding agent is quietly hiding.

## First Impressions: This Thing Actually Feels Different

Before the problems, there was a genuinely good experience.

OpenCode is a terminal-native AI coding agent. No IDE plugin, no browser tab. You stay in the CLI, and the agent works alongside you — reading files, running shell commands, navigating your project structure, reasoning across multiple files.

For small to medium projects, it works remarkably well.

A few things stood out immediately:

**Terminal-first workflow.** There is something cognitively clean about not switching contexts. OpenCode lives where the work happens.

**Model flexibility.** It is not locked to one provider. You can route between models depending on what the task requires — cost, latency, or capability. That kind of control matters in production engineering.

**Agent-like behavior, not just autocomplete.** It does not just suggest completions. It reads, modifies, executes, and reasons. That is a meaningfully different category of tool.

On a focused single-service repository, it felt fast, responsive, and genuinely useful. I was impressed.

Then I moved to a larger project.

## The Problem: What Happens at Scale

The repository in question was a monorepo-style system — multiple services, a shared codebase, layered dependencies. The kind of project that is completely normal in production engineering.

I hit this most concretely while contributing to [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent), an open source project I was working on at the time. The codebase is not small — tens of thousands of lines across dozens of modules — and using OpenCode to navigate it — tracking context across files, running git operations, maintaining awareness of the broader structure — is exactly the kind of workload that exposes these limits. What should have been a focused contribution session turned into a debugging exercise against the tool itself.

OpenCode's behavior changed completely.

## 1. CPU Usage Climbed and Stayed There

During active sessions, CPU consumption crept up and did not come back down. The system stayed technically responsive at first, but over time the degradation became noticeable. Repository-wide operations made it significantly worse.

This aligns with known issues: [#28102](https://github.com/anomalyco/opencode/issues/28102) documents a `uv_cancel` write loop that pins the renderer at 100% CPU, and [#30086](https://github.com/anomalyco/opencode/issues/30086) reports CPU spikes tied to glob/grep tool calls in large directories.

## 2. Git Operations Became Expensive

Git-related activity — status checks, diff tracking, history traversal — scaled badly with repository size. When combined with ongoing agent activity, this created a compounding load problem that was difficult to isolate.

## 3. Context Processing Did Not Scale

AI coding agents need to maintain contextual awareness of the codebase to be useful. In small repos, this is cheap. In large ones, it is not.

The continuous processing required to track a large context window across many files introduced gradual, persistent performance degradation throughout a session. The longer the session ran, the worse it got.

## 4. The Filesystem Amplified Everything

This was the detail that tied it all together.

Running OpenCode inside WSL on Windows-mounted directories — the classic `/mnt/c` setup — made every one of these problems significantly worse. File system latency, combined with continuous scanning and indexing, created a kind of performance spiral.

Projects with heavy build outputs, nested `node_modules`, or large dependency trees hit this particularly hard.

## System-Level Impact

The issues stopped being about the tool and started being about the entire environment.

CPU spikes during agent execution. System-wide slowdown across the WSL session. Delayed terminal responsiveness. Increased latency even for simple file operations.

At certain points, it became genuinely difficult to tell whether what I was experiencing was application behavior or system instability.

That is a meaningful line to cross. When a development tool starts affecting the host environment, you have moved from a performance problem into a reliability problem.

## What I Tried to Fix It

I ran through the standard mitigation playbook:

### 1. Reduce workspace scope

Instead of opening the full monorepo, scope to a specific module:

```bash
# Instead of:
opencode .

# Do this:
opencode ./packages/api-service/
```

This is the single most effective fix. Smaller scope means less filesystem scanning, less context to maintain, and fewer expensive tool calls.

### 2. Move off Windows-mounted paths

```bash
# Bad — WSL filesystem crossing:
cd /mnt/c/Users/me/projects/my-repo

# Good — native WSL filesystem:
cp -r /mnt/c/Users/me/projects/my-repo ~/projects/my-repo
cd ~/projects/my-repo
```

### 3. Exclude heavy directories manually

OpenCode does not have a built-in ignore file yet. You can work around this by launching from a subdirectory or by ensuring your `.gitignore` covers build artifacts, `node_modules`, and output directories.

### 4. Restart sessions regularly

Long-running sessions accumulate memory. Treat sessions as disposable — restart every 30–60 minutes on large repos.

Each of these helped reduce severity. None of them eliminated the underlying problem. They were workarounds, not fixes.

## The Real Insight: This Is a Scope Problem, Not a Bug

Here is the framing that changed how I thought about all of this.

OpenCode is not broken. It is **scope-sensitive by design**.

It performs well when:

- Operating on a single module or bounded subdirectory
- Working within a well-defined context
- Avoiding full-repository indexing

It degrades when:

- Given full monorepo visibility
- Forced to maintain large contextual state across long sessions
- Run continuously without scope constraints

This is not a failure of implementation. It is a fundamental architectural tension in every AI coding agent: **global awareness versus runtime efficiency**. You can have one cheaply, or both expensively.

Most tools quietly make this tradeoff and hope you do not notice. OpenCode makes it visible — loudly, in large repos, after about an hour.

## What This Reveals About AI Coding Agents More Broadly

This is the thing I keep coming back to.

Every AI coding agent — OpenCode, Cursor, Claude Code, Copilot Workspace — faces the same core constraint. Context is not free. Indexing is not free. Maintaining awareness across a large, evolving codebase has a cost, and that cost scales with scope.

The tools that perform well in production are not the ones that ignore this constraint. They are the ones that manage it deliberately — through smart chunking, lazy loading, hierarchical indexing, or explicit scope controls given to the user.

The worst failure mode is not poor performance. It is when the tool creates the illusion of global awareness without actually providing it reliably.

OpenCode, at least, makes the tradeoff legible. And the community is actively working on it — the [Memory Megathread (#20695)](https://github.com/anomalyco/opencode/issues/20695) is collecting heap snapshots and diagnosing the root causes. If you hit these issues, contribute your data there.

## How I Use It Now

After this experience, I restructured how I deploy OpenCode entirely.

The rule is simple: **control the scope before you open the session**.

- Always scope to a specific module, not the full repo
- Move work into native filesystem paths, not Windows-mounted drives
- Exclude all build artifacts and dependency directories upfront
- Treat long-running sessions as a risk, not a feature

Within those constraints, OpenCode is genuinely effective. Outside of them, it is not.

That is the honest assessment.

## Final Thought

There is a version of this article that ends with a recommendation. Use this tool, or do not use this tool.

I do not think that is the right framing.

The more useful takeaway is this: **AI coding agents are not general-purpose reasoning machines**. They are powerful within scope boundaries and fragile outside of them. The engineering judgment required is not "which tool is best" — it is "what scope does this tool need to perform reliably, and can I operate within that scope for my actual workload?"

OpenCode taught me to ask that question before I open any agent session, not after the CPU fan has been running for forty minutes.

That alone was worth the experience.
