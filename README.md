# ProvenanceOS · imaging demo

**Live:** https://clinprephealth.github.io/provenanceos-imaging-demo/

A three-scene provider-facing demo for ProvenanceOS — longitudinal operational continuity infrastructure with governed probabilistic augmentation. The demo walks a clinical reviewer from the workflow they live in today through the workflow the substrate makes possible.

## The three scenes

- **Scene A — Current reality.** Six fragmented record panels from six different systems. Same person, six different views. The cognitive load of reconstructing a coherent record before clinical thinking begins.
- **Scene B — Substrate reconstruction.** A patient vignette grounds the case; a care-arc roadmap shows the full treatment course with every imaging event laid out. The specialist sees what aligns with the care arc and what sits off it. Click any imaging event to expand its detail.
- **Scene C — Augmented cognition.** Same view plus an operational continuity observation produced by the substrate's probabilistic-augmentation layer. The observation is additive to the deterministic reconstruction — non-authoritative, ACK-gated, structurally subordinate to the substrate's deterministic decisions.

## Access notifications (optional)

Opening the demo can email the site owner (configured in `access-notify.js`). Password gate files (`gate.js`, `gate.css`) remain in the repo but are not loaded — the demo is public.

## Form factor

Static HTML + a small amount of vanilla JavaScript. No build step. No remote assets. Open `index.html` in any modern browser and the demo runs.

## How to demo it

1. Open the live URL or `index.html` locally.
2. Walk the audience through **Scene A** first. Let the cognitive load land. Do not narrate the substrate yet.
3. Open **Scene B**. Read the vignette aloud. Point at the care-arc roadmap. Click through a few imaging events — especially the off-arc emergency-department study.
4. Open **Scene C**. Name what the substrate observed. Note that specialist authorization is still intact — the substrate has not made a decision.
5. Close on the positioning: ProvenanceOS is longitudinal operational continuity infrastructure with governed probabilistic augmentation.

## What this is not

- Not a pilot prototype. The skeleton's job is to make the operational contrast viscerally felt in a five-minute demo.
- Not connected to a live record system. The case is fictional and the data is hand-authored.
- Not a clinical interpretation. The substrate does not interpret, direct, or authorize. It observes, surfaces structured signals, and exposes the decision boundary the specialist owns.
- Not a UI specification. The styling is functional, not designed.

## Provider-facing language discipline

No substrate engineering vocabulary appears in any rendered scene: no schema names, no content-hash payloads, no numeric signal strengths, no raw day-counts where a human idiom exists. Verified pills show only the word "verified" with no payload. Numbers that would mean nothing to a clinician — and would risk being misread as clinical probabilities — are deliberately omitted from the operator-facing surface. The rationale is the surface.

## Privacy

The case is fictional. No real patient data, no real EMR connection, no patient names, no MRNs, no dates of birth. The fragmentation textures shown in Scene A are representative of the categories of seam that substrate-layer reconstruction resolves.
