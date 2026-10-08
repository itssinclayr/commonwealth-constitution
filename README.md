# A Constitution for the Commonwealth

---
## What This Is

This is a draft constitution for a hypothetical commonwealth.

The constitution is founded on a single governing principle:

> *No person, institution, collective, nation, or other entity should ever hold arbitrary power over the survival or self-determination of another.*

All rights, structures, and limits in the document are derived from this principle.

---
## Core Features

- **Sortition-based governance** - most governance roles filled by stratified random lottery, not election, eliminating the systematic selection of the power-hungry that elections produce
- **Three-sector economy** - worker cooperatives, a commons sector, and a personal sector; no private ownership of the means of production
- **Material Sufficiency Floor** - housing, food, healthcare, education, childcare, disability care, and elder care as unconditional rights for every person on Commonwealth territory
- **Radical transparency** - all exercises of governance power automatically logged in real time through the Transparency Engine
- **Three hard limits** - the Material Sufficiency Floor, the Anti-Domination Principle, and the Anti-Entrenchment Principle cannot be abolished or diminished by any future assembly
- **Generational reaffirmation** - every 25 years, a Constitutional Assembly of 1,000 persons reviews and may revise any provision except the three hard limits
- **No single executive** - executive function distributed across domain-specific Implementation Councils with no cross-domain authority
- **Open borders** - presence on Commonwealth territory is not criminalized; stable housing, healthcare, and food are guaranteed from moment of arrival
- **Restorative justice** - incarceration reserved for genuine public safety necessity; restoration of harm as the system's primary orientation
- **Reparative justice** - constitutionally mandated processes for Land Back / indigenous sovereignty and reparations for racial domination, with milestone-based timelines

---
## How to Read This Document

The constitution is organized into twelve titles:

| Title | Subject |
|---|---|
| I | Foundational Values and Inviolable Rights |
| II | Governance Principles and Sortition Design |
| III | Local Democracy, Legislature, Court, and Constitutional Assembly |
| IV | Accountability Infrastructure |
| V | Executive Function |
| VI | Economic Structure |
| VII | External Relations |
| VIII | Borders and Membership |
| IX | Internal Security and Justice |
| X | Reparative Justice and Indigenous Sovereignty |
| XI | Amendment, Revision, and Constitutional Survival |
| XII | Transitional Provisions |

The **Glossary** at the end of the full document defines every named governance body with its size, term length, renewability, and accountability relationships.

The **[legislature guide](legislature-guide.tex)** is a companion reference summarizing the Sortition Legislature's powers, procedures, and cross-references in one place, for readers who don't want to trace them across the full document.

The **[governance reference](governance_reference.html)** is an interactive HTML file providing a visual, filterable overview of all thirty governance bodies - their size, term lengths, renewability, and relationship to the Transparency Engine. Open it directly in a browser; no server required.

The full source is LaTeX (`main.tex`, which pulls in `title-01.tex` through `title-12.tex`, `frontmatter.tex`, `backmatter.tex`, `macros.tex`, and `glossary-entries.tex`). A **[compiled PDF](main.pdf)** is included in each release for readers who don't want to build it themselves.

---
## What I'm Looking For

This document is available for peer review. I'm particularly interested in:

- **Internal inconsistencies** - places where two provisions pull in different directions or where an institution's powers conflict with its mandate
- **Genuine gaps** - situations the document fails to address that would create vulnerabilities in practice
- **Foundational challenges** - arguments that the anti-domination principle, as stated, does not do the work the document claims it does
- **Empirical challenges** - real-world evidence that a proposed mechanism has failed when implemented elsewhere
- **Drafting improvements** - clearer, more precise, or more elegant ways to express an existing commitment
- **Anything else I've gotten wrong**

I'm not looking for objections on the grounds that this system is politically unrealistic in current conditions. That's taken for granted. The question is whether the design is sound, not whether it is immediately achievable.

---
## How to Contribute

