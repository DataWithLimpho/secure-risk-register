"use client";

import { useEffect, useState } from "react";

const initialRisks = [
  {
    id: "RSK-001",
    title: "Unauthorised access to customer data",
    category: "Cybersecurity",
    owner: "Security Team",
    likelihood: 4,
    impact: 5,
    score: 20,
    rating: "Critical",
    status: "Open",
  },
  {
    id: "RSK-002",
    title: "Cloud service disruption",
    category: "Operational",
    owner: "IT Operations",
    likelihood: 3,
    impact: 4,
    score: 12,
    rating: "High",
    status: "Mitigating",
  },
  {
    id: "RSK-003",
    title: "Third-party data breach",
    category: "Third Party",
    owner: "Risk Team",
    likelihood: 3,
    impact: 5,
    score: 15,
    rating: "High",
    status: "Open",
  },
  {
    id: "RSK-004",
    title: "Incomplete security training",
    category: "People",
    owner: "HR",
    likelihood: 2,
    impact: 3,
    score: 6,
    rating: "Medium",
    status: "Monitoring",
  },
];

export default function Home() {
  const [risks, setRisks] = useState(initialRisks);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

  useEffect(() => {
    async function loadRisks() {
      try {
        const response = await fetch("/api/risks");

      if (!response.ok) {
  throw new Error("Failed to load risks");
}

        const data = await response.json();

        const databaseRisks = data.map(
          (risk: {
            riskId: string;
            title: string;
            category: string;
            owner: string;
            likelihood: number;
            impact: number;
            score: number;
            rating: string;
            status: string;
          }) => ({
            id: risk.riskId,
            title: risk.title,
            category: risk.category,
            owner: risk.owner,
            likelihood: risk.likelihood,
            impact: risk.impact,
            score: risk.score,
            rating: risk.rating,
            status: risk.status,
          })
        );

        setRisks(databaseRisks);
      } catch (error) {
        console.error("Failed to load risks:", error);
      }
    }

    loadRisks();
  }, []);

  async function handleDeleteRisk(risk: Risk) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${risk.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/risks/${risk.id}`, {
        method: "DELETE",
      });

    if (!response.ok) {
  const errorData = await response.json();

  console.error("Delete API error:", errorData);

  throw new Error(
    errorData.details || errorData.error || "Failed to delete risk"
  );
}

      setRisks((currentRisks) =>
        currentRisks.filter((currentRisk) => currentRisk.id !== risk.id)
      );
    } catch (error) {
      console.error("Failed to delete risk:", error);
    }
  }

  const totalRisks = risks.length;

  const criticalRisks = risks.filter(
    (risk) => risk.rating === "Critical"
  ).length;

  const highRisks = risks.filter(
    (risk) => risk.rating === "High"
  ).length;

  const mediumRisks = risks.filter(
    (risk) => risk.rating === "Medium"
  ).length;

  const lowRisks = risks.filter(
    (risk) => risk.rating === "Low"
  ).length;

  const averageScore =
    totalRisks > 0
      ? (
          risks.reduce((total, risk) => total + risk.score, 0) / totalRisks
        ).toFixed(1)
      : "0.0";

  const percentage = (count: number) =>
    totalRisks > 0 ? (count / totalRisks) * 100 : 0;

  const filteredRisks = risks.filter((risk) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      risk.title.toLowerCase().includes(search) ||
      risk.id.toLowerCase().includes(search) ||
      risk.category.toLowerCase().includes(search) ||
      risk.owner.toLowerCase().includes(search) ||
      risk.status.toLowerCase().includes(search);

    const matchesRating =
      ratingFilter === "All" || risk.rating === ratingFilter;

    const matchesStatus =
      statusFilter === "All" || risk.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white lg:block">
          <div className="border-b border-slate-100 px-7 py-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                R
              </div>

              <div>
                <p className="font-semibold">RiskFlow</p>
                <p className="text-xs text-slate-400">Risk Management</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            <NavItem label="Overview" active />
            <NavItem label="Risk Register" />
            <NavItem label="Reports" />
            <NavItem label="Settings" />
          </nav>

          <div className="mx-4 mt-8 rounded-xl bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">
              Portfolio Project
            </p>
            <p className="mt-1 text-xs leading-5 text-indigo-600">
              Full-stack risk management application built with Next.js.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-5 lg:px-10">
              <div>
                <p className="text-sm text-slate-500">Risk Management</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Risk Register
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setShowAddRisk(true)}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                + Add Risk
              </button>
            </div>
          </header>

          <div className="px-6 py-8 lg:px-10">
            {/* Intro */}
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Risk overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and prioritise risks across the organisation.
              </p>
            </div>

            {/* Metrics */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total risks"
                value={String(totalRisks)}
                helper="Across all categories"
              />

              <MetricCard
                label="Critical risks"
                value={String(criticalRisks)}
                helper="Requires immediate attention"
              />

              <MetricCard
                label="High risks"
                value={String(highRisks)}
                helper="Active treatment required"
              />

              <MetricCard
                label="Average score"
                value={averageScore}
                helper="Based on likelihood × impact"
              />
            </section>

            {/* Risk summary */}
            <section className="mb-8 grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Risk exposure</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Current distribution by severity
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    Live overview
                  </span>
                </div>

                <div className="space-y-5">
                  <ExposureBar
                    label="Critical"
                    value={percentage(criticalRisks)}
                    count={criticalRisks}
                    barClass="bg-red-500"
                  />

                  <ExposureBar
                    label="High"
                    value={percentage(highRisks)}
                    count={highRisks}
                    barClass="bg-orange-500"
                  />

                  <ExposureBar
                    label="Medium"
                    value={percentage(mediumRisks)}
                    count={mediumRisks}
                    barClass="bg-amber-400"
                  />

                  <ExposureBar
                    label="Low"
                    value={percentage(lowRisks)}
                    count={lowRisks}
                    barClass="bg-emerald-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">
                <p className="text-sm font-medium text-indigo-100">
                  Overall exposure
                </p>

                <p className="mt-5 text-5xl font-bold">{averageScore}</p>
                <p className="mt-2 text-sm text-indigo-100">
                  Average inherent risk score
                </p>

                <div className="my-6 border-t border-indigo-500" />

                <p className="text-sm leading-6 text-indigo-100">
                  75% of recorded risks currently require active monitoring
                  or treatment.
                </p>
              </div>
            </section>

            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold">Organisation risks</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Review, assess and manage identified risks.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search risks..."
                    aria-label="Search risks"
                    className="w-52 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowFilters((current) => !current)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      showFilters
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Risk</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">L</th>
                      <th className="px-6 py-4">I</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-5">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRisks.map((risk) => (
                      <tr
                        key={risk.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <p className="font-medium text-slate-800">
                            {risk.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {risk.id}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {risk.category}
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {risk.owner}
                        </td>

                        <td className="px-6 py-5">{risk.likelihood}</td>
                        <td className="px-6 py-5">{risk.impact}</td>

                        <td className="px-6 py-5 font-semibold">
                          {risk.score}
                        </td>

                        <td className="px-6 py-5">
                          <RiskBadge rating={risk.rating} />
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {risk.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setEditingRisk(risk)}
                              className="font-medium text-indigo-600 transition hover:text-indigo-800"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteRisk(risk)}
                              className="font-medium text-red-600 transition hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="mt-8 text-center text-xs text-slate-400">
              RiskFlow • Secure Risk Register Portfolio Project
            </footer>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Rating
            </label>

            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All ratings</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Monitoring">Monitoring</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setRatingFilter("All");
              setStatusFilter("All");
              setSearchTerm("");
            }}
            className="self-end rounded-lg px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            Clear filters
          </button>
        </div>
      )}

      {showAddRisk && (
        <AddRiskModal
          onClose={() => setShowAddRisk(false)}
          onAdd={(risk) => {
            setRisks((current) => [...current, risk]);
            setShowAddRisk(false);
          }}
        />
      )}

      {editingRisk && (
        <EditRiskModal
          risk={editingRisk}
          onClose={() => setEditingRisk(null)}
          onUpdate={(updatedRisk) => {
            setRisks((currentRisks) =>
              currentRisks.map((risk) =>
                risk.id === updatedRisk.id ? updatedRisk : risk
              )
            );

            setEditingRisk(null);
          }}
        />
      )}
    </main>
  );
}

function NavItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

function ExposureBar({
  label,
  value,
  count,
  barClass,
}: {
  label: string;
  value: number;
  count: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-400">{count} risks</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ rating }: { rating: string }) {
  const styles: Record<string, string> = {
    Critical: "bg-red-50 text-red-700 ring-red-600/20",
    High: "bg-orange-50 text-orange-700 ring-orange-600/20",
    Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[rating] ?? "bg-slate-50 text-slate-600 ring-slate-500/20"
      }`}
    >
      {rating}
    </span>
  );
}

