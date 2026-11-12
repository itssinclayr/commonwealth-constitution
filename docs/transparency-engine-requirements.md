# Transparency Engine: Requirements Inventory

Extracted from the constitutional text (v0.1.0). Every requirement below is traceable to a specific Article and Section, so the document can be re-checked whenever the constitution changes.

**Method.** All twelve Titles were scanned for references to the Transparency Engine, including the glossary-linked ones and plain-text mentions of "logged" or "logging." That produced 71 source lines, consolidated here into the numbered requirements below. "Art." numbers are the continuous Roman numerals used throughout the document.

**Conventions.** IDs are stable (`TE-LOG-04`) so issues and design notes can cite them. *Source* is the Article and Section. Wording in quotation marks is the constitution's own. Anything not marked as a requirement sits in Section 10 (conflicts and gaps), which lists problems found while extracting and is separate from the requirements themselves.

---

## 1. Core properties

| ID | Requirement | Source |
|---|---|---|
| TE-CORE-01 | The system is open-source. | Art. XIII, Definition |
| TE-CORE-02 | The system is publicly auditable. | Art. XIII, Definition |
| TE-CORE-03 | The system is algorithmically automated. | Art. XIII, Definition |
| TE-CORE-04 | The system is cryptographically tamper-evident. | Art. XIII, Definition |
| TE-CORE-05 | All exercises of power at every governance level are logged, officiated, and disclosed in real time. | Art. XIII, Definition; Art. V, Principle |
| TE-CORE-06 | There is no human discretion over what to disclose. Disclosure is automatic and universal, subject only to the narrow exceptions in Section 6 below. | Art. XIII, Definition |
| TE-CORE-07 | The act of logging is what makes an exercise of power legally binding. | Art. XIII, Definition |
| TE-CORE-08 | Secrecy is the exception and requires specific constitutional authorization. Transparency is the default and requires no justification. | Art. V, Principle |
| TE-CORE-09 | No emergency protocol may suppress the Engine, the Whistleblower Infrastructure, or the Civic Initiative Infrastructure. | Art. XVII, Hard Limits |

## 2. Logging

### 2a. Constitutionally mandated categories (apply to all governance bodies, "without exception")

| ID | Category | Source |
|---|---|---|
| TE-LOG-01 | All governance decisions | Art. XIII, Significance Thresholds |
| TE-LOG-02 | All resource allocations | same |
| TE-LOG-03 | All communications regarding pending or active governance decisions | same |
| TE-LOG-04 | All deviations from pre-approved protocols | same |
| TE-LOG-05 | The Oversight Body may add categories but may never remove mandated ones. | same |
| TE-LOG-06 | Every standard Commons body has its proceedings fully logged. | Art. VI, Standard Commons Bodies |

### 2b. Body-specific logging obligations