**To raise a question, critique, or identify a gap:**
Open a [GitHub Issue](../../issues). Use the issue title to briefly describe the article or principle you are engaging with. Label your issue with one of the following:

- `gap` - something the document fails to address
- `inconsistency` - internal contradiction
- `foundational-challenge` - challenge to a core principle
- `empirical-challenge` - real-world evidence against a mechanism
- `drafting` - suggested improvement to clarity or precision
- `question` - genuine question about intent or interpretation
- `other-critique` - any other issues not covered by the above categories (use sparingly)

**To propose a specific textual amendment:**
Open a Pull Request against the relevant title source file - e.g. `title-06.tex` for the economic articles. Reference the Article and Section you're changing in the PR title (e.g. "Article XX, Section 4: ..."), since Article numbers are continuous across the whole document rather than restarting per Title. In the PR description, explain what you are changing and why, with reference to the foundational principle your change advances or protects. If your change affects a governance body's size, term, or composition, please also check `glossary-entries.tex` and `commonwealth_governance_reference.html` for matching entries that need updating alongside it.

**To propose a wholesale alternative approach to a section:**
Fork the repository and develop your alternative. Open an issue linking to your fork so others can engage with both versions.

---
## Versioning

This document is versioned. The current version is recorded in [CHANGELOG.md](CHANGELOG.md). Each version represents a meaningful revision cycle. Individual commits record smaller changes within a version.

The version number follows a simple convention:
- The first number is the **major version** - incremented when a foundational provision changes
- The second number is the **minor version** - incremented when a structural or institutional provision changes
- The third number is the **patch version** - incremented for drafting, clarification, or cross-reference corrections

Current version: **v0.1.1** 

---
## Philosophical Grounding

The constitution draws on several traditions without being orthodox within any of them:

- The **anti-domination** conception of freedom (Philip Pettit, republican political theory)
- **Sortition** as democratic mechanism (classical Athenian democracy, contemporary citizens' assemblies)
- **Commons governance** (Elinor Ostrom, institutional economics)
- **Georgist land value theory** (Henry George, land value capture)
- **Cooperative economics** (Mondragon tradition, worker ownership literature)
- **Dialectical materialism** as method - the document explicitly acknowledges where pragmatic compromise has been made under current material conditions and invites future revision as those conditions change

The retention of market coordination among cooperatives is acknowledged as a pragmatic departure from full socialist transformation, not a claim that markets are consistent with the elimination of domination. Future Constitutional Assemblies are explicitly invited to revisit this choice.

This retention of wages, money, and market coordination places the Commonwealth close to what Marx, in the *Critique of the Gotha Programme*, called the "lower phase" of communism - collective ownership of the means of production, but distribution still mediated by labor and exchange rather than by need.

---
## License

This repository uses two licenses, since it contains two different kinds of work. Both were chosen deliberately to match the document's own economics:

- **The constitutional text, glossary, front and back matter, legislative guide, and all other written documentation** are licensed under the **Peer Production License** (PPL, sometimes called "copyfarleft"). Anyone may share, adapt, and translate this work. Commercial use is permitted only for worker-owned businesses and collectives that distribute financial gain among their worker-owners; commercial use by a conventional privately-owned business is not permitted under this license.
- **The code in this repository** - the economic simulation (`commonwealth_sim.py`, `run_and_plot.py`), the interactive dashboard (`CommonwealthDashboard.jsx`), and the governance reference (`governance_reference.html`) - is licensed under the **Anti-Capitalist Software License** (ACSL), which restricts use in equivalent terms: free for individuals, non-profits, educational institutions, and organizations where ownership and labor are the same people.

I'm aware neither of these is a standard, widely-recognized license. They won't be auto-detected by GitHub, and "non-commercial" / "worker-owned" terms have not been tested in court. They're also difficult for an individual maintainer to enforce in practice. But a license restricting extractive commercial use is a more accurate expression of this project's values than a permissive one would be. 
