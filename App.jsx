import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { fetchDashboard } from "./api/dashboardApi";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useTimeFilter } from "./hooks/useTimeFilter";
import ObservabilityHeader from "./components/ObservabilityHeader";
import { ObservabilityHeaderProvider } from "./context/ObservabilityHeaderContext.jsx";  // ← ADD THIS
import GoldLoanPage from "./pages/GoldLoanPage";
import "./App.css";

/* -------------------- HELPERS -------------------- */

const toneFromStatus = (status) => {
  if (status === "Stable") return "green";
  if (status === "Degraded") return "amber";
  return "red";
};

const toPct = (v) => {
  if (typeof v === "number") return v;
  return Number(String(v).replace("%", "").trim() || 0);
};

const successToneFromPct = (p) => {
  if (p > 75) return "green";
  if (p >= 50) return "amber";
  return "red";
};

const failureToneFromPct = (p) => {
  if (p > 60) return "red";
  if (p >= 40) return "amber";
  return "green";
};

const DEFAULT_ITEM_BY_CATEGORY = {
  ASSETS: "Gold Loan",
  CARDS: "Forex Card",
  LIABILITIES: "Savings Account",
  "THIRD PARTY": "Insurance Buy",
};

/* -------------------- ROUTES ROOT -------------------- */

export default function App() {
  return (
    <ObservabilityHeaderProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/observability" element={<Dashboard />} />
        <Route path="/observability/*" element={<Dashboard />} />
        <Route path="/gold-loan" element={<GoldLoanPage />} />
      </Routes>
    </ObservabilityHeaderProvider>
  );
}

/* -------------------- DASHBOARD -------------------- */