| ID | Body or activity | What must be logged | Timing / constraint | Source |
|---|---|---|---|---|
| TE-LOG-10 | Local democratic assemblies | Deliberations, public and recorded | Real time | Art. VIII, Facilitation and Rotation |
| TE-LOG-11 | Exemption Review Panel | Decisions on disputed hardship exemptions, in full | Not stated | Art. VII, Mandatory Service |
| TE-LOG-12 | Implementation Councils | Implementation decisions at or above "significance thresholds" | Real time | Art. XVI, Mandate Constraint and Logging |
| TE-LOG-13 | Regulatory Commons Bodies | All deliberations, evidence considered, dissenting opinions, enforcement actions, and communications with regulated entities | Real time | Art. XXVII, Terms and Transparency |
| TE-LOG-14 | Foreign Relations Council | All negotiations | Real time; sensitive ones may be withheld up to 1 year | Art. XXVIII, Function |
| TE-LOG-15 | Foreign Relations Council | All solidarity activities and their funding, in full | Not stated | Art. XXIX, Human Rights and Non-Interference |
| TE-LOG-16 | Cross-Panel Coordination Body | All meetings and communications | Not stated | Art. XII, Cross-Panel Coordination |
| TE-LOG-17 | Housing Implementation Council | All allocation decisions | Real time | Art. XXXI, Commons-Allocated Housing |
| TE-LOG-18 | Housing Implementation Council | Land-tenure conversion assessments, with full documentation | Not stated | Art. XXXIX, Land Tenure Conversion |
| TE-LOG-19 | Security Investigation Governing Board | Existence of every investigation | Real time; content may be withheld (see TE-WH-05) | Art. XXXIII, No Secret Police |
| TE-LOG-20 | Security Enforcement Review Panel | All authorization decisions | Real time | Art. XXXIII, Security Enforcement Review Panel |
| TE-LOG-21 | Justice system | Existence of all restorative processes | Not stated; content protected (TE-WH-06) | Art. XXXIV, Minimum Standards |
| TE-LOG-22 | Secure facilities | All labor arrangements | Not stated | Art. XXXIV, Voluntary Labor |
| TE-LOG-23 | Civic Initiative Infrastructure | Each petition on initiation: existence, target, stated grounds, and running verified signature count | Immediately / real time | Art. XIV, Standard Mechanics |
| TE-LOG-24 | Civic Initiative Oversight Body | All deliberations and decisions | Real time | Art. XIV, Governance |
| TE-LOG-25 | Governance bodies generally | Any attempt to access petition signatory data outside the Electoral Commons verification process | Automatic; referred to the Security Enforcement Review Panel | Art. XIV, Protections |
| TE-LOG-26 | Security Board; Whistleblower Panel | Any attempt to direct specific tactics or technical implementation rather than priorities, logged as a potential constitutional violation | Automatic | Art. XXXIII, Investigation Body; Art. XIII, Whistleblower Infrastructure |
| TE-LOG-27 | Political organizations, media outlets, civil society and advocacy groups | All funding sources | Real time | Art. XXXII, Foreign Funding Prohibition |
| TE-LOG-28 | Commons asset governance | All governance of Commons assets, fully transparent | Not stated | Art. XXI, General Principles |
| TE-LOG-29 | Emissions fee | Revenue and its published split | Not stated | Art. XXV, Emissions Fee |
| TE-LOG-30 | Voluntary service incentives | Escalation Schedules | Not stated | Art. XXVI, Voluntary Service Incentives |
| TE-LOG-31 | Withheld matters | The fact that something is withheld, even while the content is protected | Always | Art. V, Limits of Transparency |

## 3. Publication

The Engine is also the channel through which bodies must *publish* documents, which is a separate function from logging events. These items need a versioned, public document store.

| ID | Item published through the Engine | Source |
|---|---|---|
| TE-PUB-01 | Reconfirmation review findings | Art. VI, Renewability |
| TE-PUB-02 | Stratification methodology, in full | Art. VII, Stratification |
| TE-PUB-03 | Orientation content for selected persons | Art. VII, Universal Onboarding |
| TE-PUB-04 | Citizen Oversight Panel findings, distributed to all residents | Art. XII, Powers |
| TE-PUB-05 | Emergency protocols and lead/supporting Council designations | Art. XVII, Pre-Legislation Requirement |
| TE-PUB-06 | Monetary Authority quarterly assessments and the Legislature's reasoning when it rejects an automatic increase | Art. XXIII, Monetary Authority |
| TE-PUB-07 | Annual accounting of qualifying growth and Floor expansions | Art. XXIII, Floor Growth Allocation |
| TE-PUB-08 | Pipeline methodology, forward-looking targets, and their five-year reviews | Art. XXVI, Pipeline Monitoring; Forward-Looking Capacity |
| TE-PUB-09 | Sector-exclusion thresholds for regulatory bodies | Art. XXVII, Sector Exclusion |
| TE-PUB-10 | Annual human-rights documentation on nations with diplomatic relationships | Art. XXIX, Human Rights and Non-Interference |
| TE-PUB-11 | Defensive Posture Review findings, in full | Art. XXX, Defensive Posture Review |
| TE-PUB-12 | Housing: annual reports, public vacancy register, annual progress reports on the housing gap | Art. XXXI, Commons-Allocated Housing; Stable Housing |
| TE-PUB-13 | Justice Standards Council standards, in full | Art. XXXIV, Justice Standards Council |
| TE-PUB-14 | Technical implementation of the Whistleblower anonymity mechanism, in full | Art. XIII, Whistleblower Infrastructure |
| TE-PUB-15 | Annual review of Cooperative Development Bank monitoring practices | Art. XX, Cooperative Development Bank |
| TE-PUB-16 | Full petition signatory lists once a petition expires | Art. XIV, Standard Mechanics |

