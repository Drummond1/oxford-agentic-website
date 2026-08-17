---
title: "Scout, drafter, reviewer: the workflow pattern that does real work"
slug: scout-drafter-reviewer-pattern
category: start-here
seoTitle: "The scout-drafter-reviewer pattern"
description: The three-step agentic workflow pattern behind most useful business automation - what each step does, why the split matters, and where the human sits.
capsule: >-
  Scout, drafter, reviewer is the workflow shape behind most useful agentic AI: one
  step gathers the raw material, one produces a first version, and one checks it
  against a stated standard. Three narrow steps beat one clever prompt because each
  can be tested, improved and trusted separately, and the pattern transfers to almost
  any repeated knowledge task.
author: drummond-gilbert
publishDate: "2026-08-05T09:00:00+01:00"
updatedDate: "2026-08-05T09:00:00+01:00"
relatedProgrammes:
  - oxford-agentic-bootcamp
---

Ask one AI prompt to research, write and polish a report and you get something plausible, mediocre and unaccountable. Ask three narrow steps to do it - one gathering, one drafting, one checking - and you get something you can actually use, improve and trust. That three-step shape is the pattern we teach first, because it fits an enormous amount of knowledge work. It is worth understanding properly.

## The scout: gather before you generate

The scout's only job is to collect the raw material: pull the figures, find the documents, extract the relevant passages, list what changed since last time. It produces no prose and makes no judgements - it assembles the evidence the next step will work from.

Separating this out matters because most bad AI output fails at the input, not the writing. A model asked to draft from nothing invents; a model asked to draft from a scout's evidence pack has something true to say. When a workflow goes wrong, the scout's output is the first place to look - and because it is a separate step, you can look.

## The drafter: one version, from the evidence

The drafter turns the scout's material into a first version of the thing you actually need: the summary, the report section, the reply, the comparison. It works only from what the scout gathered, in the shape and voice you have specified.

Keeping the drafter narrow is what makes it good. It is not deciding what matters or checking itself - it is doing the one thing models do best, turning structured material into clear prose, with the ingredients already on the bench.

## The reviewer: check against a standard, in writing

The reviewer reads the draft against a stated standard before any human sees it: is every claim supported by the scout's material, does it follow the format, did it answer what was asked, does it break any of your rules. It flags or fixes what fails.

This is the step people skip, and it is the step that makes the whole thing trustworthy. A pipeline that drafts and stops produces work you must check line by line, which quietly costs the time you saved. A pipeline that checks its own draft - and shows you what it checked - produces work you can review at a glance. Writing the standard down is also clarifying in itself: it forces you to say what good actually looks like, which most of us have never put into words.

## Why three narrow steps beat one clever prompt

Three reasons, all practical:

- **You can see where it went wrong.** One giant prompt fails as a blob; a pipeline fails at a step, and you fix that step.
- **Each step can be improved alone.** A better scout raises the quality of everything downstream without touching the drafter. Improvements compound.
- **Trust is earned per step.** You will trust the scout's gathering long before you trust anything's judgement. The pattern lets you hand over the parts you are ready to hand over and keep the rest.

The pattern also places the human deliberately: after the reviewer, at the point of judgement - approving, correcting, deciding - rather than in the middle, retyping context between tools.

## Where it fits, and where it does not

Anything with the shape *gather, produce, check* is a candidate: the weekly report, the meeting minutes, inbound triage, first-draft anything, the comparison you rebuild every month. That is most repeated knowledge work.

It is the wrong shape where the output is a judgement about a person, where being subtly wrong is expensive and hard to spot, or where the task runs on information you cannot give the scout. Those are the tasks to keep, not to force into the pattern.

## Where this gets practical

Reading about the pattern and having one running against your own work are different things, and the second one is a day's work with someone on hand. That is what the [Oxford Agentic Bootcamp](/bootcamps/oxford-agentic-bootcamp/) is for: you bring one real task, build the scout, the drafter and the reviewer against it, and leave with the pipeline running and a written recipe to rebuild it. No coding required.
