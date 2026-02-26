import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useObservabilityHeader } from "../context/ObservabilityHeaderContext";
import "./ObservabilityHeader.css";
import logo from "../assets/hdfc.png";

/* -------------------- OBSERVABILITY HEADER -------------------- */

export default function ObservabilityHeader() {
  const { selectedTab, setSelectedTab, timeFilter, setTimeFilter } =
    useObservabilityHeader();
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const NAV_TABS = [
    { label: "Overview", route: "/observability" },
    { label: "Journeys", route: "/observability/journeys" },
    { label: "Services", route: "/observability/services" },
    { label: "API Explorer", route: "/observability/api-explorer" },
    { label: "Alerts", route: "/observability/alerts" },
  ];

  const TIME_FILTER_OPTIONS = ["Last 1h", "Last 24h", "Last 7d", "Select Custom Range"];

  const handleTabClick = (tab) => {
    setSelectedTab(tab.label);
    navigate(tab.route);
  };

  const handleTimeFilterChange = (option) => {
    setTimeFilter(option);
    setIsTimeFilterOpen(false);
  };

  return (
    <header className="obsHeader">
      <div className="obsHeaderInner">
        
        {/* -------------------- BRANDING -------------------- */}
          <div className="obsBrand">
            <div className="obsBrandTopRow">
              <img 
                src={logo} 
                alt="HDFC Logo" 
                style={{ height: "29px", width: "auto", objectFit: "contain" }} 
              />
            <div className="obsBrandText">
                <div className="obsBrandName">HDFC BANK</div>
            </div>      
            </div>
            <div className="obsBrandTag">We understand your world</div>
          </div>
        

        {/* -------------------- NAV TABS -------------------- */}
        <div className="obsNavWrapper">
            <nav className="obsNav">
              {NAV_TABS.map((tab) => (
                <button
                    key={tab.label}
                    className={`obsNavTab ${
                        selectedTab === tab.label ? "active" : ""
                    }`}
                    onClick={() => handleTabClick(tab)}
                    aria-current={selectedTab === tab.label ? "page" : undefined}
                    type="button"
                >
                    {tab.label}
                </button>
            ))}
            </nav>
        </div>

        {/* -------------------- RIGHT SECTION: LIVE + TIME FILTER -------------------- */}
        <div className="obsHeaderRight">
          {/* Live Indicator */}
          <div className="obsLiveIndicator" aria-label="System is live">
            <span className="obsLiveDot"></span>
            <span className="obsLiveLabel">Live</span>
          </div>

          {/* Time Filter Dropdown */}
          <div className="obsTimeFilterWrapper">
            <button
              className="obsTimeFilterBtn"
              onClick={() => setIsTimeFilterOpen(!isTimeFilterOpen)}
              aria-label="Open time filter"
              aria-expanded={isTimeFilterOpen}
              type="button"
            >
              <span className="obsTimeFilterIcon">
                <SvgClock />
              </span>
              <span className="obsTimeFilterLabel">{timeFilter}</span>
              <span className="obsTimeFilterChevron">
                <SvgChevronDown />
              </span>
            </button>

            {isTimeFilterOpen && (
              <div className="obsTimeFilterDropdown">
                {TIME_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    className={`obsTimeFilterOption ${
                      timeFilter === option ? "selected" : ""
                    }`}
                    onClick={() => handleTimeFilterChange(option)}
                    type="button"
                  >
                    {option}
                    {timeFilter === option && (
                      <span className="obsCheckmark">
                        <SvgCheckmark />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------- SVG ICONS -------------------- */

function SvgHDFCBadge() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="2" fill="white" />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="14" fontWeight="bold" fill="#003DA5">
        ⊞
      </text>
    </svg>
  );
}

function SvgClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 6v6l4 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCheckmark() {
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