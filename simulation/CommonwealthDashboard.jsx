import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// ============================================================
// Simulation core (ported from the validated Python model)
// ============================================================
function mulberry32(seed) {
  let s = seed;
  return function () {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gaussian(rand) {
  let u = 0, v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function gini(arr) {
  const x = [...arr].sort((a, b) => a - b).map((v) => Math.max(0, v));
  const n = x.length;
  const total = x.reduce((a, b) => a + b, 0);
  if (n === 0 || total === 0) return 0;
  let cum = 0, cumSum = 0;
  for (let i = 0; i < n; i++) { cum += x[i]; cumSum += cum; }
  return (n + 1 - 2 * (cumSum / cum)) / n;
}
function topShare(arr, frac) {
  const x = [...arr].sort((a, b) => b - a);
  const k = Math.max(1, Math.floor(x.length * frac));
  const total = x.reduce((a, b) => a + b, 0);
  if (total <= 0) return 0;
  let top = 0;
  for (let i = 0; i < k; i++) top += x[i];
  return top / total;
}
function wageForRank(rank, wageRatioCap, wageScale, enableCap) {
  const span = enableCap ? wageRatioCap - 1.0 : 60.0;
  const shaped = Math.pow(rank, enableCap ? 2.2 : 3.2);
  return wageScale * (1.0 + span * shaped);
}
function deathProbability(age) {
  const x = (age - 33) / 6.0;
  return (1.0 / (1.0 + Math.exp(-x))) * 0.14 + 0.01;
}

const FIXED = {
  nHouseholds: 700,
  nYears: 120,
  seed: 7,
  surplusShareOfOutput: 0.34,
  wageMobilityNoise: 0.06,
  costOfLivingNoise: 0.25,
  baseSavingsRate: 0.06,
  savingsRateIncomeSensitivity: 0.35,
  publicBankRealDepositRate: 0.003,
  floorLevelStart: 0.575,
  contributionRateCap: 0.60,
  floorFundShareOfContribution: 0.70,
  maDependenceYearsRequired: 3,
  autoEscalationStep: 0.03,
  wtcMaxRate: 0.55,
  avgHeirs: 1.9,
  baseEmissions: 1.0,
  decarbonizationPerReview: 0.12,
  cifClimateEffectiveness: 0.15,
  emissionsFeeRevenueFractionStart: 0.02,
  emissionsFeeFractionGrowthPerReview: 0.15,
};

function runSimulation(overrides) {
  const p = { ...FIXED, ...overrides };
  const rand = mulberry32(p.seed);

  let households = [];
  for (let i = 0; i < p.nHouseholds; i++) {
    const rank = rand();
    const base = Math.exp(gaussian(rand) * 0.6);
    households.push({ wealth: base * (0.4 + 0.6 * rank), wageRank: rank, age: Math.floor(rand() * 32) });
  }

  let floorLevel = p.floorLevelStart;
  let contributionRate = p.baseContributionRate;
  let outputIndex = 1.0;
  let cifBalance = 0.0;
  let consecutiveDependenceYears = 0;
  let prevRealBase = null;
  let decarbonization = 0.0;
  const rows = [];

  for (let year = 0; year < p.nYears; year++) {
    const g = p.productivityGrowthMean + gaussian(rand) * p.productivityGrowthStd;
    outputIndex *= 1 + g;
    const wageScale = outputIndex;

    const wages = households.map((h) => wageForRank(h.wageRank, p.wageRatioCap, wageScale, p.enableWageCap));
    const sortedWages = [...wages].sort((a, b) => a - b);
    const medianWage = sortedWages[Math.floor(sortedWages.length / 2)];
    const totalWages = wages.reduce((a, b) => a + b, 0);
    const totalOutput = totalWages / (1 - p.surplusShareOfOutput);
    const surplus = totalOutput - totalWages;

    const contribution = surplus * contributionRate;
    let floorFund = contribution * p.floorFundShareOfContribution;
    let cifInflow = contribution * (1 - p.floorFundShareOfContribution);

    const floorCostTotal = floorLevel * p.nHouseholds;
    const gap = Math.max(0, floorCostTotal - floorFund);
    const maShare = floorCostTotal > 0 ? gap / floorCostTotal : 0;

    if (maShare > p.maDependenceThreshold) consecutiveDependenceYears++;
    else consecutiveDependenceYears = 0;

    let escalated = false;
    if (p.enableAutoEscalation && consecutiveDependenceYears >= p.maDependenceYearsRequired
        && contributionRate < p.contributionRateCap) {
      contributionRate = Math.min(p.contributionRateCap, contributionRate + p.autoEscalationStep);
      consecutiveDependenceYears = 0;
      escalated = true;
    }

    const realBase = contribution + surplus;
    if (p.enableFloorGrowthAllocation && prevRealBase !== null) {
      const realGrowth = Math.max(0, realBase - prevRealBase);
      floorLevel += (p.floorGrowthShare * realGrowth) / p.nHouseholds;
    }
    prevRealBase = realBase;

    if (year > 0 && year % 5 === 0) {
      decarbonization = 1 - (1 - decarbonization) * (1 - p.decarbonizationPerReview);
    }
    const cifBoost = 1 - Math.exp((-p.cifClimateEffectiveness * cifBalance) / Math.max(totalOutput, 1e-9));
    const emissions = p.baseEmissions * outputIndex * (1 - decarbonization) * (1 - 0.5 * cifBoost);
    let feeRevenue = 0;
    if (p.enableEmissionsFee) {
      const reviewsElapsed = Math.floor(year / 5);
      const feeFrac = p.emissionsFeeRevenueFractionStart
        * Math.pow(1 + p.emissionsFeeFractionGrowthPerReview, reviewsElapsed);
      feeRevenue = feeFrac * totalOutput * (emissions / Math.max(outputIndex, 1e-9));
    }
    cifInflow += feeRevenue * 0.6;
    floorFund += feeRevenue * 0.4;
    cifBalance += cifInflow;

    for (let i = 0; i < p.nHouseholds; i++) {
      const h = households[i];
      const costOfLiving = Math.max(floorLevel * 0.5, floorLevel * (1 + gaussian(rand) * p.costOfLivingNoise));
      const savingsRate = p.baseSavingsRate + p.savingsRateIncomeSensitivity * h.wageRank;
      const excess = Math.max(0, wages[i] - Math.max(costOfLiving, floorLevel));
      h.wealth = h.wealth * (1 + p.publicBankRealDepositRate) + excess * savingsRate;
      h.age += 1;
    }

    let wtcRevenue = 0;
    for (let i = 0; i < p.nHouseholds; i++) {
      const h = households[i];
      if (rand() < deathProbability(h.age)) {
        const heirs = Math.max(1, Math.round(p.avgHeirs + gaussian(rand) * 0.6));
        let perHeir = h.wealth / heirs;
        if (p.enableWealthTransferContribution && perHeir > p.wtcStartMult * medianWage) {
          const span = (p.wtcMaxMult - p.wtcStartMult) * medianWage;
          const taxable = perHeir - p.wtcStartMult * medianWage;
          const frac = span > 0 ? Math.min(1, taxable / span) : 1;
          const tax = taxable * (p.wtcMaxRate * frac);
          wtcRevenue += tax * heirs;
          perHeir -= tax;
        }
        const newRank = Math.min(0.98, Math.max(0.02, h.wageRank + gaussian(rand) * p.wageMobilityNoise));
        households[i] = { wealth: Math.max(0, perHeir), wageRank: newRank, age: 0 };
      }
    }
    floorFund += wtcRevenue;

    const wealthArr = households.map((h) => h.wealth);
    rows.push({
      year, outputIndex, floorLevel, contributionRate, escalated, maShare,
      giniWealth: gini(wealthArr), top10: topShare(wealthArr, 0.10), top1: topShare(wealthArr, 0.01),
      emissions, medianWage,
    });
  }
  return rows;
}

// ============================================================
// Design tokens
// ============================================================
const C = {
  bg: "#16232B",
  panel: "#1D2E37",
  panelAlt: "#233842",
  hair: "rgba(233,228,216,0.14)",
  hairStrong: "rgba(233,228,216,0.26)",
  ink: "#E9E4D8",
  inkSub: "#A9A296",
  inkFaint: "#726C61",
  floor: "#C98A3E",
  commons: "#5FAB99",
  market: "#C4623F",
  warn: "#E0B84B",
};

const serif = "'Iowan Old Style','Source Serif 4',Georgia,serif";
const mono = "'IBM Plex Mono','SFMono-Regular',Menlo,monospace";
const sans = "'Inter',system-ui,sans-serif";

function fmt(n, digits = 2) {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
function pct(n, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`;
}

// ============================================================
// UI subcomponents
// ============================================================
function SectionLabel({ children, n }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 8, marginTop: 22, marginBottom: 10,
    }}>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.inkFaint }}>§{n}</span>
      <span style={{ fontFamily: sans, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.inkSub }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: C.hair }} />
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, display, note, disabled }) {
  return (
    <div style={{ marginBottom: 14, opacity: disabled ? 0.4 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{label}</span>
        <span style={{ fontFamily: mono, fontSize: 12.5, color: C.floor }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: C.floor, height: 4 }}
      />
      {note && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.inkFaint, marginTop: 3 }}>{note}</div>}
    </div>
  );
}

function Toggle({ label, checked, onChange, note }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 12, cursor: "pointer" }}>
      <input
        type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: C.commons, width: 14, height: 14, flexShrink: 0 }}
      />
      <div>
        <div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink }}>{label}</div>
        {note && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.inkFaint, marginTop: 1 }}>{note}</div>}
      </div>
    </label>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ padding: "10px 16px", borderRight: `1px solid ${C.hair}`, flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: sans, fontSize: 10.5, color: C.inkSub, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div style={{ fontFamily: mono, fontSize: 19, color: accent || C.ink, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.hair}`, borderRadius: 3, padding: "14px 16px 6px",
    }}>
      <div style={{ fontFamily: sans, fontSize: 12.5, color: C.ink, marginBottom: 1 }}>{title}</div>
      {subtitle && <div style={{ fontFamily: sans, fontSize: 10.5, color: C.inkFaint, marginBottom: 8 }}>{subtitle}</div>}
      {children}
    </div>
  );
}

const axisStyle = { fontFamily: mono, fontSize: 10, fill: C.inkFaint };
function commonAxisProps(dataKeyLabel) {
  return {
    dataKey: "year", tick: axisStyle, stroke: C.hairStrong, tickLine: false,
    label: { value: "year", position: "insideBottom", offset: -3, style: { ...axisStyle, fill: C.inkFaint } },
  };
}
function tooltipStyle() {
  return {
    contentStyle: { background: C.panelAlt, border: `1px solid ${C.hairStrong}`, borderRadius: 2, fontFamily: mono, fontSize: 11 },
    labelStyle: { color: C.inkSub },
    itemStyle: { color: C.ink },
  };
}

// ============================================================
// Main dashboard
// ============================================================
export default function CommonwealthDashboard() {
  const [productivityGrowthMean, setProductivityGrowthMean] = useState(0.015);
  const [wageRatioCap, setWageRatioCap] = useState(10);
  const [enableWageCap, setEnableWageCap] = useState(true);
  const [baseContributionRate, setBaseContributionRate] = useState(0.30);
  const [maDependenceThreshold, setMaDependenceThreshold] = useState(0.30);
  const [enableFloorGrowthAllocation, setEnableFloorGrowthAllocation] = useState(true);
  const [enableAutoEscalation, setEnableAutoEscalation] = useState(true);
  const [enableWealthTransferContribution, setEnableWealthTransferContribution] = useState(true);
  const [wtcStartMult, setWtcStartMult] = useState(5);
  const [wtcMaxMult, setWtcMaxMult] = useState(20);
  const [enableEmissionsFee, setEnableEmissionsFee] = useState(true);

  const liveParams = {
    productivityGrowthMean, productivityGrowthStd: 0.02,
    wageRatioCap, enableWageCap,
    baseContributionRate, maDependenceThreshold,
    floorGrowthShare: 0.15, enableFloorGrowthAllocation,
    enableAutoEscalation,
    enableWealthTransferContribution, wtcStartMult, wtcMaxMult,
    enableEmissionsFee,
  };

  const data = useMemo(() => runSimulation(liveParams), [
    productivityGrowthMean, wageRatioCap, enableWageCap, baseContributionRate,
    maDependenceThreshold, enableFloorGrowthAllocation, enableAutoEscalation,
    enableWealthTransferContribution, wtcStartMult, wtcMaxMult, enableEmissionsFee,
  ]);

  // Fixed, non-interactive reference: an unconstrained-market economy with
  // every anti-concentration / stabilizing mechanism switched off, same
  // seed, so the comparison isolates what the mechanisms do rather than
  // random noise differences.
  const reference = useMemo(() => runSimulation({
    productivityGrowthMean: 0.015, productivityGrowthStd: 0.02,
    wageRatioCap: 10, enableWageCap: false,
    baseContributionRate: 0.30, maDependenceThreshold: 0.30,
    floorGrowthShare: 0.15, enableFloorGrowthAllocation: false,
    enableAutoEscalation: false,
    enableWealthTransferContribution: false, wtcStartMult: 5, wtcMaxMult: 20,
    enableEmissionsFee: false,
  }), []);

  const merged = data.map((row, i) => ({
    ...row,
    refGini: reference[i].giniWealth,
    refTop10: reference[i].top10,
    refEmissions: reference[i].emissions,
  }));

  const last = data[data.length - 1];
  const escalationCount = data.filter((r) => r.escalated).length;

  return (
    <div style={{
      background: C.bg, color: C.ink, fontFamily: sans, padding: "22px 24px 28px",
      borderRadius: 6, maxWidth: 1080, margin: "0 auto",
    }}>
      <style>{`
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: ${C.floor}; cursor: pointer; }
        input[type="range"] { -webkit-appearance: none; background: ${C.hairStrong}; border-radius: 2px; }
        input[type="range"]::-moz-range-thumb { width: 13px; height: 13px; border-radius: 50%; background: ${C.floor}; border: none; cursor: pointer; }
      `}</style>

      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: serif, fontSize: 21, letterSpacing: "0.01em" }}>
          Commonwealth economic model
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: C.inkSub, marginTop: 2 }}>
          A 120-year, {FIXED.nHouseholds}-household simulation of the Constitution's economic articles. Tune the
          parameters below; charts update immediately against a fixed unconstrained-market reference.
        </div>
      </div>

      {/* instrument readout strip */}
      <div style={{
        display: "flex", flexWrap: "wrap", marginTop: 16, marginBottom: 6,
        background: C.panel, border: `1px solid ${C.hair}`, borderRadius: 3,
      }}>
        <Stat label="Year 120 output" value={`${fmt(last.outputIndex, 1)}×`} />
        <Stat label="Floor level" value={`${fmt(last.floorLevel, 2)}×`} accent={C.floor} />
        <Stat label="Contribution rate" value={pct(last.contributionRate)} />
        <Stat label="MA dependence" value={pct(last.maShare)} />
        <Stat label="Escalations" value={escalationCount} accent={escalationCount > 4 ? C.warn : C.ink} />
        <Stat label="Wealth gini" value={fmt(last.giniWealth, 3)} accent={C.commons} />
        <div style={{ padding: "10px 16px", flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: sans, fontSize: 10.5, color: C.inkSub, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            vs. market reference
          </div>
          <div style={{ fontFamily: mono, fontSize: 19, color: C.market, marginTop: 2 }}>
            {fmt(reference[reference.length - 1].giniWealth, 3)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22, marginTop: 18 }}>
        {/* parameter rail */}
        <div>
          <SectionLabel n="1">Growth</SectionLabel>
          <Slider
            label="Productivity growth" value={productivityGrowthMean} min={-0.005} max={0.025} step={0.001}
            display={pct(productivityGrowthMean, 1)} onChange={setProductivityGrowthMean}
            note="Not specified in the text — try lowering this to stress-test the automatic escalation mechanism."
          />

          <SectionLabel n="2">Wage structure</SectionLabel>
          <Toggle label="Enforce wage ratio cap" checked={enableWageCap} onChange={setEnableWageCap} />
          <Slider
            label="Wage ratio cap" value={wageRatioCap} min={2} max={20} step={1}
            display={`${wageRatioCap}×`} onChange={setWageRatioCap} disabled={!enableWageCap}
            note="Constitutional default: 10×"
          />

          <SectionLabel n="3">Floor &amp; contributions</SectionLabel>
          <Slider
            label="Base contribution rate" value={baseContributionRate} min={0.10} max={0.45} step={0.01}
            display={pct(baseContributionRate)} onChange={setBaseContributionRate}
            note="Not specified in the text — the Legislature sets this."
          />
          <Toggle
            label="Floor Growth Allocation" checked={enableFloorGrowthAllocation} onChange={setEnableFloorGrowthAllocation}
            note="15% of real growth expands the Floor (constitutional)."
          />
          <Toggle
            label="Automatic minimum increase" checked={enableAutoEscalation} onChange={setEnableAutoEscalation}
            note="Structural-dependence finding auto-raises contributions."
          />
          <Slider
            label="Dependence threshold" value={maDependenceThreshold} min={0.10} max={0.50} step={0.01}
            display={pct(maDependenceThreshold)} onChange={setMaDependenceThreshold} disabled={!enableAutoEscalation}
          />

          <SectionLabel n="4">Wealth transfer</SectionLabel>
          <Toggle
            label="Wealth Transfer Contribution" checked={enableWealthTransferContribution}
            onChange={setEnableWealthTransferContribution} note="Bequest tax above the phase-in threshold."
          />
          <Slider
            label="Phase-in start" value={wtcStartMult} min={2} max={10} step={1}
            display={`${wtcStartMult}× median wage`} onChange={setWtcStartMult}
            disabled={!enableWealthTransferContribution} note="Constitutional default: 5×"
          />
          <Slider
            label="Phase-in ceiling" value={wtcMaxMult} min={10} max={30} step={1}
            display={`${wtcMaxMult}× median wage`} onChange={setWtcMaxMult}
            disabled={!enableWealthTransferContribution} note="Constitutional default: 20×"
          />

          <SectionLabel n="5">Emissions</SectionLabel>
          <Toggle
            label="Emissions fee" checked={enableEmissionsFee} onChange={setEnableEmissionsFee}
            note="Priced against the climate mandate; revenue splits to the Commons Investment Fund and the Floor."
          />

          <div style={{ marginTop: 20, fontFamily: sans, fontSize: 10.5, color: C.inkFaint, lineHeight: 1.5 }}>
            Gold-accented figures are set directly by the constitutional text. Everything else is a calibration
            assumption exposed here for you to test.
          </div>
        </div>

        {/* charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <ChartCard title="Output vs. Floor level" subtitle="Index, year 0 = 1.0">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis tick={axisStyle} stroke={C.hairStrong} tickLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Line type="monotone" dataKey="outputIndex" name="Output" stroke={C.ink} dot={false} strokeWidth={1.6} />
                <Line type="monotone" dataKey="floorLevel" name="Floor level" stroke={C.floor} dot={false} strokeWidth={1.8} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Contribution rate" subtitle="Dots mark automatic escalations">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis domain={[0, 0.65]} tick={axisStyle} stroke={C.hairStrong} tickLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Line
                  type="stepAfter" dataKey="contributionRate" name="Rate" stroke={C.warn} strokeWidth={1.8}
                  dot={(props) => (props.payload.escalated
                    ? <circle key={props.key} cx={props.cx} cy={props.cy} r={3} fill={C.warn} stroke="none" />
                    : null)}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monetary Authority dependence" subtitle="Share of Floor cost funded by allocation, not contributions">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis tick={axisStyle} stroke={C.hairStrong} tickLine={false} tickFormatter={(v) => pct(v)} />
                <Tooltip {...tooltipStyle()} formatter={(v) => pct(v, 1)} />
                <ReferenceLine y={maDependenceThreshold} stroke={C.market} strokeDasharray="3 3" strokeWidth={1} />
                <Line type="monotone" dataKey="maShare" name="MA share" stroke={C.commons} dot={false} strokeWidth={1.6} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Wealth Gini coefficient" subtitle="Your scenario vs. unconstrained-market reference">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis domain={[0, 1]} tick={axisStyle} stroke={C.hairStrong} tickLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Line type="monotone" dataKey="giniWealth" name="Your scenario" stroke={C.commons} dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="refGini" name="Market reference" stroke={C.market} dot={false} strokeWidth={1.4} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top 10% wealth share" subtitle="Your scenario vs. unconstrained-market reference">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis tick={axisStyle} stroke={C.hairStrong} tickLine={false} tickFormatter={(v) => pct(v)} />
                <Tooltip {...tooltipStyle()} formatter={(v) => pct(v, 1)} />
                <Line type="monotone" dataKey="top10" name="Your scenario" stroke={C.commons} dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="refTop10" name="Market reference" stroke={C.market} dot={false} strokeWidth={1.4} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Emissions" subtitle="Your scenario vs. no-fee / no-mechanism reference">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={C.hair} vertical={false} />
                <XAxis {...commonAxisProps()} />
                <YAxis tick={axisStyle} stroke={C.hairStrong} tickLine={false} />
                <Tooltip {...tooltipStyle()} />
                <Line type="monotone" dataKey="emissions" name="Your scenario" stroke={C.commons} dot={false} strokeWidth={1.8} />
                <Line type="monotone" dataKey="refEmissions" name="Reference" stroke={C.market} dot={false} strokeWidth={1.4} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
