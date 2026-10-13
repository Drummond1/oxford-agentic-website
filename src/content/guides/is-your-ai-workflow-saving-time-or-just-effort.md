---
title: "Is your AI workflow saving time, or just feeling faster?"
slug: is-your-ai-workflow-saving-time-or-just-effort
category: in-practice
seoTitle: "Is AI saving you time, or just effort?"
description: On simple tasks, AI has been measured to save effort rather than time, not both. What that means for a multi-step workflow, and what to measure instead.
capsule: >-
  On simple tasks, AI assistance saves effort rather than time. In a preregistered study
  of 1,237 people, assisted and unassisted completion took the same time, yet people
  predicted AI would be much faster and reported it felt easier. A multi-step workflow is
  a different proposition, which is why you measure the whole job rather than the step
  that impressed you.
author: drummond-gilbert
publishDate: "2026-10-13T07:30:00+01:00"
updatedDate: "2026-10-13T07:30:00+01:00"
relatedProgrammes:
  - oxford-agentic-bootcamp
---

Everyone who has built something with AI has had the same moment: the thing runs, the output appears, and it feels like you have got an hour back. The uncomfortable question is whether you have.

## The illusion has been measured

In May 2026, Sunny Yu, Myra Cheng and five co-authors published two preregistered studies on exactly this. The first, [Cognitive offloading and the speedup illusion in human-AI interaction](https://arxiv.org/abs/2605.23177), ran with 1,237 participants on simple cognitive tasks and appears in the proceedings of the Cognitive Science Society's 2026 meeting. Its central result is blunt: actual completion times with and without AI assistance did not differ, while participants predicted that AI would be significantly faster.

The interesting part is where the error sits. People estimated their own unassisted times accurately. What they got wrong was the assisted time, which they consistently underestimated. The authors call this a speedup illusion, and note that the same bias did not appear when participants imagined being helped by another person. Something about handing work to a machine, specifically, makes us expect the clock to move.

The companion paper, [The efficiency-gain illusion](https://arxiv.org/abs/2605.22687), ran three preregistered studies across 2,691 people and found that we reach for AI on small tasks even when it saves neither time nor effort - and that using it once makes us more likely to use it again, entrenching the miscalibration rather than correcting it.

## Effort and time are not the same saving

The finding that should change how you talk about this is the second one in that first paper: people reported lower subjective effort with AI despite equivalent completion times. The authors' conclusion is that completion time alone "is not sufficient to characterize efficiency gains".

That is not a debunking. Effort is a real cost. A job that used to take forty minutes of concentration and now takes forty minutes of supervision is genuinely easier, and at the end of a long week that matters. But it is a different claim from "it saves me half a day", and only one of the two will survive a conversation with your finance director.

So say which one you got. Time, effort and quality are all legitimate returns. They are not interchangeable, and conflating them is how an AI project ends up with a number nobody can defend.

## What the research does not say

Both papers are explicitly about simple tasks - arithmetic, spell-check, short questions, the things you finish in a couple of minutes. Neither tests a multi-step workflow running against a real job over weeks. So this is not evidence that AI does not save time. It is something narrower and more useful: the smaller the task, the more likely the saving you feel is effort rather than clock time, and the less you should trust your own estimate.

That bound matters, because the shape of the work changes the answer. A single prompt replacing a two-minute task has very little room to win once you count reading the output. A workflow that gathers, drafts and checks, running on something you do every week, is a different proposition entirely - and the honest way to find out is to measure it rather than to assume either way.

## What to measure instead

Four things, none of which take long.

- **Time the whole job by hand, once, before you build.** Not the step you intend to automate. The job, from the thing existing to the thing being finished properly. You need this number and you will not be able to reconstruct it afterwards.
- **Measure the third run, not the first.** The first includes your learning. The third is the one you will actually live with.
- **Count the checking.** Reviewing, correcting and the occasional run you throw away are part of the cost. If verifying the output needs the same expertise as producing it, be honest that the saving may be small.
- **Measure early, before it becomes habit.** This is the practical consequence of the carryover finding: confidence in a saving grows with use whether or not the saving is real.

A workflow with a review step in it will usually look slower than a single clever prompt, and be worth considerably more. That is the point of [the scout, drafter, reviewer shape](/guides/scout-drafter-reviewer-pattern/) - and it is also why measuring only the drafting step flatters almost any build.

## Where this gets practical

If you are choosing something to build against, the tests in [how to choose your first agentic task](/guides/how-to-choose-your-first-agentic-task/) point at the work where a real saving is most likely: frequent, text-based, and checkable at a glance. Frequency is what turns a modest per-run saving into a number worth having.

The [Oxford Agentic Bootcamp](/bootcamps/oxford-agentic-bootcamp/) is a day spent building one of these against a task you brought, which means you leave with the thing running and the before-and-after still fresh enough to measure. Take the baseline before you come.
