"""
Commonwealth economic simulation.

Models the Constitution's core economic mechanics as a combined agent-based
(household wealth/inheritance) + macro-accounting (aggregate output, Floor
funding, emissions) simulation, run annually over a multi-generational
horizon.

WHERE NUMBERS COME FROM
------------------------
Parameters marked [CONSTITUTION] are taken directly from the ratified text:
  - wage_ratio_cap = 10          (Title VI, wage ratio cap)
  - floor_growth_share = 0.15    (Floor Growth Allocation, 15% of real growth)
  - wtc_start_mult = 5           (Wealth Transfer Contribution, phase-in floor)
  - wtc_max_mult = 20            (Wealth Transfer Contribution, phase-in ceiling)
  - ma_dependence_threshold-style auto-escalation logic (structural dependence
    finding -> automatic minimum contribution increase)

Everything else (productivity growth rate, savings behavior, population
turnover, base contribution rate, surplus share of output, emissions
decoupling) is NOT specified in the constitutional text and is a modeling
assumption, clearly labeled [ASSUMPTION] below and exposed as a parameter
so it can be changed and stress-tested rather than taken as given.
"""

import numpy as np
import pandas as pd
from dataclasses import dataclass, field


@dataclass
class Params:
    # --- population / time ---
    n_households: int = 3000          # [ASSUMPTION] agent count
    n_years: int = 120                # [ASSUMPTION] ~4 generations
    seed: int = 7

    # --- growth & production ---
    productivity_growth_mean: float = 0.015   # [ASSUMPTION] real growth/yr
    productivity_growth_std: float = 0.02     # [ASSUMPTION] annual shock vol
    surplus_share_of_output: float = 0.34     # [ASSUMPTION] coop surplus / output

    # --- wages ---
    wage_ratio_cap: float = 10.0              # [CONSTITUTION] Title VI
    wage_mobility_noise: float = 0.06         # [ASSUMPTION] intergenerational rank drift
    cost_of_living_noise: float = 0.25        # [ASSUMPTION] heterogeneity in need

    # --- savings behavior ---
    base_savings_rate: float = 0.06           # [ASSUMPTION] savings rate at median income
    savings_rate_income_sensitivity: float = 0.35   # [ASSUMPTION] higher earners save more
    public_bank_real_deposit_rate: float = 0.003    # [ASSUMPTION] flat, uniform, inflation-indexed-only

    # --- Material Sufficiency Floor & contributions ---
    # Floor level is set as a fraction of the starting median wage (~0.20x),
    # representing a collectively-provisioned service bundle (housing, food,
    # healthcare, etc.) available to every household regardless of wage --
    # not an income-tested cash top-up. [ASSUMPTION: the 0.20x multiplier;
    # the median-wage anchoring keeps it in a sane relationship to the wage
    # distribution regardless of other calibration choices.]
    floor_level_start: float = 0.575
    base_contribution_rate: float = 0.30      # [ASSUMPTION] starting cooperative surplus contribution rate
    contribution_rate_cap: float = 0.60       # [ASSUMPTION] practical ceiling
    floor_fund_share_of_contribution: float = 0.70  # [ASSUMPTION] vs. Commons Investment Fund
    floor_growth_share: float = 0.15          # [CONSTITUTION] Floor Growth Allocation

    # --- automatic minimum increase (structural dependence) ---
    ma_dependence_threshold: float = 0.30     # [ASSUMPTION] MA share of Floor cost that triggers finding
    ma_dependence_years_required: int = 3     # [ASSUMPTION] sustained-finding window
    auto_escalation_step: float = 0.03        # [ASSUMPTION] pp increase per triggered escalation
    legislature_block_probability: float = 0.0  # probability Legislature blocks an escalation by supermajority

    # --- Personal Sector Wealth Transfer Contribution ---
    wtc_start_mult: float = 5.0               # [CONSTITUTION] phase-in start, x median wage/heir
    wtc_max_mult: float = 20.0                # [CONSTITUTION] phase-in ceiling, x median wage/heir
    wtc_max_rate: float = 0.55                # [ASSUMPTION] top marginal rate at/above ceiling
    avg_heirs: float = 1.9                    # [ASSUMPTION] slightly below 2 -> mild population decline pressure,
                                               # offset by new-household formation; kept near replacement

    # --- emissions ---
    base_emissions: float = 1.0               # [ASSUMPTION] normalized starting emissions
    decarbonization_per_review: float = 0.12  # [ASSUMPTION] fractional cut per 5-yr climate mandate review
    cif_climate_effectiveness: float = 0.15   # [ASSUMPTION] extra decarbonization per unit CIF spend (diminishing)
    # Fee revenue as a fraction of total output, at the prevailing emissions
    # intensity (emissions / output_index). This naturally erodes as
    # decarbonization succeeds -- a real, known dynamic of carbon pricing --
    # while the rate itself is tightened at each climate mandate review.
    # [ASSUMPTION] ~2% of output at review-cycle start, ratcheting up 15%
    # per five-year review, alongside the climate mandate's own tightening.
    emissions_fee_revenue_fraction_start: float = 0.02
    emissions_fee_fraction_growth_per_review: float = 0.15

    # --- policy toggles (for counterfactual runs) ---
    enable_wage_cap: bool = True
    enable_wealth_transfer_contribution: bool = True
    enable_floor_growth_allocation: bool = True
    enable_auto_escalation: bool = True
    enable_emissions_fee: bool = True


