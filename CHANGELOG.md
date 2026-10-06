# Changelog

All notable changes to this Constitution are documented here.

This file follows a modified [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format adapted for constitutional drafting. Every entry should be written so that a person unfamiliar with the drafting history can understand what changed, why it changed, and what principle the change advances or protects.

---

## How to Maintain This File

### When to add an entry

Add an entry whenever you make a change that affects the meaning, structure, or institutional design of the document. This includes:

- Adding, removing, or substantially revising any article or section
- Adding a new governance body or significantly changing an existing one's powers, composition, or accountability
- Resolving an identified gap or inconsistency
- Changing a threshold, term length, or membership number
- Revising the Glossary to reflect institutional changes

Do **not** add entries for purely typographical corrections, punctuation fixes, or reformatting that does not affect meaning. Those go in commits with a note like `fix: typo in Article XVII Section 3` and do not need a changelog entry.

### Version numbering

Versions follow the format `vMAJOR.MINOR.PATCH`:

- **MAJOR** — increment when a foundational provision changes (Title I principles, the three hard limits, the generational reaffirmation mechanism, the amendment process)
- **MINOR** — increment when a structural or institutional provision changes (new governance body, changed term lengths, new rights, new article)
- **PATCH** — increment for drafting improvements, cross-reference corrections, clarifications that do not change meaning

The document is currently pre-ratification. Major version 0 signals this. Upon ratification by Constitutional Assembly, the document advances to v1.0.0.

### Entry format

Each version entry should follow this structure:

```
## [vX.Y.Z] – YYYY-MM-DD

### Added
- Brief description of what was added and why.

### Changed
- Brief description of what changed, what it changed from, and what principle the change advances.

### Removed
- Brief description of what was removed and why.

### Fixed
- Brief description of gaps, inconsistencies, or cross-reference errors resolved.
```

Not every version will have all four categories. Use only the ones that apply.

### Referencing issues and pull requests

If a change was prompted by a GitHub Issue or Pull Request, reference it in the entry:

```
- Added Financial Regulatory Body to Article XIII, Section 6. Closes #12.
```

### Linking to the deliberative record

For significant changes — especially those that touch foundational principles — add a brief note on the deliberative reasoning:

```
### Changed
- Article XXIX (formerly Article XXVIII): Revised land lease system from annual fee model
  to transfer-fee-on-sale model, following analysis of China's land lease experience and
  Georgist land value theory. Annual charges create a form of ongoing rent inconsistent
  with the anti-domination principle; transfer fees capture community-generated land value
  without imposing perpetual obligations on leaseholders.
```

This keeps the reasoning attached to the change rather than buried in commit messages.

---

## Version History

---

## [v0.1.0] – 2026-09-04

*Foundational public release. Submitted for peer review and deliberation.*

### Added

#### Title I — Foundational Values and Inviolable Rights
- **The Anti-Domination Principle**: no person, cooperative, Commons institution, government body, algorithm, federation, foreign state, or other entity may hold arbitrary power over the survival or self-determination of any person. All other rights and structures in the Constitution are derived from this principle.
- **The Material Sufficiency Floor**: housing, food, healthcare, education, childcare, and elder care as unconditional rights for every person on Commonwealth territory, on the reasoning that material desperation is a lever of domination the Constitution removes entirely.
- **Equality provisions**: equal standing regardless of race, ethnicity, national origin, disability, age, religion, or language; a constitutional commitment to reparative justice for historical racial domination, with terms determined through the process established in Article XXXVI.
- **The Anti-Entrenchment Principle**: any attempt to concentrate power in violation of the Constitution triggers an automatic public alert through the Transparency Engine, automatic Constitutional Court convening within twenty-four hours, and a mandatory national referendum within sixty days.
- **Transparency as a foundational value**, underpinning the accountability infrastructure established in Title IV.

#### Title II — Governance Principles and Sortition Design
- **General governance principles**: all governance roles are temporary, non-renewable by default, and post-service constrained; a **No Self-Governance Principle** bars any body from setting the rules governing its own composition, selection, accountability, or scope.
- **Reconfirmation mechanism**: renewable positions are reviewed at the end of each term (or every five years, for terms longer than that), with early review available via Citizen Oversight Panel supermajority or civic petition.
- **Sortition** established as the default selection mechanism for governance roles, with mandatory service obligations, civic duty framing, and a defined hardship exemption process (self-certification, Electoral Commons verification, Exemption Review Panel) for those who cannot serve.
- **The Electoral Commons**: administers sortition draws, stratification methodology, and eligible-pool maintenance, with no discretion over outcomes.
- **The Qualification Commons**: maintains qualification pools for sortition bodies requiring demonstrated competence, scored via blind review of written analyses rather than credential gatekeeping, governed by a nine-member Rubric Body.
- **Universal onboarding** for newly selected sortition participants, and a bootstrapping mechanism for populating qualification pools before any prior cohort exists.

#### Title III — Local Democracy, Legislature, Court, and Constitutional Assembly
- **Local democratic governance**: direct participation structures, rotating facilitation, and a **Minority Impact Assessment Body** reviewing local decisions for disparate impact.
- **The Sortition Legislature**: six hundred members selected by sortition, serving staggered three-year terms, with a Deliberative Process, an Expert Advisory Corps for technical input, post-service employment restrictions, a bad-faith removal process limited to process obstruction and corruption, and multilingual accessibility.
- **The Constitutional Court**: twenty-one justices selected by stratified sortition from a Qualification Commons pool, serving staggered seven-year non-renewable terms (three justices rotating annually). Constitutional override requires a supermajority of fourteen of twenty-one justices. A permanent thirty-member **Meta-Review Chamber** reviews all Court decisions and may compel reconsideration; a **Public Constitutional Petition** process lets five percent of civic membership trigger de novo re-examination by an entirely new sortition court and chamber.
- **The Constitutional Assembly**: one thousand persons convened every twenty-five years to review and revise any provision except the three hard limits (the Material Sufficiency Floor, the Anti-Domination Principle, and the Anti-Entrenchment Principle). An **Extraordinary Assembly** may be triggered outside this cycle if the Constitutional Court, the Citizen Oversight Panels (jointly, via a two-thirds vote of the Cross-Panel Coordination Body), and the Transparency Engine (via its Anomaly Detection thresholds) independently identify systemic constitutional failure.

#### Title IV — Accountability Infrastructure
- **Citizen Oversight Panels**: twelve-person panels embedded within every governance body and Implementation Council, with communicative and investigative but not binding authority. A **Cross-Panel Coordination Body** shares observed patterns across Panels on a quarterly basis.
- **The Transparency Engine**: automatic, real-time logging of governance power exercises, with defined significance thresholds, a public alert function, an Anomaly Detection System, and whistleblower protections administered through a dedicated Whistleblower Infrastructure.
- **The Civic Initiative Infrastructure**: five defined citizen intervention types — Constitutional Court Decision Review, Technical Position Review, Legislative Decision Review, Regulatory Body Mandate Review, and Emergency Protocol Post-hoc Review — each with its own civic-membership threshold and cooling period. This Infrastructure, along with the Transparency Engine and Whistleblower Infrastructure, may never be suppressed by any emergency protocol.

#### Title V — Executive Function
- **No single executive**: executive function is distributed across domain-specific **Implementation Councils**, each with defined structure, leadership, mandate constraints, and full Transparency Engine logging, coordinated across domains through a Coordination Assembly with no independent decision authority.
- **Emergency Protocols**: a pre-legislation requirement for predictable cross-domain emergencies, automatic activation via a sixteen-member Emergency Threshold Verification Body, hard limits on emergency powers (the Material Sufficiency Floor, the Anti-Domination Principle, the Transparency Engine, the Whistleblower Infrastructure, and the Civic Initiative Infrastructure may never be suspended, overridden, or suppressed under any emergency), and a three-part gap protocol for novel emergencies. A seventy-two-hour response gap before full legislative reauthorization is acknowledged directly in the text as a genuine, only partially designable-away vulnerability.
- **The Residual Coordination Council**: five persons drawn from former Implementation Council Directors, former Foreign Relations Council members, and former Constitutional Court justices, serving two-year terms, exercising narrow fallback coordination functions by unanimous decision only, with an emergency-sortition and Constitutional Court fallback if the eligible pool is ever insufficient.

#### Title VI — Economic Structure
- **The Three-Sector Economy**: worker cooperatives, a Commons sector, and a personal sector, with no private ownership of the means of production. Market coordination among cooperatives is retained as an explicit, acknowledged pragmatic compromise, open to revision by future Constitutional Assemblies.
- **The Worker Cooperative Sector**: a cooperative mandate enforced by a National Cooperative Standards Body, democratic governance requirements, a ten-to-one wage ratio cap, cooperative market rules, and a publicly chartered Cooperative Development Bank (fifteen-member sortition-selected board, staggered five-year non-renewable terms) providing at-cost startup and working capital financing through a defined development partnership process.
- **The Commons Sector**: collectively held assets and services that may not be privatized or converted to investor ownership.
- **Land Tenures**: a Residential and Productive Tenure system replacing private land ownership, inheritance rules, a Commons Land Fund, and a Housing Implementation Council.
- **Finance and Money**: prohibited financial activities (speculation, private banking for profit, and related extractive practices), a not-for-profit Public Banking System, a Monetary Authority calibrating allocation to real productive capacity (with an automatic minimum cooperative-surplus-contribution increase where allocation is substituting for structurally inadequate contributions), a Commons Investment Fund, cooperative surplus contribution rates reviewed on a five-year cycle, a **Floor Growth Allocation** directing no less than fifteen percent of real economic growth to expanding Material Sufficiency Floor provision, and a **Personal Sector Wealth Transfer Contribution** on inherited non-tenure assets, phasing in from five to twenty times the Commonwealth median annual wage per heir.
- **Intellectual property and innovation** governed through a Knowledge Commons rather than exclusive private rights.
- **Ecological Limits**: a rolling climate mandate reviewed every five years with automatic escalation triggers, and an **Emissions Fee** on Worker Cooperative and Commons Sector production that cannot function as a pay-to-exceed mechanism against the Constitution's hard ecological limits.
- **Essential Labor and Material Production**: pipeline monitoring and forward-looking capacity targets for essential goods and services, a **Food Stability Implementation** delivering an unconditional, non-means-tested staple food basket entitlement redeemable at any food cooperative, and an **Essential Goods Market Concentration** prohibition barring cooperatives from hoarding or withholding staples to manipulate price or availability.
- **Regulatory Commons Bodies**: fifteen-member tripartite bodies (five Democratic Stream, five Expert Stream, five Affected Community Stream) overseeing Environmental, Public Health and Safety, Worker Safety, Financial, and National Cooperative Standards regulation, with sector-conflicted persons excluded from all three streams and independence from the sectors they regulate.

#### Title VII — External Relations
- **The Foreign Relations Council**: twelve members overseeing diplomatic relations, subject to the same conflict-of-interest and post-service employment rules as the Sortition Legislature.
- **The Anti-Imperialism Principle**: constitutional prohibitions on foreign military bases, currency or credit coercion, debt leverage, conditional aid, covert interference, and dependency-creating trade relationships, alongside affirmative positive obligations and a **Tariff Policy** permitting narrow, purpose-stated, sunset-bound tariffs without opening a loophole in those prohibitions. A twenty-member Treaty Review Body reviews international agreements; the tension between collective defense arrangements and the anti-imperialism principle is acknowledged directly in the text.
- **Defense**: a defensive-sufficiency doctrine, civilian military governance, a no-first-use nuclear commitment, an eight-member Nuclear Use Authorization Council with tiered authorization thresholds and a defined Authorization Window with a fail-safe default of no launch if required review cannot be completed in time, a sixteen-member Defensive Posture Review Body conducting mandatory four-year reviews, a constitutional Military Budget Cap of two percent of GDP, and an active disarmament commitment proportional to verified reductions by other nuclear states.

#### Title VIII — Borders and Membership
- **Open presence**: presence on Commonwealth territory is not criminalized; stable housing, healthcare, and food are guaranteed from the moment of arrival, without regard to duration of presence or immigration status.
- **Civic Integration**: a Civic Integration Index measured along two verifiable dimensions (cooperative participation and education completion) with a four-year ceiling to automatic full civic membership, which alone confers the right to be selected for governance positions via sortition and to vote in national direct votes, referenda, and civic initiative processes.

#### Title IX — Internal Security and Justice
- **Internal Security**: a constitutional bar on secret police and mass surveillance, strict separation of investigation from enforcement, a sortition-governed Security Investigation Governing Board, protections for governance participants under investigation, a Security Enforcement Review Panel, and an emphasis on community-based enforcement.
- **Justice Restoration**: a restorative-justice default and abolition of incarceration as the presumed response to harm, **Community Justice Bodies** embedded in local democratic governance (staggered two-year terms, no consecutive service), a Justice Standards Council setting Commonwealth-wide minimum standards, a defined escalation mechanism for cases restorative processes cannot resolve, specific provisions for intimate partner and domestic violence, standards for the rare cases requiring secure facilities, and protections for any labor performed within them.

#### Title X — Reparative Justice and Indigenous Sovereignty
- **Indigenous Sovereignty**: a jointly structured Land Back Negotiation Office established within one year of ratification, with a defined negotiation timeline, a full-sovereignty exit pathway under which returned land leaves Commonwealth territory entirely, transition protections for infrastructure and residents, and constitutional entrenchment of resulting territorial agreements. If the joint convening cannot reach agreement on staffing, budget, or term structure within the establishment deadline, the Electoral Commons convenes a bare interim Office to keep negotiations alive.
- **Reparations**: a Reparations Design Council with affected-community majority representation and genuine veto authority over its own mandate, constituted within one year of ratification through community nomination and Electoral Commons coordination. A documented Harm Assessment, a Form and Scale Recommendation protected from legislative reduction below a supermajority threshold, annual reparative allocations beginning in year four, and a mandatory ten-year gap-closure review with automatic escalation. The reparative obligation continues until the Council itself, with an affected-community majority, determines it has been sufficiently addressed — the Commonwealth does not unilaterally declare it complete.

#### Title XI — Amendment, Revision, and Constitutional Survival
- **Ordinary Amendment**: provisions outside the Title I foundational principles may be amended by a four-fifths Legislative supermajority, sixty percent national ratification, and Constitutional Court review for consistency with Title I.
- **The Failure Protocol**: a defined constitutional response if systemic failure is identified outside the normal amendment and Extraordinary Assembly processes.

#### Title XII — Transitional Provisions
- **Founding mechanisms** bootstrapping the institutions that cannot pre-exist their own ratification: initial Qualification Commons rubric-setting and scoring, Cooperative Development Bank Peer Panel formation, a Land Tenure Conversion process granting Residential Tenure without charge to persons who built their own dwelling, and a staggered sortition bootstrap for populating the Legislature and Court's first cohorts.

#### Front and Back Matter
- A **Preface** situating the Constitution as a proposal for deliberation, acknowledging the pragmatic compromises made under current material conditions and inviting future revision as those conditions change.
- A **Conclusion** inviting readers to identify what the document gets wrong, framing the aim as a principled system placing human freedom and dignity above the comfort of those who would hold power, and committing each generation to the tools to make the system more just than the last.

---

*This changelog will be updated with each revision cycle. The goal is that any person reading this file can understand the full arc of the document's development without access to the drafting conversations that produced it.*
