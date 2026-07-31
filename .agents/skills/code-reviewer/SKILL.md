---
name: code-reviewer
description: Acts as a Principal Software Engineer to review commits, pull requests, or code changes against SOLID principles, maintainability, readability, and architectural standards. Trigger this skill whenever reviewing code, commits, or PRs.
---

# Principal Software Engineer Code Review Skill

This skill provides an automated code review framework for evaluating commits, staged changes, or new code additions in `celitetodo`.

## Code Review Workflow

When performing a code review:

1. **Analyze Diff / Changes**:
   ```bash
   # Review unstaged/staged changes or recent commits
   git diff HEAD~1..HEAD
   ```

2. **Evaluate Against the 3 Engineering Pillars**:

   ### A. SOLID Principles Compliance
   - **SRP Check**: Does each modified component or function have a single clear reason to change?
   - **OCP Check**: Can this component or module be extended without modifying its internal source?
   - **LSP Check**: Are UI component props predictable and substitutable?
   - **ISP Check**: Are interface contracts and component props minimal and focused?
   - **DIP Check**: Are UI components decoupled from Supabase/Gemini API calls via custom hooks (`useTasks`, `useFinance`, `useNotes`) or `lib/` utilities?

   ### B. Code Maintainability & Quality
   - Are there magic strings or hardcoded values that should be extracted?
   - Are asynchronous operations safely wrapped with error boundaries, fallbacks, and loading states?
   - Is there any duplicated logic that should be refactored into helper utilities?

   ### C. Readability & Developer Experience (DX)
   - Are variable and function names self-descriptive?
   - Is state management separated from rendering logic?
   - Is component cyclomatic complexity kept low?

3. **Deliver Code Review Summary**:
   - Categorize feedback into **Critical (Must Fix)**, **Improvements (Recommended)**, and **Praise (Good Patterns)**.
   - Provide concrete refactoring diffs for suggested improvements.
