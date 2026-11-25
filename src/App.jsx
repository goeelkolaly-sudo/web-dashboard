import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  Car,
  ParkingSquare,
  Lightbulb,
  Sprout,
  Trash2,
  Wind,
  Sun,
  Cpu,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Zap,
  Activity,
  DoorOpen,
  Siren,
  BarChart3,
  MapPin,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import LoginScreen from './components/LoginScreen';
import {
  NAV_ITEMS,
  INITIAL_TELEMETRY,
  ZONES_GUIDE_DETAILS,
} from './smartCityData';

const ICONS = {
  dashboard: LayoutDashboard,
  'smart-homes': Home,
  'smart-traffic': Car,
  parking: ParkingSquare,
  'street-lighting': Lightbulb,
  'smart-irrigation': Sprout,
  'waste-management': Trash2,
  'air-quality': Wind,
  'solar-energy': Sun,
  'control-center': Cpu,
  settings: Settings,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('neom_admin_auth') === 'true'
  );
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        temperature: Math.min(
          38,
          Math.max(22, Number((prev.temperature + (Math.random() - 0.5) * 0.6).toFixed(1)))
        ),
        trafficFlow: Math.min(
          99,
          Math.max(65, prev.trafficFlow + (Math.random() > 0.5 ? 1 : -1))
        ),
        wasteLevel: Math.min(
          95,
          Math.max(40, prev.wasteLevel + (Math.random() > 0.7 ? 1 : 0))
        ),
      }));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('neom_admin_auth');
    setIsAuthenticated(false);
  };

  const handleQuickAction = (type) => {
    if (type === 'gate') {
      const next = !telemetry.gateOpen;
      setTelemetry((prev) => ({ ...prev, gateOpen: next }));
      showNotice(next ? 'Gate Opened' : 'Gate Closed');
    } else if (type === 'parking') {
      const next = !telemetry.parkingReserved;
      setTelemetry((prev) => ({ ...prev, parkingReserved: next }));
      showNotice(next ? 'Parking Updated' : 'Parking Released');
    } else if (type === 'alert') {
      const next = !telemetry.emergencyMode;
      setTelemetry((prev) => ({ ...prev, emergencyMode: next }));
      showNotice(next ? 'Emergency Alert Sent' : 'Emergency Cleared');
    } else if (type === 'reports') {
      setActiveTab('control-center');
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const filteredNav = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#04141c] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#061c27] border-r border-cyan-500/20 flex flex-col justify-between p-3.5">
        <div>
          <div className="px-2 mb-5">
            <div className="text-base font-extrabold tracking-wider text-white">
              NEOM CITY
            </div>
            <div className="text-[11px] text-cyan-300/80">Smart City</div>
          </div>

          <nav className="space-y-1">
            {filteredNav.map((item) => {
              const Icon = ICONS[item.id] || LayoutDashboard;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/35'
                      : 'text-slate-300 hover:bg-cyan-500/10 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer mt-4"
        >
          <LogOut className="w-4 h-4 text-cyan-400" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="px-6 py-3.5 border-b border-cyan-500/15 bg-[#051822] flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-cyan-300/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#082433] border border-cyan-500/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showNotice(`${telemetry.alerts.length} Active Alerts`)}
              className="relative p-2 rounded-xl bg-[#082433] border border-cyan-500/20 text-cyan-200 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="-top-1 -right-1 absolute w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {telemetry.alerts.length}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#082433] border border-cyan-500/25 text-xs font-semibold text-white cursor-pointer"
            >
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-[#04141c] font-bold flex items-center justify-center">
                A
              </span>
              <span>Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>
        </header>

        {notice && (
          <div className="mx-6 mt-3 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/35 text-xs text-cyan-200">
            {notice}
          </div>
        )}

        <main className="p-6 space-y-5 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {activeTab === 'dashboard'
                  ? 'NEOM City Dashboard'
                  : NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-cyan-200/70">
                City Overview & Real-Time Insights
              </p>
            </div>
            {activeTab !== 'dashboard' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 cursor-pointer"
              >
                Back to Dashboard
              </button>
            )}
          </div>

          {activeTab === 'dashboard' ? (
            <>
              {/* Top 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('smart-homes')}
                  className="rounded-2xl bg-[#082636] border border-cyan-500/25 p-4 flex items-center justify-between cursor-pointer hover:border-cyan-400/50"
                >
                  <Home className="w-7 h-7 text-cyan-300" />
                  <div className="text-right">
                    <p className="text-xs text-slate-300">Smart Homes</p>
                    <p className="text-xl font-bold text-white">
                      {telemetry.smartHomesCount.toLocaleString()}{' '}
                      <span className="text-xs text-emerald-400">
                        ↑ {telemetry.smartHomesDelta}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('smart-traffic')}
                  className="rounded-2xl bg-[#082636] border border-cyan-500/25 p-4 flex items-center justify-between cursor-pointer hover:border-cyan-400/50"
                >
                  <Car className="w-7 h-7 text-cyan-300" />
                  <div className="text-right">
                    <p className="text-xs text-slate-300">Traffic Flow</p>
                    <p className="text-xl font-bold text-white">
                      {telemetry.trafficFlow}%{' '}
                      <span className="text-xs text-emerald-400">
                        ↑ {telemetry.trafficDelta}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('air-quality')}
                  className="rounded-2xl bg-[#082636] border border-cyan-500/25 p-4 flex items-center justify-between cursor-pointer hover:border-cyan-400/50"
                >
                  <Wind className="w-7 h-7 text-emerald-300" />
                  <div className="text-right">
                    <p className="text-xs text-slate-300">Air Quality</p>
                    <p className="text-xl font-bold text-white">
                      {telemetry.airQualityLabel}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('waste-management')}
                  className="rounded-2xl bg-[#082636] border border-cyan-500/25 p-4 flex items-center justify-between cursor-pointer hover:border-cyan-400/50"
                >
                  <Trash2 className="w-7 h-7 text-cyan-300" />
                  <div className="text-right">
                    <p className="text-xs text-slate-300">Waste Level</p>
                    <p className="text-xl font-bold text-white">
                      {telemetry.wasteLevel}%{' '}
                      <span className="text-xs text-amber-400">
                        ↑ {telemetry.wasteDelta}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 rounded-2xl border border-cyan-500/25 bg-[#082636] p-5 flex flex-col justify-between">
                  <div className="border-l-4 border-cyan-400 pl-3">
                    <h2 className="text-lg font-bold text-white">
                      Welcome Back, Admin
                    </h2>
                    <p className="text-xs text-cyan-100/80 mt-0.5">
                      NEOM City is working smoothly today.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5 text-xs">
                    <div className="rounded-xl bg-[#04141c] p-2.5 border border-cyan-500/20">
                      <span className="text-slate-400 block">Temp</span>
                      <strong className="text-white">{telemetry.temperature}°C</strong>
                    </div>
                    <div className="rounded-xl bg-[#04141c] p-2.5 border border-cyan-500/20">
                      <span className="text-slate-400 block">Soil / Water</span>
                      <strong className="text-white">
                        {telemetry.soilMoisture}% / {telemetry.waterLevel}%
                      </strong>
                    </div>
                    <div className="rounded-xl bg-[#04141c] p-2.5 border border-cyan-500/20">
                      <span className="text-slate-400 block">Solar</span>
                      <strong className="text-emerald-300">
                        {telemetry.solarOutputKw} kW
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-2xl border border-cyan-500/25 bg-[#082636] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-300" />
                      City Map
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                      Live
                    </span>
                  </div>
                  <div className="h-36 rounded-xl bg-[#04141c] border border-cyan-500/20 flex items-center justify-center text-xs text-cyan-200">
                    NEOM City Sector Grid
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-2xl border border-cyan-500/25 bg-[#082636] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Recent Alerts
                    </span>
                    <button
                      onClick={() => setActiveTab('control-center')}
                      className="text-xs text-cyan-300 cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {telemetry.alerts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-xl bg-[#04141c] px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {a.type === 'danger' && (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        {a.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        {a.type === 'info' && (
                          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                        {a.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{a.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {a.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-4 rounded-2xl border border-cyan-500/25 bg-[#082636] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-300" />
                      System Status
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">
                      Live
                    </span>
                  </div>

                  <div className="flex items-center justify-around py-1">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-400 bg-[#04141c] flex flex-col items-center justify-center">
                      <span className="text-base font-bold text-white">
                        {telemetry.systemHealth.overall}%
                      </span>
                      <span className="text-[9px] text-slate-400">Health</span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p>Online: <strong>{telemetry.systemHealth.online}</strong></p>
                      <p>Warning: <strong>{telemetry.systemHealth.warning}</strong></p>
                      <p>Offline: <strong>{telemetry.systemHealth.offline}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-2xl border border-cyan-500/25 bg-[#082636] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-300" />
                      Energy Consumption
                    </span>
                    <span className="text-sm font-bold text-white">
                      {telemetry.energyEfficiency}%
                    </span>
                  </div>

                  <div className="h-24 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetry.weeklyEnergy}>
                        <XAxis
                          dataKey="day"
                          tick={{ fill: '#94a3b8', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="consumption"
                          stroke="#22d3ee"
                          fill="#22d3ee"
                          fillOpacity={0.25}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-2xl border border-cyan-500/25 bg-[#082636] p-4 flex flex-col justify-between">
                  <span className="text-sm font-semibold text-white mb-2">
                    Quick Actions
                  </span>
                  <div className="grid grid-cols-4 gap-2 my-auto">
                    <button
                      onClick={() => handleQuickAction('gate')}
                      className="rounded-xl p-2.5 bg-[#04141c] border border-cyan-500/20 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <DoorOpen className="w-4 h-4 text-cyan-300" />
                      <span>{telemetry.gateOpen ? 'Gate Open' : 'Open Gate'}</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('parking')}
                      className="rounded-xl p-2.5 bg-[#04141c] border border-cyan-500/20 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <ParkingSquare className="w-4 h-4 text-cyan-300" />
                      <span>Parking</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('alert')}
                      className="rounded-xl p-2.5 bg-[#04141c] border border-cyan-500/20 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Siren className="w-4 h-4 text-rose-400" />
                      <span>Send Alert</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('reports')}
                      className="rounded-xl p-2.5 bg-[#04141c] border border-cyan-500/20 flex flex-col items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-cyan-300" />
                      <span>Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            (() => {
              const zone =
                ZONES_GUIDE_DETAILS[activeTab] || ZONES_GUIDE_DETAILS['smart-homes'];
              return (
                <div className="rounded-2xl border border-cyan-500/25 bg-[#082636] p-5 space-y-3">
                  <h2 className="text-lg font-bold text-white">{zone.title}</h2>
                  <p className="text-xs text-cyan-200">Sensors: {zone.sensors}</p>
                  <p className="text-xs text-cyan-200">Actuators: {zone.actuators}</p>
                  <p className="text-sm text-slate-300">{zone.scenario}</p>
                </div>
              );
            })()
          )}
        </main>
      </div>
    </div>
  );
}