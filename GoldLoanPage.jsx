import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // reuse your App.css

export default function GoldLoanPage() {
  const navigate = useNavigate();

  // demo data (replace later with API)
  const kpis = useMemo(
    () => [
      { label: "Session Vol", value: "4,000" },
      { label: "Success Rate", value: "82%", tone: "green" },
      { label: "Abandon Rate", value: "10%" },
      { label: "Fail Ratio", value: "8%", tone: "green" },
    ],
    []
  );

  const alerts = [
    { time: "10:20", msg: "Latency spike detected in OTP service", tone: "amber" },
    { time: "09:45", msg: "Partner callback retry count increased", tone: "amber" },
    { time: "08:30", msg: "All systems normal", tone: "green" },
  ];

  const tableRows = [
    { stage: "Landing → KYC", success: "91%", fail: "3%", abandon: "6%" },
    { stage: "KYC → Eligibility", success: "84%", fail: "7%", abandon: "9%" },
    { stage: "Eligibility → Offer", success: "79%", fail: "10%", abandon: "11%" },
    { stage: "Offer → Disbursal", success: "88%", fail: "6%", abandon: "6%" },
  ];

  return (
    <div className="appRoot">
      <TopNav />

      <main className="content">
        {/* header */}
        <div className="detailHeaderRow">
          <div className="detailLeft">
            <button className="backBtn" type="button" onClick={() => navigate("/")}>
              ← Back
            </button>

            <div className="titles">
              <h1 className="pageTitle">Gold Loan</h1>
              <div className="pageSubtitle">Journey Detail View (Demo)</div>
            </div>
          </div>

          <div className="detailRight">
            <span className="pillStatus pill-green">STABLE</span>
            <button className="primaryBtn" type="button">
              Create Incident
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="kpiGrid">
          {kpis.map((k, i) => (
            <div key={i} className="kpiCard">
              <div className="kpiLabel">{k.label}</div>
              <div className={`kpiValue ${k.tone ? `c-${k.tone}` : ""}`}>{k.value}</div>
              <div className="kpiHint">Last 15 mins</div>
            </div>
          ))}
        </div>

        {/* 2-column grid */}
        <div className="detailGrid">
          {/* left column */}
          <section className="sectionCard">
            <div className="sectionHead">
              <div className="sectionTitleRow">
                <div className="sectionTitle">Throughput Trend</div>
              </div>
            </div>

            <div className="sectionBody">
              <div className="chartPlaceholder">
                <div className="chartTitle">Demo Chart Placeholder</div>
                <div className="chartSub">You can add Recharts / charts later</div>
              </div>
            </div>
          </section>

          {/* right column */}
          <section className="sectionCard">
            <div className="sectionHead">
              <div className="sectionTitleRow">
                <div className="sectionTitle">Recent Alerts</div>
                <span className="countBadge">{alerts.length}</span>
              </div>
            </div>

            <div className="sectionBody">
              <div className="alertList">
                {alerts.map((a, idx) => (
                  <div key={idx} className="alertRow">
                    <div className="alertTime">{a.time}</div>
                    <div className="alertMsg">{a.msg}</div>
                    <span className={`alertTone tone-${a.tone}`}>{a.tone.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* full width table */}
          <section className="sectionCard detailSpan2">
            <div className="sectionHead">
              <div className="sectionTitleRow">
                <div className="sectionTitle">Stage-wise Breakdown</div>
              </div>
            </div>

            <div className="sectionBody">
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Success</th>
                      <th>Fail</th>
                      <th>Abandon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r, i) => (
                      <tr key={i}>
                        <td className="stageCell">{r.stage}</td>
                        <td className="c-green">{r.success}</td>
                        <td className="c-red">{r.fail}</td>
                        <td>{r.abandon}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="noteBox">
                <div className="noteTitle">Notes</div>
                <div className="noteText">
                  This is a demo page. Replace the placeholders with real Gold Loan journey
                  widgets, charts, APIs, and drilldowns.
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* keep your existing TopNav component exactly like in App.jsx */
function TopNav() {
  return (
    <header className="nav">
      <div className="navInner">
        <div className="brand">
          <img className="brandLogo" src="/hdfc-logo.png" alt="HDFC Bank" />
          <div className="brandText">
            <p className="brandTag">We understand your world</p>
          </div>
        </div>

        <nav className="navLinks" aria-label="Primary">
          <a className="navLink active" href="#">
            Dashboard
          </a>
          <a className="navLink" href="#">
            Settings
          </a>
        </nav>

        <div className="navRight">
          <button className="iconBtn" aria-label="Theme" type="button">
            ☾
          </button>
          <button className="iconBtn" aria-label="Notifications" type="button">
            🔔
          </button>

          <div className="profilePill">
            <div className="avatar" aria-hidden>
              A
            </div>
            <div className="profileText">
              <div className="profileName">Bastab</div>
              <div className="profileRole">OPS DIRECTOR</div>
            </div>
          </div>

          <button className="iconBtn" aria-label="Logout" type="button">
            ⎋
          </button>
        </div>
      </div>
    </header>
  );
}