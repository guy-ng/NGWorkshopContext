---
title: "How to Test an AI Agent That Never Does the Same Thing Twice"
urlSlug: testing-non-deterministic-ai-agents
excerpt: "Classic QA assumes the same input produces the same output. AI agents break that assumption. Here's how to build a testing strategy that still produces auditable evidence."
locale: en
translationKey: testing-non-deterministic-ai-agents
publishedAt: 2026-09-02
author: Guy Elisha
category: Guides
tags:
  - Testing
  - Agentic AI
  - AI Agents
  - Governance
  - Audit Trail
  - Compliance
coverImage: /images/blog-process.svg
coverAlt: "Testing an AI agent inside a documented business process"
featured: false
seoTitle: "Testing Non-Deterministic AI Agents | NG Workshop"
seoDescription: "Why classic QA breaks with AI agents, which evaluation methods work, and why testing inside an orchestrated process produces regulator-ready evidence."
---

Two runs of the same AI agent, on the same case, can take entirely different routes - and both can be right. That's not a bug. It's normal behavior for a language model. So how does a QA or compliance team actually test something like that?

The instinctive answer - "let's write more assertions" - breaks down fast. An assertion tight enough to be meaningful will fail exactly when the model makes a different, equally correct choice. Camunda recently published a framework that breaks this problem into layers - and it's exactly what QA and compliance teams at Israeli enterprises need to run AI agents under supervision without losing control.

## Why classic QA breaks

Classic QA assumes determinism: same input, same output, every time. An AI agent makes non-deterministic decisions about which tools to call and in what order. You can write a perfect test scenario and find that, on the second run, the agent solved the problem a completely different way - just as successfully.

This isn't something you can "fix" with more test code. It's a built-in property of how a language model works, and it requires a testing strategy that accepts that up front.

## Three layers of testing

Camunda proposes splitting testing into three layers with different cost and character:

1. **Process logic (deterministic, mocked):** test tool wiring, data mappings, guardrails, and routing - without calling a real model. Testing against a "mocked model" catches a renamed tool or a broken input mapping in seconds.
2. **Model behavior (non-deterministic, real model):** check whether the agent calls the required tools, follows instructions, and produces quality output - using evaluation methods, not exact string matching.
3. **Consistency and cost (empirical, multi-run):** track token consumption, tool-call patterns, and behavioral drift over many executions.

This is exactly the hierarchy that lets a QA team run fast in the cheap layer, and reserve expensive testing for where it's actually needed.

## Evaluation methods instead of assertions

Instead of exact string matching, two main approaches:

- **LLM-as-Judge:** an independent model scores the output against a plain-language expectation, with a configurable pass threshold (defaulting to 0.5).
- **Semantic similarity:** embed both the output and the expectation as vectors and compare them - faster, and deterministic once the embedding model is fixed.

Both approaches measure "is this the right business outcome," not "are the words identical" - exactly what's needed when the model is free to phrase a correct answer in more than one way.

## Why an orchestrated process produces auditable evidence

This is where the real gap between an experiment and production shows up. When an agent runs inside an orchestrated business process (BPMN), every execution generates an "agent instance" record: model calls, tool invocations, and input/output tokens against pre-configured limits.

That structured record lets you check two things at once: that the process routed correctly, and that the agent called every tool its task actually required - not just that the process reached an end event. That's a fundamentally different kind of evidence than a free-form conversation log: it's structured, auditable, and you can run automated assertions against it.

For a bank, insurer, or other regulated entity in Israel, that structured record is exactly what a regulator asks for - not "the agent looked good in a demo," but a record showing what happened, when, and against which approval threshold.

## What this means for your organization

A QA and compliance team that wants to run AI agents in production needs to let go of the expectation of "classic regression testing" and build three layers instead: cheap, fast checks for process logic; qualitative evaluation for model behavior; and empirical tracking for consistency over time. The most effective test doesn't try to "catch" the model in a mistake - it verifies that the process around it stops, logs, and hands off to a human exactly when it should. That's the approach we at NG Workshop apply when we build AI agents on Camunda for regulated organizations in Israel.

Further reading: [Human-in-the-Loop as a Governance Mechanism](/en/blog/human-in-the-loop-governance/) and [From Pilot to Production](/en/blog/from-pilot-to-production/).

## Sources

- [Camunda: How to Test an AI Agent That Never Does the Same Thing Twice](https://camunda.com/blog/2026/08/how-to-test-an-ai-agent-that-never-does-the-same-thing-twice/)

## Summary

- Classic QA fails with AI agents because there's no fixed input-output pair - two valid runs can look different.
- Effective testing separates deterministic process logic, model-behavior evaluation, and consistency tracking.
- An orchestrated process with logged checkpoints is what turns guesswork testing into evidence you can hand a regulator.

[Want to build a testing strategy for AI agents in your organization? Let's talk](/en/about/)
