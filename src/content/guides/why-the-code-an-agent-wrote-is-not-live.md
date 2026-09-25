---
title: "The agent wrote the code. Why is nothing live?"
slug: why-the-code-an-agent-wrote-is-not-live
category: in-practice
seoTitle: "Why your AI-built app is not live yet"
description: Coding agents write working code and stop. The distance between that and something other people can open is six specific things, none of them coding.
capsule: >-
  A coding agent gives you working code on your own machine. What it does not give you
  is a repository, a way to undo, somewhere the thing runs, a memory, a place to keep
  secrets, and a check that it does what you think. None of those six are coding, all
  six are learnable in a day, and they are the whole distance between a demo and
  something live.
author: drummond-gilbert
publishDate: "2026-09-25T19:00:00+01:00"
updatedDate: "2026-09-25T19:00:00+01:00"
relatedProgrammes:
  - agentic-coding-bootcamp
---

Something odd happens the first time you build with a coding agent. It works. You describe what you want, the agent writes it, the thing runs on your screen, and you feel about four steps from launching. Then you try to show it to someone and discover the four steps were the easy part.

This is the most common place people stop, and it is worth being precise about why, because the gap is not what it looks like. It is not that the code is bad or that you need to learn to program. It is that working code on your laptop and software other people can use are different objects, and nobody told you what sits between them.

## The six things between your laptop and the internet

Every one of these is a thing agents assume you already have. None of them requires you to write code.

- **Somewhere for the code to live.** A repository, usually on GitHub. Not a folder on your desktop, because a folder cannot be shared, restored, or deployed from.
- **A way to undo.** Version control is the reason you can let an agent change fifty files at once and still sleep. Without it, one confident wrong edit is unrecoverable, and you will start refusing the changes that make the tool worth using.
- **Somewhere it actually runs.** Your machine is not the internet. Deploying means putting the thing on a host that serves it to other people, with a URL that is not localhost.
- **A memory.** The moment your thing needs to remember anything between visits, you need a real database rather than a variable that resets.
- **Somewhere to keep secrets.** API keys, passwords, tokens. These must not sit in the code, and an agent will cheerfully put them there if nobody has said otherwise.
- **A way to know it works.** Not a feeling. A test that fails loudly, and a habit of reading what changed before it goes out.

Read that list again and notice what is missing: writing code. That is the part the agent already does.

## Why every comparison tells you to use a builder instead

Search for whether a non-developer can ship with a coding agent and you will mostly find pages selling app builders. They are not wrong about the gap. They are arguing that you should not have to cross it, because their platform owns the repository, the hosting, the database and the deploy on your behalf.

That is a real trade, and worth taking seriously. A builder gets you live faster. What you give up is ownership: the thing exists inside their account, on their terms, priced how they choose, and moving it later means rebuilding. The six items above are the price of owning what you made. Paid once, they apply to everything you build afterwards.

Which side of that trade suits you depends on what you are making. A one-off internal tool nobody else depends on is a fine thing to leave in a builder. Anything you intend to keep, sell, or hand to someone else is worth owning outright.

## The order that works

If you do decide to own it, the order matters more than the tools:

1. **Write the brief before the code.** The agent reads it first and builds against it. A vague brief produces a confident wrong answer, and that is your time, not its.
2. **Get the repository and the undo button working before anything else.** You want version control before you need it, not after.
3. **Deploy something almost empty, early.** A nearly blank page live on a real URL is worth more than a finished app on your laptop, because the hard part is the path, not the page. After that, every change is a small repeat of a path you have already walked.
4. **Add the memory and the secrets handling only when the thing needs them.**
5. **Put the check in before you invite anyone.**

Most people do this in exactly the opposite order, build something elaborate locally, and then meet all six problems at once on the day they wanted to launch.

## Where this gets practical

Reading the list is not the same as having done it, and the first time through, every step has a small trap in it that costs an evening. That day is what the [Oxford Agentic Coding Bootcamp](/bootcamps/agentic-coding-bootcamp/) is for: Claude Code and Codex do the typing, and the day is spent on everything around them, from the brief to the repository, the deploy, the database and the tests. You leave with a personal site live on the internet and a working prototype, both in your own repository. Cohort 1 runs on [26 November at Worcester College](/events/oxford-agentic-coding-bootcamp-cohort-1/).

If you are still deciding which agent to use, [the plain comparison of Claude, Cowork, Claude Code and Codex](/guides/claude-cowork-claude-code-or-codex/) is the place to start. If your problem is a recurring task rather than an idea you want running, the [Oxford Agentic Bootcamp](/bootcamps/oxford-agentic-bootcamp/) is the better day.