type Risk = {
  id: string;
  title: string;
  category: string;
  owner: string;
  likelihood: number;
  impact: number;
  score: number;
  rating: string;
  status: string;
};

function AddRiskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (risk: Risk) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cybersecurity");
  const [owner, setOwner] = useState("");
  const [likelihood, setLikelihood] = useState(1);
  const [impact, setImpact] = useState(1);

  const score = likelihood * impact;

  function getRating(score: number) {
    if (score >= 17) return "Critical";
    if (score >= 10) return "High";
    if (score >= 5) return "Medium";
    return "Low";
  }

  const rating = getRating(score);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !owner.trim()) {
      return;
    }

    try {
      const riskId = `RSK-${String(Date.now()).slice(-4)}`;

      const response = await fetch("/api/risks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          riskId,
          title: title.trim(),
          category,
          owner: owner.trim(),
          likelihood,
          impact,
          status: "Open",
        }),
      });

      if (response.ok) {
        const savedRisk = await response.json();
        onAdd({
          id: savedRisk.riskId,
          title: savedRisk.title,
          category: savedRisk.category,
          owner: savedRisk.owner,
          likelihood: savedRisk.likelihood,
          impact: savedRisk.impact,
          score: savedRisk.score,
          rating: savedRisk.rating,
          status: savedRisk.status,
        });
        return;
      }
    } catch (error) {
      console.warn("API create failed, falling back to local state:", error);
    }

    onAdd({
      id: `RSK-${String(Date.now()).slice(-4)}`,
      title: title.trim(),
      category,
      owner: owner.trim(),
      likelihood,
      impact,
      score,
      rating,
      status: "Open",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add new risk
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record and assess a new organisational risk.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Risk title
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Loss of customer data"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Cybersecurity</option>
                <option>Operational</option>
                <option>Third Party</option>
                <option>Financial</option>
                <option>Compliance</option>
                <option>People</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Risk owner
              </label>

              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="e.g. Security Team"
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ScoreSelect
              label="Likelihood"
              value={likelihood}
              onChange={setLikelihood}
            />

            <ScoreSelect
              label="Impact"
              value={impact}
              onChange={setImpact}
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Calculated risk score
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Likelihood × Impact
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{score}</p>
                <RiskBadge rating={rating} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Add risk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditRiskModal({
  risk,
  onClose,
  onUpdate,
}: {
  risk: Risk;
  onClose: () => void;
  onUpdate: (risk: Risk) => void;
}) {
  const [title, setTitle] = useState(risk.title);
  const [category, setCategory] = useState(risk.category);
  const [owner, setOwner] = useState(risk.owner);
  const [likelihood, setLikelihood] = useState(risk.likelihood);
  const [impact, setImpact] = useState(risk.impact);
  const [status, setStatus] = useState(risk.status);

  const score = likelihood * impact;

  function getRating(score: number) {
    if (score >= 17) return "Critical";
    if (score >= 10) return "High";
    if (score >= 5) return "Medium";
    return "Low";
  }

  const rating = getRating(score);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !owner.trim()) {
      return;
    }

    const updatedData: Risk = {
      id: risk.id,
      title: title.trim(),
      category,
      owner: owner.trim(),
      likelihood,
      impact,
      score,
      rating,
      status,
    };

    try {
      const response = await fetch(`/api/risks/${risk.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          owner: owner.trim(),
          likelihood,
          impact,
          status,
        }),
      });

      if (response.ok) {
        const updatedRisk = await response.json();
        onUpdate({
          id: updatedRisk.riskId || risk.id,
          title: updatedRisk.title,
          category: updatedRisk.category,
          owner: updatedRisk.owner,
          likelihood: updatedRisk.likelihood,
          impact: updatedRisk.impact,
          score: updatedRisk.score,
          rating: updatedRisk.rating,
          status: updatedRisk.status,
        });
        return;
      }
    } catch (error) {
      console.warn("API update failed, applying local update fallback:", error);
    }

    onUpdate(updatedData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit risk
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the risk assessment and current status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Risk title
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Cybersecurity</option>
                <option>Operational</option>
                <option>Third Party</option>
                <option>Financial</option>
                <option>Compliance</option>
                <option>People</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Risk owner
              </label>

              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ScoreSelect
              label="Likelihood"
              value={likelihood}
              onChange={setLikelihood}
            />

            <ScoreSelect
              label="Impact"
              value={impact}
              onChange={setImpact}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option>Open</option>
              <option>Mitigating</option>
              <option>Monitoring</option>
            </select>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Calculated risk score
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Likelihood × Impact
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {score}
                </p>

                <RiskBadge rating={rating} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ScoreSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value={1}>1 — Rare</option>
        <option value={2}>2 — Unlikely</option>
        <option value={3}>3 — Possible</option>
        <option value={4}>4 — Likely</option>
        <option value={5}>5 — Almost certain</option>
      </select>
    </div>
  );
}