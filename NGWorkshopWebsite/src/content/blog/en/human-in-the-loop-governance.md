---
title: "Human-in-the-Loop Without the Bottleneck: Designing Human Oversight"
urlSlug: human-in-the-loop-governance
excerpt: "How to place people at the right decision points, define risk thresholds, and keep a complete audit trail without giving up the benefit of automation."
locale: en
translationKey: human-in-the-loop-governance
publishedAt: 2026-06-29
author: Guy Elisha
category: Compliance
tags:
  - Human-in-the-Loop
  - Compliance
  - Regulation
  - Audit Trail
  - AI Agents
featured: false
draft: false
seoTitle: "Human-in-the-Loop and AI Oversight | NG Workshop"
seoDescription: "A guide to designing human oversight in AI processes by risk level, with SLAs, logging, and escalation."
---

Requiring human approval for every action cancels out the benefit of automation. Zero oversight turns a small error into an incident. Done properly, **human-in-the-loop** is not a compromise in the middle — it is a mechanism designed around risk.

## Oversight driven by risk, not by fear

Israel's emerging approach to responsible AI emphasizes risk management across the full system lifecycle. The report on the financial sector also stresses the accountability of the operating institution, disclosure obligations, and control. Process orchestration translates those principles into working mechanisms.

Instead of asking "does a human need to approve this?", ask how severe the potential harm is, how reversible the action is, and how confident the system is.

| Risk level | Example | Oversight mechanism |
|---|---|---|
| Low | Classifying an internal document | Automatic execution with sample review |
| Medium | Drafting a customer reply | Confidence threshold, approval on exceptions |
| High | Rejecting a claim or issuing a payment | Mandatory human approval |

## A human task is part of the process

A good approval task carries context, the agent's recommendation, supporting evidence, a short explanation, and clear actions. It also carries an SLA, a delegate, and an escalation path.

If the approval request goes out by email with no tracking, it is not human-in-the-loop — it is a gap in the process. The process engine needs to know that a case is waiting, who owns it, and what to do when the allotted time runs out.

## What the audit trail must capture

- The input and the data used for the decision, subject to privacy policy.
- The model version, the prompts, and the tools invoked.
- The system's recommendation and its confidence level.
- The approver's identity, the response time, and the reason for any change.
- The final outcome and its business impact.

This record is not only for the regulator. It shows where people correct the model, helps refine rules, and lets you expand automation on the basis of evidence.

## Implementing it in Camunda

Decision gateways, user tasks, timers, and escalation paths turn risk policy into a visible process model. Thresholds and policy can change without burying decisions inside the agent's code.

People retain authority at the critical decision points without becoming an operational bottleneck for every case.

## Further reading (Hebrew sources)

- [Israel National Digital Agency: Responsible use and AI risk management](https://harhayeda.gov.il/technological-guides/responsible-ai/)
- [Bank of Israel: Recommendations for AI use in the financial sector](https://kamakama.gov.il/publications/pressreleases/24-12-25/)
- [Privacy Protection Authority: Recommendations on the use of generative AI](https://www.gov.il/he/pages/ai_147)

## Summary

- The level of oversight should follow the risk and the reversibility of the action.
- A human task needs context, an SLA, and an escalation path.
- A good audit trail serves both compliance and continuous improvement.

[Want to turn AI policy into a working mechanism? Talk to us](/en/about/)
