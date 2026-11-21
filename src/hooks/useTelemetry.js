import { useEffect, useState } from 'react'

/**
 * DATA LAYER — swap this hook for MQTT later, keeping the same return shape
 * ({ data, history }). Example with MQTT.js:
 *
 *   import mqtt from 'mqtt'
 *   const client = mqtt.connect('wss://broker.example.com:8884/mqtt')
 *   client.subscribe('city/telemetry/#')
 *   client.on('message', (topic, payload) => {
 *     const v = JSON.parse(payload.toString())   // e.g. { temp: 28.4, aqi: 42 }
 *     setData(d => ({ ...d, ...v }))
 *   })
 *   // publish commands: client.publish('city/cmd/pump', 'ON')
 */
const INITIAL = { temp: 28, humidity: 65, aqi: 42, waste: 70, soil: 40, tank: 80, solar: 12.4 }
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const walk = (v, step, min, max) => +clamp(v + (Math.random() - 0.5) * step, min, max).toFixed(1)
const stamp = () => new Date().toLocaleTimeString('en-GB')

export function useTelemetry(emergency, intervalMs = 3000) {
  const [data, setData] = useState(INITIAL)
  const [history, setHistory] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({ time: `-${(15 - i) * 3}s`, temp: 28, aqi: 42 }))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const next = {
          temp: walk(d.temp + (emergency ? 0.6 : (28 - d.temp) * 0.1), 0.8, 22, 45),
          humidity: walk(d.humidity, 1.5, 40, 85),
          aqi: Math.round(walk(d.aqi + (emergency ? 8 : (42 - d.aqi) * 0.15), 4, 20, 300)),
          waste: Math.round(walk(d.waste, 1.2, 60, 80)),
          soil: Math.round(walk(d.soil, 1.5, 25, 60)),
          tank: Math.round(walk(d.tank, 1, 70, 90)),
          solar: walk(d.solar, 0.4, 11, 13.5),
        }
        setHistory((h) => [...h.slice(-19), { time: stamp(), temp: next.temp, aqi: next.aqi }])
        return next
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [emergency, intervalMs])

  return { data, history }
}
