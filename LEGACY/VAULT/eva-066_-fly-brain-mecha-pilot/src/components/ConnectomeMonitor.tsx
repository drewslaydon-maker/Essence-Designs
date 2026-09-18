/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { ConnectomeState, Neuron } from '../types';
import { FlyBrainConnectome } from '../simulation/flyBrainConnectome';
import { audio } from '../services/audioService';
import { Brain, Cpu, Compass, Activity, Zap, Info, Eye } from 'lucide-react';

interface ConnectomeMonitorProps {
  connectome: FlyBrainConnectome;
  connectomeState: ConnectomeState;
}

export const ConnectomeMonitor: React.FC<ConnectomeMonitorProps> = ({
  connectome,
  connectomeState,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rasterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNeuron, setSelectedNeuron] = useState<Neuron | null>(null);

  // Biological Circuit Canvas Renderer
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);

      // Dark bio-laboratory backdrop
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, w, h);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 255, 180, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw fly brain hemisphere silhouette background
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 255, 180, 0.12)';
      ctx.lineWidth = 1.5;
      const cx = w / 2;
      const cy = h / 2 - 20;

      // Left optic lobe outline
      ctx.beginPath();
      ctx.ellipse(cx - 150, cy, 70, 110, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Right optic lobe outline
      ctx.beginPath();
      ctx.ellipse(cx + 150, cy, 70, 110, 0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Central Brain (Protocerebrum) outline
      ctx.beginPath();
      ctx.ellipse(cx, cy, 110, 100, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 1. Draw Synaptic Connections
      connectomeState.synapses.forEach((syn) => {
        const source = connectomeState.neurons[syn.sourceId];
        const target = connectomeState.neurons[syn.targetId];
        if (!source || !target) return;

        const sx = (source.x / 100) * w;
        const sy = (source.y / 100) * h;
        const tx = (target.x / 100) * w;
        const ty = (target.y / 100) * h;

        const isExcitatory = syn.weight > 0;
        const timeSinceActivity = Date.now() / 1000 - syn.lastActivity;
        const isActive = timeSinceActivity < 0.1;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);

        if (isActive) {
          ctx.strokeStyle = isExcitatory ? 'rgba(0, 255, 200, 0.9)' : 'rgba(255, 0, 100, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = isExcitatory ? 'rgba(0, 255, 180, 0.18)' : 'rgba(255, 80, 80, 0.15)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      });

      // 2. Draw Neurons
      (Object.values(connectomeState.neurons) as Neuron[]).forEach((neuron: Neuron) => {
        const nx = (neuron.x / 100) * w;
        const ny = (neuron.y / 100) * h;

        // Base color by cluster
        let baseColor = '#00ffcc';
        if (neuron.cluster === 'OPTIC_LOBE') baseColor = '#38bdf8';
        if (neuron.cluster === 'CENTRAL_COMPLEX') baseColor = '#c084fc';
        if (neuron.cluster === 'GIANT_FIBER') baseColor = '#f43f5e';
        if (neuron.cluster === 'DESCENDING_MOTOR') baseColor = '#fb923c';

        ctx.save();
        if (neuron.isSpiking) {
          // Action Potential Burst Glow
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(nx, ny, 9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Resting / Sub-threshold state
          const normV = Math.max(0, Math.min(1, (neuron.voltage + 70) / 25));
          ctx.fillStyle = baseColor;
          ctx.globalAlpha = 0.35 + normV * 0.65;
          ctx.beginPath();
          ctx.arc(nx, ny, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Selection ring
        if (selectedNeuron?.id === neuron.id) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(neuron.id, nx, ny - 9);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [connectomeState, selectedNeuron]);

  // Spike Raster Plot Canvas Renderer
  useEffect(() => {
    let animId: number;

    const renderRaster = () => {
      const canvas = rasterCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = (canvas.width = canvas.clientWidth);
      const h = (canvas.height = canvas.clientHeight);

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, w, h);

      // Track categories
      const tracks = [
        { label: 'OPTIC LOBES (T4/T5)', neurons: ['T4_L1', 'T4_R1', 'T5_L1', 'T5_R1'], color: '#38bdf8' },
        { label: 'CENTRAL COMPLEX (E-PG)', neurons: ['EPG_0', 'EPG_2', 'EPG_4', 'EPG_6'], color: '#c084fc' },
        { label: 'GIANT FIBER (LOOMING)', neurons: ['LGMD_L', 'LGMD_R', 'GF_COMMAND'], color: '#f43f5e' },
        { label: 'MOTOR AXONS (DNs)', neurons: ['DNa01_TURN_L', 'DNa02_TURN_R', 'TTM_JUMP'], color: '#fb923c' },
      ];

      const rowH = h / tracks.length;

      tracks.forEach((track, idx) => {
        const ry = idx * rowH;

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, ry + rowH);
        ctx.lineTo(w, ry + rowH);
        ctx.stroke();

        // Label
        ctx.fillStyle = track.color;
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(track.label, 8, ry + 16);

        // Render live spiking pulses
        const now = Date.now() / 1000;
        track.neurons.forEach((nId) => {
          const neuron = connectomeState.neurons[nId];
          if (!neuron) return;

          neuron.spikeHistory.forEach((st) => {
            const age = now - (st + (now - st)); // Recent spikes
            // Map spikes into scrolling raster window (last 5 seconds)
            const rx = w - (age % 5) * (w / 5);
            ctx.fillStyle = neuron.isSpiking ? '#ffffff' : track.color;
            ctx.fillRect(rx, ry + 8, 2.5, rowH - 14);
          });
        });
      });

      animId = requestAnimationFrame(renderRaster);
    };

    animId = requestAnimationFrame(renderRaster);
    return () => cancelAnimationFrame(animId);
  }, [connectomeState]);

  // Click on neuron to inspect details
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    let found: Neuron | null = null;
    for (const neuron of Object.values(connectomeState.neurons) as Neuron[]) {
      const nx = (neuron.x / 100) * w;
      const ny = (neuron.y / 100) * h;
      const dist = Math.hypot(clickX - nx, clickY - ny);
      if (dist < 15) {
        found = neuron;
        break;
      }
    }
    setSelectedNeuron(found);
    if (found) audio.playBeep(880);
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-neutral-200 font-mono-tech select-none overflow-y-auto p-3">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-500/30 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span className="font-bold tracking-wider uppercase">DROSOPHILA CONNECTOME TELEMETRY LAB</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-700 rounded">
              FAFB v783 / MaleCNS ALIVE
            </span>
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">
            Real-time Leaky Integrate-and-Fire (LIF) simulation mapped from fruit fly synaptic reconstruction
          </div>
        </div>

        {/* Live Neuromodulators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">
            <span className="text-neutral-400 text-[10px] block">OCTOPAMINE (ADRENALINE)</span>
            <span className="text-purple-400 font-bold">{Math.round(connectomeState.octopamineLevel)}%</span>
          </div>
          <div className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">
            <span className="text-neutral-400 text-[10px] block">SUGAR SATIETY (REWARD)</span>
            <span className="text-amber-400 font-bold">{Math.round(connectomeState.sugarSatiety)}%</span>
          </div>
          <div className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded">
            <span className="text-neutral-400 text-[10px] block">LOOMING THREAT (GF)</span>
            <span className={connectomeState.loomingThreatLevel > 0.4 ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-400 font-bold'}>
              {(connectomeState.loomingThreatLevel * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Biological Circuit & Side Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-[500px]">
        {/* Left 2 Cols: 2D Connectome Circuit Viewer */}
        <div className="lg:col-span-2 relative bg-neutral-900/60 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-2 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-neutral-300 uppercase">Connectome Circuit Topology</span>
            </div>
            <span className="text-[10px] text-neutral-500">Click any neuron node to inspect membrane potential</span>
          </div>

          <div className="relative flex-1 min-h-[360px]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full block cursor-pointer"
            />
            <div className="absolute inset-0 scanlines pointer-events-none" />
          </div>

          {/* Legend */}
          <div className="p-2 bg-neutral-950/90 border-t border-neutral-800 flex flex-wrap items-center justify-around gap-2 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span>Optic Lobes (T4/T5 Motion)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
              <span>Central Complex (E-PG Compass)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Giant Fiber (Looming Escape)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              <span>Descending Motor (DNa01/02)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Central Complex Compass & Selected Node Inspector */}
        <div className="flex flex-col gap-3">
          {/* Central Complex Ring Attractor Compass */}
          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase">
                <Compass className="w-4 h-4" />
                <span>Central Complex (E-PG Compass)</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                {Math.round((connectomeState.centralRingHeading * 180) / Math.PI)}° HEADING
              </span>
            </div>

            {/* Compass Ring Visualizer */}
            <div className="relative w-40 h-40 mx-auto my-2 border border-purple-500/30 rounded-full flex items-center justify-center bg-black/40">
              {/* Compass Ring Wedges */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const neuron = connectomeState.neurons[`EPG_${i}`];
                const isHot = neuron && neuron.voltage > -58;
                const rx = Math.cos(angle) * 62;
                const ry = Math.sin(angle) * 62;

                return (
                  <div
                    key={i}
                    className={`absolute w-3.5 h-3.5 rounded-full border transition-all ${
                      isHot
                        ? 'bg-purple-400 border-white shadow-md shadow-purple-500 scale-125'
                        : 'bg-neutral-900 border-purple-500/40 opacity-50'
                    }`}
                    style={{
                      transform: `translate(${rx}px, ${ry}px)`,
                    }}
                    title={`EPG Wedge ${i}: ${neuron?.voltage.toFixed(1)}mV`}
                  />
                );
              })}

              {/* Compass Needle Indicator pointing to active heading */}
              <div
                className="w-1 h-14 bg-gradient-to-t from-purple-500 to-white rounded origin-bottom transition-transform"
                style={{
                  transform: `rotate(${connectomeState.centralRingHeading + Math.PI / 2}rad)`,
                  marginBottom: '28px',
                }}
              />
              <div className="absolute w-2 h-2 rounded-full bg-white" />
            </div>

            <p className="text-[10px] text-neutral-400 text-center leading-tight">
              Biologically mirrors the fruit fly ellipsoid body. A localized bump of excitation tracks angular heading relative to celestial and visual cues.
            </p>
          </div>

          {/* Selected Neuron Inspector */}
          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase mb-2">
              <Cpu className="w-4 h-4" />
              <span>Neuron Micro-Electrode</span>
            </div>

            {selectedNeuron ? (
              <div className="space-y-2 text-xs">
                <div className="border-b border-neutral-800 pb-1">
                  <span className="text-neutral-400 block text-[10px]">IDENTIFIER:</span>
                  <span className="font-bold text-neutral-200">{selectedNeuron.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">MEMBRANE POTENTIAL:</span>
                    <span
                      className={`font-bold ${
                        selectedNeuron.isSpiking ? 'text-white' : selectedNeuron.voltage > -55 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {selectedNeuron.voltage.toFixed(1)} mV
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">THRESHOLD:</span>
                    <span className="text-red-400 font-bold">{selectedNeuron.threshold} mV</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-1 text-[11px]">
                  <span className="text-neutral-400 block text-[10px]">STATE:</span>
                  <span className={selectedNeuron.isSpiking ? 'text-emerald-400 font-bold animate-pulse' : 'text-neutral-300'}>
                    {selectedNeuron.isSpiking ? '⚡ FIRING ACTION POTENTIAL' : 'Sub-Threshold Leak'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-neutral-500 italic">
                Select a neuron node from the circuit diagram above to inspect real-time membrane potential ($V_m$) and synaptic transmitter kinetics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Spike Raster Plot (Electrophysiology traces) */}
      <div className="mt-3 p-3 bg-neutral-900/60 border border-neutral-800 rounded-lg">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-neutral-300 uppercase">Live Spike Raster Plot (Multi-Unit Electrophysiology)</span>
          </div>
          <span className="text-[10px] text-neutral-500">Real-time action potential spike trains (5s scrolling window)</span>
        </div>

        <div className="relative w-full h-28 bg-black/60 border border-neutral-800 rounded overflow-hidden">
          <canvas ref={rasterCanvasRef} className="absolute inset-0 w-full h-full block" />
          <div className="absolute inset-0 scanlines pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