## 4. Alerts

| ID | Trigger | Effect | Source |
|---|---|---|---|
| TE-ALERT-01 | A purported dissolution or restructuring of the constitutional order outside established processes | Immediate public alert to all residents. The Constitutional Court convenes within 24 hours and a national referendum is scheduled within 60 days (both automatic). | Art. IV, Dissolution Prohibition; Art. XIII, Public Alert |
| TE-ALERT-02 | The Anomaly Detection System finds accumulation patterns above defined thresholds | Alert | Art. XIII, Public Alert |
| TE-ALERT-03 | Any governance body attempts to act outside its defined authority | Alert | Art. XIII, Public Alert |
| TE-ALERT-04 | Emergency protocols activated | Alert | Art. XIII, Public Alert |
| TE-ALERT-05 | The monitored gap between Floor obligations and Commons revenue indicates structural underfunding | Automatic public alert. The Legislature must convene a review within 60 days. | Art. XXIII, Cooperative Surplus Contributions |
| TE-ALERT-06 | An attempt to access signatory data outside the verification process | Automatic log and referral | Art. XIV, Protections |

TE-ALERT-01 and TE-ALERT-05 start downstream institutional actions (a Court convening, a referendum, a Legislative session). The Engine therefore needs a defined way to notify or trigger those bodies, not only to publish.

## 5. Anomaly detection and its consumers

| ID | Requirement | Source |
|---|---|---|
| TE-ANOM-01 | Monitor all resource flows for accumulation patterns inconsistent with foundational principles. | Art. XIII, Anomaly Detection |
| TE-ANOM-02 | Monitor all decisions for systematic benefit to identifiable groups. | same |
| TE-ANOM-03 | Monitor all governance communications for coordination inconsistent with independent deliberation. | same |
| TE-ANOM-04 | Reports are automatic and public. | same |
| TE-ANOM-05 | The system cannot be silenced by any human actor. | same |
| TE-ANOM-06 | Anomaly reports on cross-domain coordination failures go to the Residual Coordination Council, which refers findings to the Legislature. | Art. XVIII, Permitted Functions |
| TE-ANOM-07 | Anomaly Detection thresholds are one of three independent signals for triggering an Extraordinary Constitutional Assembly (sustained above a threshold over a period set by the Legislature and published in advance). | Art. XI, Extraordinary Assembly |
| TE-ANOM-08 | Monitor in real time the gap between Floor obligations and all Commons revenue sources. | Art. XXIII, Cooperative Surplus Contributions |

## 6. Withholding, privacy, and access tiers

The constitution does define exceptions, but they are scattered across several Articles. This table consolidates them. Several are vague (see Section 10).

| ID | What is protected | Rule | Source |
|---|---|---|---|
| TE-WH-01 | Personal privacy | "Protected." Scope not defined. | Art. V, Limits of Transparency |
| TE-WH-02 | Operational security matters | Temporarily withheld "subject to constitutional authorization," for at most 5 years. The withholding itself is logged. | Art. V, Limits of Transparency |
| TE-WH-03 | Military capability classifications | Same 5-year maximum | Art. V, Limits of Transparency |
| TE-WH-04 | Sensitive ongoing foreign negotiations | Withheld for at most 1 year | Art. XXVIII, Function |
| TE-WH-05 | Content of active security investigations | Existence always logged. Content withheld by Board majority for up to 1 year, renewable once by supermajority. The embedded Citizen Oversight Panel has full access to withheld material throughout. | Art. XXXIII, No Secret Police; Investigation Body |
| TE-WH-06 | Content of restorative processes | Existence logged. Content protected, with no time limit stated. | Art. XXXIV, Minimum Standards |
| TE-WH-07 | Whistleblower identity | Absolute: never compelled, disclosed, or inferred, including by traffic analysis. Report content is hidden from the identified body during an active investigation. Routed simultaneously to the relevant Citizen Oversight Panels and the Security Investigation Governing Board. | Art. XIII, Whistleblower Infrastructure |
| TE-WH-08 | Petition signatories | Visible only to the Electoral Commons during the active period. Public after expiry. The architecture must prevent identification by any governance body. | Art. XIV, Standard Mechanics; Protections |
| TE-WH-09 | Housing: private register of Residential Tenures abandoned for over 3 years | Private, alongside the public vacancy register | Art. XXXI, Stable Housing |
| TE-WH-10 | Cooperative portfolio health data | Not shareable externally without the cooperative's consent | Art. XX, Cooperative Development Bank |
| TE-WH-11 | Exclusive data of the Transparency Engine Oversight Body, the Whistleblower Panel, and the Civic Initiative Oversight Body | Each body may not access the others' exclusive data without Constitutional Court authorization | Art. XIII; Art. XIV, Relationship to the Transparency Engine |
| TE-WH-12 | Anonymous reporting | The anonymity guarantee may not be overridden by any body, court order, emergency declaration, or legislative majority | Art. XIII, Whistleblower Infrastructure |