function Dashboard() {
  const { timeFilter } = useTimeFilter();
  
  // ✅ AC1: Auto-refresh with time filter support
  const { data, loading, error, lastRefreshTime } = useAutoRefresh(
    fetchDashboard,
    300000, // 5 mins in milliseconds
    [timeFilter] // Re-fetch when time filter changes
  );

  const [openSections, setOpenSections] = useState({});

  // No longer need the manual useEffect with setInterval!
  // useAutoRefresh handles all of that

  const sections = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // ✅ when new sections appear, default them to CLOSED
  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      sections.forEach((s) => {
        const key = s.category || "UNKNOWN";
        if (next[key] === undefined) next[key] = false;
      });
      return next;
    });
  }, [sections]);

  const allItems = useMemo(
    () => sections.flatMap((s) => (Array.isArray(s.items) ? s.items : [])),
    [sections]
  );

  const stable = allItems.filter((x) => x.status === "Stable").length;
  const degraded = allItems.filter((x) => x.status === "Degraded").length;
  const critical = allItems.filter((x) => x.status === "Critical").length;

  return (
    <div className="appRoot">
      <ObservabilityHeader />

      <main className="content">
        {loading && <div className="loading">Loading dashboard...</div>}
        {!loading && error && <div className="loading error">{error}</div>}

        {!loading && !error && (
          <>
            {/* ✅ AC1: Show last refresh timestamp */}
            {lastRefreshTime && (
              <div className="refreshInfo">
                Last updated: {lastRefreshTime.toLocaleTimeString()}
              </div>
            )}

            <div className="headerRow">
              <div className="titles">
                <h1 className="pageTitle">Journey Health Overview</h1>
                <div className="pageSubtitle">
                  Technical Operations Intelligence View
                </div>
              </div>

              <div className="summaryRow">
                <SummaryCard
                  tone="green"
                  title="Stable Journeys"
                  value={stable}
                  sub="Across All Regions"
                  icon="check"
                />
                <SummaryCard
                  tone="amber"
                  title="Degraded Journeys"
                  value={degraded}
                  sub="Investigation Active"
                  icon="warn"
                />
                <SummaryCard
                  tone="red"
                  title="Critical Journeys"
                  value={critical}
                  sub="SLA Breached"
                  icon="x"
                />
              </div>
            </div>

            <div className="sectionGrid">
              {sections.map((section, idx) => {
                const key = section.category || String(idx);
                const isOpen = openSections[key] ?? false;

                const items = Array.isArray(section.items) ? section.items : [];
                const catKey = String(section.category || "")
                  .trim()
                  .toUpperCase();

                const preferredName = DEFAULT_ITEM_BY_CATEGORY[catKey];
                const defaultItem =
                  (preferredName &&
                    items.find((x) => x?.name === preferredName)) ||
                  items[0] ||
                  null;

                const extraItems = defaultItem
                  ? items.filter((x) => x !== defaultItem)
                  : items;

                const showHealthyBadge =
                  section.category?.toUpperCase().includes("LIABILITIES") ||
                  section.category?.toUpperCase().includes("THIRD PARTY");

                return (
                  <SectionCard
                    key={key}
                    title={section.category}
                    count={items.length}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenSections((prev) => ({
                        ...prev,
                        [key]: !(prev[key] ?? false),
                      }))
                    }
                  >
                    <div className="journeyStack">
                      {defaultItem && (
                        <JourneyTile
                          item={defaultItem}
                          showHealthyBadge={showHealthyBadge}
                        />
                      )}

                      {isOpen &&
                        extraItems.map((item, i) => (
                          <JourneyTile
                            key={i}
                            item={item}
                            showHealthyBadge={showHealthyBadge}
                          />
                        ))}
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* -------------------- SUMMARY -------------------- */

function SummaryCard({ tone, title, value, sub, icon }) {
  return (
    <div className={`summaryCard tone-${tone}`}>
      <div className="summaryTop">
        <div className="summaryTitle">{title}</div>
        <div className={`summaryIconBox icon-${tone}`} aria-hidden>
          {icon === "check" ? (
            <SvgCheck />
          ) : icon === "warn" ? (
            <SvgWarn />
          ) : (
            <SvgX />
          )}
        </div>
      </div>

      <div className="summaryValue">{value}</div>
      <div className="summarySub">{sub}</div>
    </div>
  );
}

/* -------------------- SECTION (SHOW DEFAULT + DROPDOWN) -------------------- */

function SectionCard({ title, count, isOpen, onToggle, children }) {
  return (
    <section className="sectionCard">
      <div className="sectionHead">
        <div className="sectionTitleRow">
          <div className="sectionTitle">{title}</div>
          <span className="countBadge">{count}</span>
        </div>

        <button
          className={`chevBtn ${isOpen ? "open" : ""}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Show less" : "Show more"}
          title={isOpen ? "Show less" : "Show more"}
        >
          <span className="chevIcon" aria-hidden>
            <SvgChevron />
          </span>
        </button>
      </div>

      <div className="sectionBody">{children}</div>
    </section>
  );
}

/* -------------------- JOURNEY TILE -------------------- */

function JourneyTile({ item, showHealthyBadge }) {
  const navigate = useNavigate();
  const tone = toneFromStatus(item?.status);

  const volume =
    typeof item?.volume === "number" ? item.volume : Number(item?.volume || 0);
  const successP = toPct(item?.success);
  const abandonedP = toPct(item?.abandoned);
  const failureP = toPct(item?.failure);

  const successTone = successToneFromPct(successP);
  const failureTone = failureToneFromPct(failureP);

  const routeMap = {
    "Gold Loan": "/gold-loan",
  };

  const handleOpen = () => {
    const to = routeMap[item?.name];
    if (to) navigate(to);
    else alert(`No page created for: ${item?.name}`);
  };

  if (!item) return null;

  return (
    <div className={`journeyTile tone-${tone}`}>
      <div className="journeyHead">
        <div className="journeyIcon" aria-hidden>
          <SvgStack />
        </div>

        <div className="journeyNameWrap">
          <div className={`journeyName t-${tone}`}>{item.name}</div>
          <div className="journeyMeta">
            {(item.subtype || item.type || item.group || "ASSETS").toUpperCase()}
          </div>
        </div>

        {showHealthyBadge && tone === "green" && (
          <div className="healthyBadge">HEALTHY</div>
        )}

        <button
          className="goBtn"
          type="button"
          aria-label="Open journey"
          onClick={handleOpen}
        >
          <SvgArrow />
        </button>
      </div>

      <div className="journeyMetrics">
        <div className="m">
          <div className="mLabel">SESSION VOL</div>
          <div className="mValue">{volume.toLocaleString()}</div>
        </div>

        <div className="m">
          <div className="mLabel">SUCCESS RATE</div>
          <div className={`mValue c-${successTone}`}>{successP}%</div>
        </div>

        <div className="m">
          <div className="mLabel">ABANDON RATE</div>
          <div className="mValue">{abandonedP}%</div>
        </div>
      </div>

      <div className="journeyDivider" />

      <div className="journeyFoot">
        <div className="failBlock">
          <div className="mLabel">FAIL RATIO</div>
          <div className={`failValue c-${failureTone}`}>{failureP}%</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- SVGs -------------------- */

function SvgArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgWarn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.2h3.4L22 20H2l8.3-15.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgStack() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 3 7l9 5 9-5-9-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 5 9-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 17l9 5 9-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}