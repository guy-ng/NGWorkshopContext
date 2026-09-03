---
title: "Who Approved That? The Audit Trail Your AI Agents Are Missing"
urlSlug: ai-agent-audit-trail-camunda-89
excerpt: "Camunda 8.9 adds a centralized audit log and agent-to-agent connectors. Here is what a compliance officer at a regulated Israeli organization should ask before rolling out AI agents."
locale: en
translationKey: ai-agent-audit-trail-camunda-89
publishedAt: 2026-08-03
author: Guy Elisha
category: Compliance
tags:
  - Audit Trail
  - Compliance
  - AI Agents
  - Camunda
  - Governance
  - Banking
coverImage: /images/blog-process.svg
coverAlt: "An audit log of AI agent actions within a business process"
featured: false
seoTitle: "AI Agent Audit Trail with Camunda 8.9 | NG Workshop"
seoDescription: "Camunda 8.9's centralized audit log, agent-to-agent connectors, and orchestration API - what they mean for compliance in regulated Israeli organizations."
---

An external auditor asks: "The agent approved this request - who reviewed it, and against which rule?" If the answer is "the agent just decided," you have a problem. Not a technical one - a regulatory one.

Regulated Israeli organizations, especially in financial services, are already facing this question. As AI agents move from conversation to action - approving credit, updating a customer record, opening a claim - the need for complete, accurate documentation grows with them. Camunda 8.9 adds several capabilities that speak directly to this, and they are worth understanding before you choose an architecture for AI agents.

## What is new in Camunda 8.9

According to Camunda's release announcement, the version adds a centralized audit log that captures critical operations across the process, identity, and user task domains in one place. The idea is that a compliance team can query the log to produce defensible evidence during an internal or external audit, instead of piecing together a picture from several separate systems.

The audit log has several properties that matter to a regulated organization:

- **Access via the Orchestration Cluster REST API**, so data can be pulled into an existing GRC system rather than relying solely on an admin console.
- **Integration into Operate, Tasklist, and Identity**, meaning the record does not live only inside the agent's "black box" but in the operational tools the team already uses.
- **Role-based access control** over sensitive data within the log itself.
- **Configurable capture** of which operation types and actors are logged, so the level of documentation can match the risk classification of the process.

The release also adds dedicated connectors for A2A (Agent-to-Agent) - a protocol that lets AI agents communicate through signed, structured messages without a custom integration for every pairing. The point that matters for compliance: according to Camunda, even when one agent talks to another, the platform continues to maintain the audit trail and enforce governance guardrails on the interaction - so agent-to-agent communication does not create an undocumented gray zone.

## Why this matters for a regulated Israeli organization

Bank of Israel supervision expects regulated entities to demonstrate control, transparency, and documentation around automated decision processes - particularly where there is potential impact on a customer. At a principled level, this mirrors expectations already familiar from outsourcing risk management and core banking systems: whoever operates the system needs to be able to show "who did what, when, and under which rule" - even when the decision was executed by an automated component.

Privacy Protection Regulations add another layer: when an AI agent touches personal data, there needs to be a way to identify which data was viewed or updated, and by which process. An audit log that connects the agent's action, the identity of the actor (human or agent), and the business process is exactly the infrastructure that answers this without a separate documentation project.

To be precise: this is not regulatory approval for agentic AI, and it does not replace internal risk management. What it is, is an infrastructure capability that makes meeting existing documentation and control requirements substantially easier.

## What this means for your organization

If you are considering AI agents in a sensitive process - credit, claims, customer service with financial impact - ask three questions before deployment:

1. **Where does the documentation live?** In a separate interface owned by the AI vendor, or inside the orchestration layer that already manages the rest of the process?
2. **Who can pull audit evidence without asking engineering?** If the answer is "someone needs to write a log query," that is a warning sign.
3. **What happens when one agent triggers another?** Agent-to-agent communication without a unified audit trail is a common blind spot.

This is exactly the approach we advocate at NG Workshop: AI that works within the process, not instead of it - so documentation, control, and permissions are part of the architecture from day one, not something bolted on after a regulator asks a question. We covered the separation between agent and process engine in [AI Agents Need a Conductor](/en/blog/ai-agents-need-orchestration/), and the balance between automation and human oversight in [Human-in-the-Loop as Governance](/en/blog/human-in-the-loop-governance/).

## Sources

- [Camunda 8.9: Fastest Path to Agentic Orchestration](https://camunda.com/blog/2026/04/camunda-8-9-fastest-path-to-agentic-orchestration/)

## Summary

- Camunda 8.9 adds a centralized audit log, accessible via API and integrated into existing operational tools.
- A2A connectors preserve the audit trail even when AI agents communicate with each other.
- For a regulated organization, this is infrastructure - not a substitute - for risk management and compliance with Bank of Israel and Privacy Protection Regulations expectations.

[Want to assess your organization's readiness for governed AI agents? Let's talk](/en/about/)
