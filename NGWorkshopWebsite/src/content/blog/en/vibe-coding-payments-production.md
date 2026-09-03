---
title: "Payments in Vibe Coding: From a Checkout That Works to a System You Can Trust"
urlSlug: vibe-coding-payments-production
excerpt: "The charge went through, but the order never opened — or the other way round. Here's how to build a payment flow that is secure, consistent, and resilient to duplicates in an AI-built application."
locale: en
translationKey: vibe-coding-payments-production
publishedAt: 2026-07-12
author: NG Workshop
category: Technology
tags:
  - Vibe Coding
  - Payments
  - Stripe
  - Webhooks
  - Application Security
  - Workflow
featured: false
draft: false
seoTitle: "Payments in Vibe Coding: A Guide to a Safe Production Launch"
seoDescription: "A guide to safe payments in Vibe Coding applications: Checkout, webhook verification, idempotency, permissions, testing, and reconciliation."
---

The user saw "Payment successful", but on your side the order is still marked as pending. They click again — and now there are two charges. This isn't a rare glitch in a quickly built payment flow: it's the result of a mistaken assumption that a payment is a single API call with a success response.

In practice, a payment is a distributed process: the browser, your server, the payment provider, a webhook, and sometimes an invoicing or inventory system all have to agree on the same state — even when a request is delayed, sent twice, or arrives out of order.

## First rule: the browser is not the source of truth

You must not grant a product, open a subscription, or mark an order as paid simply because the user landed on `/success`. That URL can be opened manually, the window can be closed before the redirect, and data stored on the client can be changed.

The source of truth has to be a verified confirmation from the payment provider, received and processed on the server. The browser displays state; it does not determine it.

A correct basic flow looks like this:

1. The server creates an internal order in a `pending` state.
2. The server calculates the price from a trusted catalogue — not from an amount sent by the browser.
3. The server creates a Checkout session or Payment Intent with the payment provider.
4. The user completes payment on the provider's secure page.
5. The provider sends a signed webhook to the server.
6. The server verifies the signature and the link to the order.
7. Only then does the order move to `paid` and fulfilment begin.

## Prefer a payment page hosted by the provider

The less card data passes through your system, the smaller the risk surface. For most Vibe Coding products, a payment page hosted by a compliant payment provider — or a component fully supplied by it — is a better default than a card form written by AI.