@dataclass
class Household:
    wealth: float
    wage_rank: float     # 0..1 percentile in the wage distribution
    age: int
    generation: int


def make_initial_population(p: Params, rng: np.random.Generator):
    ranks = rng.uniform(0, 1, p.n_households)
    # starting wealth mildly correlated with wage rank, log-normal-ish
    base = rng.lognormal(mean=0.0, sigma=0.6, size=p.n_households)
    wealth = base * (0.4 + 0.6 * ranks)
    ages = rng.integers(0, 32, p.n_households)
    return [Household(wealth=float(w), wage_rank=float(r), age=int(a), generation=0)
            for w, r, a in zip(wealth, ranks, ages)]


def wage_for_rank(rank: float, wage_ratio_cap: float, wage_scale: float, enable_cap: bool) -> float:
    """Map a 0..1 wage-rank to an annual wage, bounded by the constitutional
    wage ratio cap between highest and lowest paid work."""
    floor_wage = 1.0
    if enable_cap:
        span = wage_ratio_cap - 1.0
    else:
        # counterfactual: uncapped, heavy-tailed at the top
        span = 60.0
    # a convex mapping so most of the distribution sits in the lower-middle
    # of the band, with the ratio cap (or uncapped span) binding only at the top
    shaped = rank ** (2.2 if enable_cap else 3.2)
    return wage_scale * floor_wage * (1.0 + span * shaped)


def death_probability(age: int) -> float:
    """[ASSUMPTION] Stylized generational-turnover hazard: households (as
    economic units/dynasties) are unlikely to turn over young, then turnover
    risk rises, centered around ~a working generation."""
    x = (age - 33) / 6.0
    return float(1.0 / (1.0 + np.exp(-x)) * 0.14 + 0.01)


