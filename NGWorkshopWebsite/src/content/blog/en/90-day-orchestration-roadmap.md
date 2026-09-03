---
title: "A 90-Day Roadmap: From a Manual Process to an Orchestrated One"
urlSlug: 90-day-orchestration-roadmap
excerpt: "A focused plan for picking the right process, building an MVP, running a controlled pilot, and scaling process orchestration on evidence."
locale: en
translationKey: 90-day-orchestration-roadmap
publishedAt: 2026-07-05
author: Guy Elisha
category: Guides
tags:
  - BPMN
  - Orchestration
  - Camunda
  - Process Automation
  - ROI
coverImage: /images/blog-process.svg
coverAlt: "A roadmap for orchestrating a business process"
featured: false
draft: false
seoTitle: "A 90-Day Roadmap for Process Orchestration"
seoDescription: "A practical plan to select a process, build an MVP, pilot it, and scale process orchestration across the organization in 90 days."
---

Don't start with a platform, and don't start with a sweeping transformation programme. Start with one process, one outcome, and a baseline you can actually measure. That is how a manual process becomes genuinely orchestrated within 90 days — and how you learn before you scale.

## Days 1–15: Pick the right battle

Look for a process that runs frequently, crosses at least two systems, contains waiting time or exceptions, and has a business owner. A good pilot process hurts enough to be worth fixing, yet is contained enough to ship in weeks.

Record a baseline: cycle time, human handling time, completion rate, exceptions, and estimated cost per case. Without a baseline, even success remains a gut feeling rather than a number.

## Days 16–30: Map what really happens

In a joint workshop with the business and technology sides, map the process as it truly runs today — including the spreadsheet workarounds, the approvals handled over chat, and the cases that loop back. Define the start event, the desired outcome, the decisions, the data, the systems, and the owners.

This is also where you mark what is deterministic, where AI can help, and where a human decision is required. The goal is not a pretty diagram; it is a shared operational contract.

## Days 31–60: Build an end-to-end MVP

- A BPMN model covering the happy path plus two or three common exceptions.
- Integration with systems through APIs or isolated workers.
- Human task screens carrying the context needed to decide.
- Metrics, logs, and a correlation ID for every instance.
- Timeout, retry, and compensation policies.

A complete process at small scale beats deep automation of a single step. That is how you test the central assumption: does orchestration improve the end-to-end outcome?

## Days 61–75: Shadow mode and pilot

Run the new flow alongside the existing process first and compare results. Then move a limited group across, with a daily dashboard and a way back. Look not only at successes, but at where intervention was needed and what users failed to understand.

## Days 76–90: Improve and decide on scale

Compare against the baseline, fix the highest-volume exceptions, and decide whether to increase volume, add an AI capability, or move on to the next process. In parallel, build a repeatable playbook: templates, security, metric naming, and ways of working.

> **A good 90-day outcome:** one process running in production, five live metrics, an engaged business owner, and an improvement backlog grounded in real data.

## Further reading (Hebrew sources)

- [SmartFlows: Practical steps for building automations](https://smartflows.co.il/guide-0-3/)
- [Calcalist: From an organization that uses AI to an AI-driven organization](https://www.calcalist.co.il/calcalistech/article/rycyel00tjl)

## Summary

- Choose a process based on value, scope, and business ownership.
- Build the full flow before going deep on a single automation.
- Scale only after comparing to the baseline and learning from exceptions.

[Want help choosing the right pilot process? Book a discovery workshop with us](/en/about/)