According to the [PCI Security Standards Council](https://www.pcisecuritystandards.org/faqs/if-a-merchant-s-e-commerce-implementation-meets-the-criteria-that-all-elements-of-payment-pages-originate-from-a-pci-dss-compliant-service-provider-is-the-merchant-eligible-to-complete-saq-a-or-saq-a-ep/), eligibility for the SAQ A path depends, among other things, on all elements of the payment page originating directly from a PCI DSS compliant service provider, and on all other eligibility criteria being met. A single element that collects card data and is served from your own site may change the scope of your responsibility.

This isn't only a compliance question. A custom form can expose card data through malicious JavaScript, logs, or analytics tools. A hosted page moves a significant portion of the risk and the maintenance outside the boundaries of your application.

## Every webhook must pass signature verification

A public endpoint that accepts JSON and updates an order to `paid` is an open door to forgery. [Stripe's documentation](https://docs.stripe.com/webhooks) warns that without verification, an attacker can send a forged event and trigger product fulfilment, access grants, or record changes.

Safe handling includes:

- reading the raw request body as your library's guidance requires;
- verifying `Stripe-Signature` using the endpoint secret;
- a separate secret per endpoint and per test/live environment;
- accepting only the event types you actually need;
- returning a fast response and moving heavy work to a queue;
- recording the event identifier for auditing and duplicate prevention.

Never store the webhook secret in the frontend, in the code repository, or in a prompt to an AI tool.

## Idempotency: the same event must not perform the same action twice

Networks fail, users click again, and providers resend events. Every financial or business action therefore needs to be idempotent: reprocessing the same request doesn't change the outcome after the first time.

When creating a payment, you can use the internal order identifier as the idempotency key. When processing a webhook, store the event identifier — or the combination of event type and object identifier — and perform the update and the "handled" marker inside the same database transaction.

A schematic example:

```text
begin transaction
  if event_id already processed:
    return success

  lock order
  verify expected amount, currency and customer
  move order from pending to paid
  record event_id as processed
commit
```

Returning `200` for an event that has already been handled is correct behaviour. The goal is for the payment provider to stop retrying, without performing fulfilment again.

## Don't manage a payment with a boolean

A single field like `isPaid: true` doesn't describe reality. A payment can require additional authentication, fail, be cancelled, be partially refunded, or turn into a dispute.

Define an explicit state machine, for example:

| State | Meaning | Allowed actions |
|---|---|---|
| `pending` | An order was created, no payment confirmation | Payment attempt or cancellation |
| `processing` | The provider is still processing | Wait and check only |
| `paid` | A verified confirmation was received | One-time fulfilment |
| `failed` | The payment attempt failed | New attempt |
| `refunded` | A full refund was issued | Stop service per policy |
| `partially_refunded` | Part of the amount was refunded | Accounting and fulfilment adjustment |
| `disputed` | A dispute was opened | Freeze action and review manually |

A transition between states happens only from an authorised, recorded event. For example, an order cannot move directly from `failed` to `refunded`.

## Five common failures in quickly generated code

### 1. The price comes from the client

The frontend sends `price: 49`, and the server charges the value it received. An attacker can change it. The server should accept a product identifier, look up the price from an internal source, and validate currency, tax, and discount.

### 2. Test mode is connected to production data

Test and live keys, webhooks, and products must be kept separate. Check that the webhook secret matches the same endpoint and the same environment in which the event was created.

### 3. Every webhook is accepted

Listening to all events increases load and bloats the code. Define a closed list of supported events and reject any other type without changing state.

### 4. The confirmation email is sent before the commit

If you sent a confirmation to the customer and then the database transaction failed, you've created a gap that is hard to repair. Persist the state change first, and trigger side effects through a queue or a reliable outbox.

### 5. There is no reconciliation between the provider and the database

A webhook can fail even though the payment went through. Run scheduled reconciliation that compares transactions at the provider with internal orders and reports discrepancies for review.

## Tests you must have before launch

Don't test only a card that succeeds. Your test environment should cover at least:

- a successful payment with exactly one fulfilment;
- an identical webhook event arriving twice;
- events arriving out of order;
- an invalid signature or a modified request body;
- an amount or currency that doesn't match the order;
- a payment that fails and then succeeds;
- full and partial refunds;
- a timeout between your server and the provider;
- a user who closed the window before the success page;
- a fulfilment failure after a charge, escalated to a human.

The most important test is the end-to-end business process: money moved, the record was updated, the product was delivered exactly once, and the team can explain what happened.

## Payments need a human in the loop

Not every event should be resolved automatically. An unusual amount, a high number of refunds, a reconciliation gap, or a dispute should create a task for a person with all the context they need — without exposing financial information that isn't necessary.

A Process-First approach separates the decision from the execution: AI can classify a failure reason or prepare a summary, but an exceptional refund, a permission change, or handling a dispute stays inside an approved process with an audit trail.

## Production payments checklist

- [ ] Card data is handled on a secure page or component from a compliant provider.
- [ ] Price, currency, and discount are calculated and validated on the server.
- [ ] Webhooks pass signature verification before any change.
- [ ] Every financial action and fulfilment is idempotent.
- [ ] An explicit state machine exists for the order and the payment.
- [ ] The test environment is fully separated from production.
- [ ] Logs contain no card details, secrets, or unnecessary information.
- [ ] Monitoring, alerting, and reconciliation are in place.
- [ ] Exceptional refunds and disputes go through human review.
- [ ] Duplicates, reordering, timeouts, and partial failures were tested.

## Summary

A reliable payment flow doesn't end at the Checkout button. It requires clear trust boundaries, a verified server-side confirmation, duplicate prevention, state management, reconciliation, and a way to handle exceptions.

If you built payments with AI and you're not sure what happens when a webhook arrives twice, or when the charge succeeds and fulfilment fails, start with the [Vibe Coding Rescue guide](/en/blog/vibe-coding-rescue-engineer/) and the [security and privacy guide](/en/blog/vibe-coding-security-privacy/). To review your current implementation, get in touch about our [Vibe Coding Rescue](/en/services/vibe-coding-rescue/#contact) service.

---

**Sources and further reading:**

- [Receive Stripe events in your webhook endpoint — Stripe](https://docs.stripe.com/webhooks)
- [PCI DSS eligibility for hosted payment pages — PCI SSC](https://www.pcisecuritystandards.org/faqs/if-a-merchant-s-e-commerce-implementation-meets-the-criteria-that-all-elements-of-payment-pages-originate-from-a-pci-dss-compliant-service-provider-is-the-merchant-eligible-to-complete-saq-a-or-saq-a-ep/)
- [PCI SSC guidance for e-commerce scripts and SAQ A](https://www.pcisecuritystandards.org/faqs/1588/)
- [Secure Coding with AI Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