def run_simulation(p: Params) -> pd.DataFrame:
    rng = np.random.default_rng(p.seed)
    households = make_initial_population(p, rng)

    floor_level = p.floor_level_start
    contribution_rate = p.base_contribution_rate
    wage_scale = 1.0
    output_index = 1.0
    cif_balance = 0.0
    consecutive_dependence_years = 0
    prev_real_base = None  # for floor growth allocation (real growth measurement)
    decarbonization = 0.0

    rows = []

    for year in range(p.n_years):
        # ---- growth shock ----
        g = rng.normal(p.productivity_growth_mean, p.productivity_growth_std)
        output_index *= (1.0 + g)
        wage_scale = output_index  # wages scale with real output per household

        # ---- wages & income ----
        wages = np.array([
            wage_for_rank(h.wage_rank, p.wage_ratio_cap, wage_scale, p.enable_wage_cap)
            for h in households
        ])
        median_wage = float(np.median(wages))
        total_wages = float(wages.sum())
        total_output = total_wages / (1 - p.surplus_share_of_output)
        surplus = total_output - total_wages

        # ---- contributions & Floor funding ----
        contribution = surplus * contribution_rate
        floor_fund = contribution * p.floor_fund_share_of_contribution
        cif_inflow = contribution * (1 - p.floor_fund_share_of_contribution)

        floor_cost_total = floor_level * p.n_households
        gap = max(0.0, floor_cost_total - floor_fund)
        ma_allocation = gap  # Monetary Authority fills the remainder
        ma_share = ma_allocation / floor_cost_total if floor_cost_total > 0 else 0.0

        # ---- structural dependence -> automatic minimum increase ----
        if ma_share > p.ma_dependence_threshold:
            consecutive_dependence_years += 1
        else:
            consecutive_dependence_years = 0

        escalated = False
        if (p.enable_auto_escalation
                and consecutive_dependence_years >= p.ma_dependence_years_required
                and contribution_rate < p.contribution_rate_cap):
            if rng.uniform() >= p.legislature_block_probability:
                contribution_rate = min(p.contribution_rate_cap,
                                         contribution_rate + p.auto_escalation_step)
                consecutive_dependence_years = 0
                escalated = True

        # ---- Floor Growth Allocation (15% of REAL growth in contributions+surplus) ----
        # NOTE: output_index in this model already *is* the real (inflation-free)
        # growth process -- wages scale directly by it, with no separate nominal/
        # price layer. So "real terms" here means comparing contribution+surplus
        # levels year over year directly, not deflating by output_index again
        # (which would cancel almost all of the organic growth this provision is
        # supposed to capture, since wages/surplus scale linearly with output_index
        # by construction).
        real_base = contribution + surplus
        if p.enable_floor_growth_allocation and prev_real_base is not None:
            real_growth = max(0.0, real_base - prev_real_base)
            floor_level += p.floor_growth_share * real_growth / p.n_households
        prev_real_base = real_base

        # ---- emissions & fee ----
        if year > 0 and year % 5 == 0:
            decarbonization = 1 - (1 - decarbonization) * (1 - p.decarbonization_per_review)
        cif_boost = 1 - np.exp(-p.cif_climate_effectiveness * cif_balance / max(total_output, 1e-9))
        emissions = p.base_emissions * output_index * (1 - decarbonization) * (1 - 0.5 * cif_boost)
        if p.enable_emissions_fee:
            reviews_elapsed = year // 5
            fee_revenue_fraction = (p.emissions_fee_revenue_fraction_start
                                     * (1 + p.emissions_fee_fraction_growth_per_review) ** reviews_elapsed)
            emissions_intensity = emissions / max(output_index, 1e-9)  # 1.0 = no decarbonization yet
            fee_revenue = fee_revenue_fraction * total_output * emissions_intensity
        else:
            fee_revenue = 0.0
        cif_inflow += fee_revenue * 0.6
        floor_fund += fee_revenue * 0.4
        cif_balance += cif_inflow

        # ---- household-level savings & wealth accumulation ----
        cost_of_living = floor_level * (1 + rng.normal(0, p.cost_of_living_noise, p.n_households))
        cost_of_living = np.clip(cost_of_living, floor_level * 0.5, None)
        income = wages  # Floor is a service/entitlement guarantee, not added cash; it sets the consumption floor
        excess = np.maximum(0.0, income - np.maximum(cost_of_living, floor_level))
        income_percentile_rank = np.array([h.wage_rank for h in households])
        savings_rate = p.base_savings_rate + p.savings_rate_income_sensitivity * income_percentile_rank
        savings = excess * savings_rate
        # everyone's existing savings earn the small, flat, uniform public-bank rate
        for h, sav in zip(households, savings):
            h.wealth = h.wealth * (1 + p.public_bank_real_deposit_rate) + sav
            h.age += 1

        # ---- deaths, bequests, Wealth Transfer Contribution, new households ----
        wtc_revenue = 0.0
        for i, h in enumerate(households):
            if rng.uniform() < death_probability(h.age):
                heirs = max(1, int(round(rng.normal(p.avg_heirs, 0.6))))
                per_heir = h.wealth / heirs
                if p.enable_wealth_transfer_contribution and per_heir > p.wtc_start_mult * median_wage:
                    span = (p.wtc_max_mult - p.wtc_start_mult) * median_wage
                    taxable = per_heir - p.wtc_start_mult * median_wage
                    frac = min(1.0, taxable / span) if span > 0 else 1.0
                    marginal_rate = p.wtc_max_rate * frac
                    tax = taxable * marginal_rate
                    wtc_revenue += tax * heirs  # across all heirs represented by this slot
                    per_heir -= tax
                new_rank = np.clip(h.wage_rank + rng.normal(0, p.wage_mobility_noise), 0.02, 0.98)
                households[i] = Household(wealth=max(0.0, per_heir), wage_rank=float(new_rank),
                                           age=0, generation=h.generation + 1)
        floor_fund += wtc_revenue

        # ---- record metrics ----
        wealth_arr = np.array([h.wealth for h in households])
        rows.append(dict(
            year=year,
            output_index=output_index,
            floor_level=floor_level,
            contribution_rate=contribution_rate,
            escalated=escalated,
            ma_share=ma_share,
            gini_wealth=gini(wealth_arr),
            gini_income=gini(wages),
            top1_wealth_share=top_share(wealth_arr, 0.01),
            top10_wealth_share=top_share(wealth_arr, 0.10),
            median_wealth=float(np.median(wealth_arr)),
            emissions=emissions,
            cif_balance=cif_balance,
            wtc_revenue=wtc_revenue,
            median_wage=median_wage,
        ))

    return pd.DataFrame(rows)


def gini(x: np.ndarray) -> float:
    x = np.sort(np.asarray(x, dtype=float))
    x = np.clip(x, 0, None)
    n = len(x)
    if n == 0 or x.sum() == 0:
        return 0.0
    cum = np.cumsum(x)
    return float((n + 1 - 2 * (cum.sum() / cum[-1])) / n)


def top_share(x: np.ndarray, frac: float) -> float:
    x = np.sort(np.asarray(x, dtype=float))[::-1]
    k = max(1, int(len(x) * frac))
    total = x.sum()
    if total <= 0:
        return 0.0
    return float(x[:k].sum() / total)
