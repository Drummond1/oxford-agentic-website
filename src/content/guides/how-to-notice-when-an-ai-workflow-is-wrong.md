---
title: "Agentic workflows fail quietly. Here is how you would notice"
slug: how-to-notice-when-an-ai-workflow-is-wrong
category: in-practice
seoTitle: "How to notice when an AI workflow is wrong"
description: Software fails loudly. An agentic workflow fails by handing you a confident answer that is wrong. Four checks that catch it before anyone else does.
capsule: >-
  An agentic workflow rarely breaks in a way you can see. It returns something
  plausible, in the right format, at the right time, and quietly stops being correct.
  Noticing takes deliberate checks rather than attention: a written standard, a known
  answer you re-run, a spot-check habit, and knowing which step failed.
author: drummond-gilbert
publishDate: "2026-08-16T09:00:00+01:00"
updatedDate: "2026-08-16T09:00:00+01:00"
relatedProgrammes:
  - oxford-agentic-bootcamp
---

Ordinary software has the decency to fail loudly. It throws an error, the page breaks, something turns red, and you know. An agentic workflow does not do that. It hands you a document in the right format, at the right time, of the right length, that is confidently and quietly wrong.

That difference is the whole problem. Nothing alerts you, because from the machine's point of view nothing went wrong: every step ran and produced an output. The failure is in the content, and content has no exit code.

## Why the odds get worse as you add steps

A workflow of narrow steps is more reliable than one clever prompt, which is the reason the pattern is worth learning. But it comes with arithmetic worth understanding: the steps multiply rather than average. Each stage is mostly right, and "mostly" compounds down the chain, so a longer pipeline is less trustworthy end to end than any single step in it looks.

This is not an argument for fewer steps. It is an argument for a check at the end, and for keeping the chain no longer than the job needs.

## Four things that actually catch it

**Write the standard down before you build.** The most useful artefact in the whole workflow is a paragraph describing what a good output looks like: what it must contain, what it must never do, what would make you send it back. Without that written down, the reviewer step has nothing to check against, and "does this look right" quietly becomes "does this look like the last one".

**Keep one input whose answer you already know.** Run it through occasionally. If the output drifts, something upstream has changed - a model update, a source that reorganised itself, a document that is no longer where it was. This is the cheapest early warning available, and almost nobody sets one up.

**Spot-check on a schedule, not on a feeling.** Confidence in a workflow grows faster than its reliability does. After a fortnight of good output the temptation is to stop looking, which is exactly when a silent change starts costing you. One in ten, every week, opened properly.

**Know which step failed, not just that it did.** When something is wrong, the useful question is which stage produced it: did the scout gather the wrong material, did the drafter ignore good material, or did the reviewer wave through something it should have caught. A workflow you cannot decompose is one you can only throw away and rebuild.

## What good failure looks like

A workflow that fails well is one that stops rather than guesses. If the source document is missing, the honest output is "I could not find the input", not a confident summary of nothing. Most of the design work in a reliable pipeline is deciding, in advance, what each step should do when its input is not what it expected.

That is unglamorous and it is most of the difference between something you use on Monday and something you abandon by Thursday.

## Where this gets practical

None of this needs code, and none of it is hypothetical - it is the part of a build that people skip when they are excited, and the part they wish they had not skipped a month later. At the [Oxford Agentic Bootcamp](/bootcamps/oxford-agentic-bootcamp/) the review step is built alongside the workflow rather than after it, because a pipeline without one is a draft generator that nobody is checking. No coding required, and nothing hand-waved.
