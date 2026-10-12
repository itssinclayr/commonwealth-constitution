import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from commonwealth_sim import Params, run_simulation

plt.rcParams.update({"figure.dpi": 130, "font.size": 9})

# --- Scenario A: the Constitution as drafted ---
p_constitution = Params(seed=7)
df_const = run_simulation(p_constitution)

# --- Scenario B: counterfactual -- same starting economy, none of the
#     anti-concentration / anti-domination mechanisms active. This isolates
#     what those provisions are actually doing.
p_market = Params(
    seed=7,
    enable_wage_cap=False,
    enable_wealth_transfer_contribution=False,
    enable_floor_growth_allocation=False,
    enable_auto_escalation=False,
    enable_emissions_fee=False,
)
df_market = run_simulation(p_market)

# --- Scenario C: the Constitution, but stress-tested with a recession shock
#     (a multi-year negative productivity shock starting year 40) to see
#     whether the automatic-escalation machinery holds up under strain.
class StressParams(Params):
    pass

p_stress = Params(seed=7)
def run_stress(p: Params):
    # monkey-patch a recession into the growth process by temporarily
    # lowering productivity_growth_mean for a 6-year window
    import commonwealth_sim as cs
    rng_state_seed = p.seed
    p2 = Params(**{**p.__dict__})
    # simplest robust approach: re-implement growth loop isn't necessary --
    # instead run two sub-simulations and splice, OR just lower the mean for
    # the whole run to proxy a lower-growth-regime the auto-escalation must
    # cope with. We do the latter for simplicity/robustness.
    p2.productivity_growth_mean = 0.004
    p2.productivity_growth_std = 0.035
    return run_simulation(p2)

df_stress = run_stress(p_stress)

# ============================================================
# Plot 1: Macro trajectory -- output, Floor level, contribution rate, MA share
# ============================================================
fig, axes = plt.subplots(2, 2, figsize=(11, 7))

axes[0, 0].plot(df_const.year, df_const.output_index, label="Output index")
axes[0, 0].plot(df_const.year, df_const.floor_level, label="Floor level")
axes[0, 0].set_title("Output growth vs. Floor level (Constitution)")
axes[0, 0].set_xlabel("Year")
axes[0, 0].legend()

axes[0, 1].plot(df_const.year, df_const.contribution_rate, label="Contribution rate", color="tab:red")
ax2 = axes[0, 1].twinx()
ax2.plot(df_const.year, df_const.ma_share, label="Monetary Authority share of Floor cost",
         color="tab:blue", alpha=0.6)
esc_years = df_const[df_const.escalated].year
axes[0, 1].scatter(esc_years, df_const[df_const.escalated].contribution_rate,
                    color="black", zorder=5, s=18, label="Auto-escalation triggered")
axes[0, 1].axhline(p_constitution.contribution_rate_cap, color="red", ls=":", lw=0.8)
axes[0, 1].set_title("Contribution rate & MA dependence over time")
axes[0, 1].set_xlabel("Year")
lines1, labels1 = axes[0, 1].get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
axes[0, 1].legend(lines1 + lines2, labels1 + labels2, fontsize=7, loc="upper left")

axes[1, 0].plot(df_const.year, df_const.gini_wealth, label="Constitution", color="tab:green")
axes[1, 0].plot(df_market.year, df_market.gini_wealth, label="Market counterfactual", color="tab:orange")
axes[1, 0].set_title("Wealth Gini coefficient over time")
axes[1, 0].set_xlabel("Year")
axes[1, 0].set_ylim(0, 1)
axes[1, 0].legend(fontsize=8)

axes[1, 1].plot(df_const.year, df_const.top10_wealth_share, label="Top 10% (Constitution)", color="tab:green")
axes[1, 1].plot(df_market.year, df_market.top10_wealth_share, label="Top 10% (Market)", color="tab:orange")
axes[1, 1].plot(df_const.year, df_const.top1_wealth_share, label="Top 1% (Constitution)",
                 color="tab:green", ls="--")
axes[1, 1].plot(df_market.year, df_market.top1_wealth_share, label="Top 1% (Market)",
                 color="tab:orange", ls="--")
axes[1, 1].set_title("Wealth concentration over time")
axes[1, 1].set_xlabel("Year")
axes[1, 1].legend(fontsize=7)

fig.tight_layout()
fig.savefig("plot_macro_and_inequality.png")

# ============================================================
# Plot 2: Stress test -- does auto-escalation hold under a low-growth regime?
# ============================================================
fig2, axes2 = plt.subplots(1, 2, figsize=(11, 4))
axes2[0].plot(df_const.year, df_const.ma_share, label="Baseline growth", color="tab:blue")
axes2[0].plot(df_stress.year, df_stress.ma_share, label="Low-growth stress test", color="tab:red")
axes2[0].axhline(p_constitution.ma_dependence_threshold, color="black", ls=":", lw=0.8,
                  label="Structural dependence threshold")
axes2[0].set_title("Monetary Authority share of Floor funding")
axes2[0].set_xlabel("Year")
axes2[0].legend(fontsize=7)

axes2[1].plot(df_const.year, df_const.contribution_rate, label="Baseline growth", color="tab:blue")
axes2[1].plot(df_stress.year, df_stress.contribution_rate, label="Low-growth stress test", color="tab:red")
axes2[1].set_title("Contribution rate response")
axes2[1].set_xlabel("Year")
axes2[1].legend(fontsize=7)

fig2.tight_layout()
fig2.savefig("plot_stress_test.png")

# ============================================================
# Plot 3: Emissions
# ============================================================
fig3, ax3 = plt.subplots(figsize=(6, 4))
p_no_fee = Params(seed=7, enable_emissions_fee=False)
df_no_fee = run_simulation(p_no_fee)
ax3.plot(df_const.year, df_const.emissions, label="With emissions fee")
ax3.plot(df_no_fee.year, df_no_fee.emissions, label="Without emissions fee")
ax3.set_title("Emissions trajectory")
ax3.set_xlabel("Year")
ax3.legend(fontsize=8)
fig3.tight_layout()
fig3.savefig("plot_emissions.png")

# ============================================================
# Print summary stats
# ============================================================
print("=== Year 0 vs Year 119, Constitution scenario ===")
print(df_const.iloc[[0, -1]][["output_index", "floor_level", "contribution_rate",
                                "gini_wealth", "top10_wealth_share", "top1_wealth_share",
                                "emissions"]].to_string(index=False))
print()
print("=== Year 119: Constitution vs Market counterfactual ===")
compare = df_const.iloc[-1][["gini_wealth", "top10_wealth_share", "top1_wealth_share"]].rename("constitution")
compare2 = df_market.iloc[-1][["gini_wealth", "top10_wealth_share", "top1_wealth_share"]].rename("market")
print(compare.to_frame().join(compare2.to_frame()))
print()
print("Number of auto-escalations triggered (baseline growth):", df_const.escalated.sum())
print("Number of auto-escalations triggered (low-growth stress):", df_stress.escalated.sum())
print("Final contribution rate (baseline growth):", round(df_const.contribution_rate.iloc[-1], 3))
print("Final contribution rate (low-growth stress):", round(df_stress.contribution_rate.iloc[-1], 3))
