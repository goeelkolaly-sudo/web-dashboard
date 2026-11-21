import { useState, useCallback } from 'react'
import {
  Thermometer, Droplets, Wind, Trash2, Sprout, Waves, Siren, Car, Lightbulb,
  Home, Sun, Wifi, Flame, AlertTriangle, Activity, Power,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { useTelemetry } from './hooks/useTelemetry'

const TONE = {
  cyan: { text: 'text-cyan', bg: 'bg-cyan', soft: 'bg-cyan/10' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-400', soft: 'bg-blue-400/10' },
  ok: { text: 'text-ok', bg: 'bg-ok', soft: 'bg-ok/10' },
  warn: { text: 'text-warn', bg: 'bg-warn', soft: 'bg-warn/10' },
  danger: { text: 'text-danger', bg: 'bg-danger', soft: 'bg-danger/10' },
}
const stamp = () => new Date().toLocaleTimeString('en-GB')

function Toggle({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-cyan' : 'bg-line'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

function Kpi({ icon: Icon, label, sensor, value, tone, children }) {
  const t = TONE[tone]
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-lg p-2 ${t.soft} ${t.text}`}><Icon size={18} /></span>
        <span className="text-[11px] text-slate-500">{sensor}</span>
      </div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${t.text}`}>{value}</div>
      {children}
    </div>
  )
}

function Panel({ icon: Icon, title, sensor, badge, tone = 'cyan', alarm, children, toggle }) {
  const t = TONE[tone]
  return (
    <div className={`rounded-xl border bg-card p-4 transition ${alarm ? 'alarm border-danger' : 'border-line'}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-lg p-2 ${t.soft} ${t.text} ${alarm ? 'animate-pulse' : ''}`}><Icon size={18} /></span>
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-[11px] text-slate-500">{sensor}</div>
          </div>
        </div>
        {toggle}
      </div>
      <div className={`rounded-lg px-3 py-2 text-sm font-medium ${t.soft} ${t.text} ${alarm ? 'animate-pulse' : ''}`}>{badge}</div>
      {children && <div className="mt-2 text-xs text-slate-400">{children}</div>}
    </div>
  )
}

export default function App() {
  const [emergency, setEmergency] = useState(false)
  const [sw, setSw] = useState({ pump: false, street: true, home: false })
  const [logs, setLogs] = useState([])
  const { data, history } = useTelemetry(emergency)

  const log = useCallback((level, msg) => setLogs((l) => [{ id: Date.now() + Math.random(), level, text: `[${stamp()}] ${level}: ${msg}` }, ...l].slice(0, 50)), [])

  const startEmergency = () => {
    if (emergency) { setEmergency(false); log('INFO', 'Emergency mode cleared manually'); return }
    setEmergency(true)
    log('ALERT', 'Hospital Smoke Detected -> Ambulance Traffic Priority Activated')
  }
  const reset = () => { setEmergency(false); log('INFO', 'System reset to normal operation') }
  const flip = (key, name, onTxt, offTxt) => {
    const next = !sw[key]
    setSw((s) => ({ ...s, [key]: next }))
    log('INFO', `${name} manually switched ${next ? onTxt : offTxt}`)
  }

  const aqiGood = data.aqi <= 50
  const aqiLabel = data.aqi <= 50 ? 'Good' : data.aqi <= 100 ? 'Moderate' : 'Unhealthy'
  const aqiTone = data.aqi <= 50 ? 'ok' : data.aqi <= 100 ? 'warn' : 'danger'
  const wasteTone = data.waste > 70 ? 'warn' : 'cyan'

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Smart City Control Center</h1>
            <p className="text-sm text-slate-400">Real-Time IoT Telemetry &amp; Automation</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1.5 text-xs text-ok">
              <span className="h-2 w-2 rounded-full bg-ok" /><Wifi size={14} /> System Online (ESP32 / MQTT Ready)
            </span>
            <button onClick={startEmergency}
              className={`flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:brightness-110 ${emergency ? 'alarm' : ''}`}>
              <Flame size={16} /> {emergency ? 'Stop Fire Emergency' : 'Simulate Fire Emergency'}
            </button>
            <button onClick={reset} className="rounded-lg border border-line px-4 py-2 text-sm hover:bg-line/50">Reset Normal</button>
          </div>
        </header>

        {/* Row 1: KPIs */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Kpi icon={Thermometer} label="Temperature" sensor="DHT22" value={`${Math.round(data.temp)}°C`} tone={data.temp > 35 ? 'danger' : 'cyan'} />
          <Kpi icon={Droplets} label="Humidity" sensor="DHT22" value={`${Math.round(data.humidity)}%`} tone="blue" />
          <Kpi icon={Wind} label="Air Quality" sensor="MQ-135" value={`${aqiLabel} (${data.aqi} AQI)`} tone={aqiTone} />
          <Kpi icon={Trash2} label="Waste Management" sensor="Ultrasonic" value={`${data.waste}% Full`} tone={wasteTone}>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
              <div className={`h-full ${TONE[wasteTone].bg} transition-all`} style={{ width: `${data.waste}%` }} />
            </div>
          </Kpi>
          <Kpi icon={Sprout} label="Soil Moisture" sensor="Smart Irrigation" value={`${data.soil}%`} tone="cyan" />
          <Kpi icon={Waves} label="Water Tank Level" sensor="Level sensor" value={`${data.tank}%`} tone="blue" />
        </section>

        {/* Row 2: Subsystems */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Panel icon={Siren} title="Smart Hospital & Emergency" sensor="MQ-2 & Push Button" alarm={emergency}
            tone={emergency ? 'danger' : 'ok'} badge={emergency ? 'SMOKE DETECTED - EMERGENCY ACTIVE' : 'Normal / Safe'}>
            {emergency ? '🔔 Buzzer ON - evacuation protocol engaged' : 'Buzzer standby - no smoke detected'}
          </Panel>

          <Panel icon={Car} title="Smart Traffic System" sensor="IR / Ultrasonic" alarm={emergency}
            tone={emergency ? 'danger' : 'cyan'} badge={emergency ? 'AMBULANCE PRIORITY ROUTE ACTIVE' : 'Normal Flow'}>
            {emergency ? 'All signals on the hospital route forced GREEN' : 'Adaptive signal timing running'}
          </Panel>

          <Panel icon={Sprout} title="Smart Irrigation" sensor="Soil Moisture + Pump" tone={sw.pump ? 'cyan' : 'blue'}
            badge={`Pump ${sw.pump ? 'ON' : 'OFF'}`}
            toggle={<Toggle on={sw.pump} label="Water pump" onChange={() => flip('pump', 'Water pump', 'ON', 'OFF')} />}>
            Soil moisture: {data.soil}%
          </Panel>

          <Panel icon={Lightbulb} title="Smart Street Lighting" sensor="LDR + PIR" tone={sw.street ? 'warn' : 'blue'}
            badge={sw.street ? 'Night Mode - Auto ON' : 'Lights OFF (manual override)'}
            toggle={<Toggle on={sw.street} label="Street lights" onChange={() => flip('street', 'Street lighting', 'ON', 'OFF')} />}>
            Brightness follows ambient light and motion
          </Panel>

          <Panel icon={Home} title="Smart Homes & Education" sensor="PIR + RFID" tone="cyan" badge="2 Active Zones"
            toggle={<Toggle on={sw.home} label="Home lighting and fan" onChange={() => flip('home', 'Home lighting/fan', 'ON', 'OFF')} />}>
            Lighting / fan: {sw.home ? 'ON' : 'OFF'}
          </Panel>

          <Panel icon={Sun} title="Solar Energy Grid" sensor="Voltage sensor" tone="ok" badge={`Active - Generating ${data.solar}V`}>
            Clean energy feeding the city grid
          </Panel>
        </section>

        {/* Row 3: Logs + chart */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-line bg-card p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><AlertTriangle size={16} /> Alerts &amp; Event Log</div>
            <div className={`mb-3 rounded-lg px-3 py-2 text-sm font-medium ${emergency ? 'alarm bg-danger/10 text-danger' : 'bg-ok/10 text-ok'}`}>
              {emergency ? 'Alerts: 1 ACTIVE EMERGENCY' : 'Alerts: None'}
            </div>
            <ul className="h-56 space-y-1.5 overflow-y-auto font-mono text-xs">
              {logs.length === 0 && <li className="text-slate-500">No events yet.</li>}
              {logs.map((l) => (
                <li key={l.id} className={l.level === 'ALERT' ? 'text-danger' : 'text-slate-300'}>{l.text}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-card p-4 lg:col-span-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity size={16} /> Telemetry Trend</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tick={false} />
                  <YAxis yAxisId="t" stroke="#06B6D4" fontSize={11} domain={[20, 50]} />
                  <YAxis yAxisId="a" orientation="right" stroke="#10B981" fontSize={11} domain={[0, 300]} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', borderRadius: 8 }} />
                  <Legend />
                  <Line yAxisId="t" type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#06B6D4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="a" type="monotone" dataKey="aqi" name="Air Quality (AQI)" stroke="#10B981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