## 7. Functions beyond logging and publishing

| ID | Function | Source |
|---|---|---|
| TE-FN-01 | Conduct community recall votes (simple majority) for local enforcement officers. | Art. XXXIII, Community-Based Enforcement |
| TE-FN-02 | Maintain a real-time, verified petition signature count (shared substrate with the Civic Initiative Infrastructure). | Art. XIV, Standard Mechanics |
| TE-FN-03 | Operate the anonymous reporting channel, with zero-knowledge proof of civic membership as its anonymity mechanism. | Art. XIII, Whistleblower Infrastructure |
| TE-FN-04 | Accept real-time funding disclosures from private organizations, not only governance bodies. | Art. XXXII, Foreign Funding Prohibition |
| TE-FN-05 | Deliver alerts to *all residents*. | Art. XIII, Public Alert |

## 8. Governance and operation of the Engine itself

| ID | Requirement | Source |
|---|---|---|
| TE-GOV-01 | A Transparency Engine Oversight Body: 9 persons, 2-year renewable terms, subject to the reconfirmation mechanism. It may add logging categories but not remove mandated ones. | Art. XIII, Significance Thresholds |
| TE-GOV-02 | A Whistleblower Infrastructure Panel: 5 members, 3-year terms, selected for security investigation competency. It governs the Infrastructure and sets priorities. | Art. XIII, Whistleblower Infrastructure |
| TE-GOV-03 | A professional technical staff under a Staff Director (5-year terms, renewable), with operational independence within Panel-authorized parameters. | same |
| TE-GOV-04 | A Civic Initiative Oversight Body: 9 members, staggered 3-year terms. It maintains technical integrity and may not alter intervention thresholds, cooling periods, or consequences. | Art. XIV, Governance |
| TE-GOV-05 | The three systems share technical infrastructure under a published cooperation agreement. The agreement can be amended only by supermajority of both Oversight Bodies plus Constitutional Court review. | Art. XIV, Relationship to the Transparency Engine |
| TE-GOV-06 | The Panel coordinates with the Transparency Engine Oversight Body on shared technical substrate. | Art. XIII, Whistleblower Infrastructure |

## 9. Non-functional requirements implied by the text

| ID | Implied requirement | Why |
|---|---|---|
| TE-NFR-01 | Coverage must be universal across every governance level, including local assemblies. | TE-CORE-05, TE-LOG-10 |
| TE-NFR-02 | The system must keep operating, and stay reachable, during emergencies. | TE-CORE-09 |
| TE-NFR-03 | Any resident must be able to verify the log independently without trusting an operator. | TE-CORE-02, TE-CORE-04 |
| TE-NFR-04 | The anonymity design must resist metadata and traffic analysis, not only content disclosure. | TE-WH-07 |
| TE-NFR-05 | No single person or body may be able to suppress an anomaly report or an alert. | TE-ANOM-05 |
| TE-NFR-06 | Access tiers must be enforced technically, not only by policy: public, Electoral Commons, Citizen Oversight Panels, per-body exclusive data, Court-authorized access. | TE-WH-05, TE-WH-08, TE-WH-11 |
| TE-NFR-07 | Time-limited withholding needs automatic release, since there is no human discretion over disclosure. | TE-CORE-06, TE-WH-02 to TE-WH-05 |

---

## 10. Conflicts, ambiguities, and gaps found during extraction

These need a decision, either as constitutional text or as a design choice, before the matching requirements can be implemented.

| # | Finding | Kind |
|---|---|---|
| G1 | **Wrong cross-reference.** Art. XIII says disclosure is subject to "the narrow exceptions defined in this Article," but the exceptions live in Art. V (Limits of Transparency) and in individual Articles (Section 6). Art. XIII defines none itself. | Text fix |
| G2 | **Undefined terms.** "Personal privacy" and "operational security matters" have no definition, and the constitution says withholding needs "constitutional authorization" without saying who gives it or how. That conflicts with TE-CORE-06 (no human discretion): some human or process must decide what falls in a protected category. | Text decision |
| G3 | **Inconsistent withholding periods.** Operational security: 5 years. Foreign negotiations: 1 year. Investigations: 1 year, renewable once. Restorative-process content: no limit stated. Nothing says what happens at expiry (automatic release?). | Text decision |
| G4 | **"Significance thresholds" are never defined.** Art. XIII's section is titled "Significance Thresholds for Logging" but lists categories that apply "without exception," not thresholds. Art. XVI says Implementation Councils log decisions "at or above" those thresholds. It is unclear whether everything is logged or only above some level. | Text fix |
| G5 | **"Real time" and "immediately" are undefined.** There is no latency bound for logging, alerts, or publication. | Design decision, possibly text |
| G6 | **The ingestion problem.** Logging makes power legally binding, so decisions must be made *through* the Engine. The text does not say how the Engine learns of actions taken outside it. TE-LOG-04 (deviations from protocols) and TE-ALERT-03 (acting outside authority) also require machine-readable definitions of every body's protocols and authority, which do not exist yet. | Design decision |
| G7 | **Anomaly thresholds have no owner.** Art. XIII does not say who sets the thresholds or defines "systematic benefit" and "coordination inconsistent with independent deliberation." Because the system "cannot be silenced," false-positive handling matters too. Art. XI assigns the Extraordinary Assembly threshold to the Legislature but is silent on the rest. | Text decision |
| G8 | **Nobody is named to build or run the Engine core.** The Whistleblower Infrastructure and the Civic Initiative Infrastructure each have technical staff or an Oversight Body that maintains technical integrity. The Transparency Engine Oversight Body can only add logging categories. Hosting, key custody, and who may change the code are unspecified. | Text decision |
| G9 | **Public investigation log vs. whistleblower secrecy.** Investigation *existence* must be publicly logged in real time (TE-LOG-19). A body named in a whistleblower report must receive no information about it during an investigation (TE-WH-07). If the public log reveals a target or timing, those collide. The log may need to omit the target. | Text decision |
| G10 | **The Engine conducts votes.** Community recall votes happen "through the Transparency Engine" (TE-FN-01). That requires authentication, one-person-one-vote, and a position on ballot secrecy versus a fully transparent log. The Engine is not otherwise described as a voting system. | Text decision |
| G11 | **Funding disclosure reaches private actors.** TE-LOG-27 applies to political organizations, media outlets, civil society, and advocacy groups. The text does not define those categories, and real-time donor disclosure conflicts with personal privacy (TE-WH-01). | Text decision |
| G12 | **Local deliberations recorded in real time** (TE-LOG-10) implies audio, video, or transcript capture at every local assembly. The text does not say who operates the capture, how participants' privacy is handled, or what happens where connectivity is poor. | Design decision |
| G13 | **No process for Court authorization of data access** (TE-WH-11): who may request it, on what standard, and how fast. | Text decision |
| G14 | **"All residents" alert delivery.** No channel is specified, and nothing covers residents without digital access or the Legislature's multilingual commitments. | Design decision |
| G15 | **Resilience.** The Engine cannot be suppressed by emergency protocols (TE-CORE-09), but the text says nothing about technical failure, outages, or attack, and no requirement defines what happens when it is unreachable and a decision must still be made. | Design decision |

---

## 11. Suggested order of work

1. Resolve G1, G2, G4, and G7. They are short text fixes or policy decisions that unblock almost every other requirement.
2. Decide G6 (the ingestion model), because it shapes the whole architecture.
3. Decide G3 and TE-NFR-07 together, since automatic release of time-limited content needs both.
4. Treat TE-FN-03 (the whistleblower channel) as a separate workstream. It needs a cryptographer's review before any implementation.
5. Define the event schema and logging categories from Section 2, then build the smallest vertical slice: schema, append-only log, public verifier, and one alert rule.
