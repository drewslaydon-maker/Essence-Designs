/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConnectomeState, Neuron, Synapse, Ommatidium } from '../types';

export class FlyBrainConnectome {
  public state: ConnectomeState;
  public ommatidia: Ommatidium[] = [];
  private dt = 0.016; // 60 FPS timestep (16ms)
  private time = 0;

  constructor() {
    this.initOmmatidia();
    this.state = this.initConnectome();
  }

  // Generate compound eye ommatidia grid
  private initOmmatidia() {
    const cols = 7;
    const rows = 5;
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.ommatidia.push({
          id: id++,
          x: (c / (cols - 1)) * 2 - 1, // -1 (far left) to 1 (far right)
          y: (r / (rows - 1)) * 2 - 1, // -1 (top) to 1 (bottom)
          intensity: 0.1,
          motionLeft: 0,
          motionRight: 0,
          motionLooming: 0,
        });
      }
    }
  }

  // Initialize biological neurons and synaptic weights
  private initConnectome(): ConnectomeState {
    const neurons: Record<string, Neuron> = {};
    const synapses: Synapse[] = [];

    // 1. OPTIC LOBE (T4/T5 motion detectors & Looming sensors)
    // Left eye cluster
    neurons['T4_L1'] = this.createNeuron('T4_L1', 'T4 Motion-L (Dorsal)', 'OPTIC_LOBE', 'T4_LEFT', 15, 20);
    neurons['T4_L2'] = this.createNeuron('T4_L2', 'T4 Motion-L (Ventral)', 'OPTIC_LOBE', 'T4_LEFT', 15, 35);
    neurons['T5_L1'] = this.createNeuron('T5_L1', 'T5 Off-Motion L', 'OPTIC_LOBE', 'T5_LEFT', 18, 50);

    // Right eye cluster
    neurons['T4_R1'] = this.createNeuron('T4_R1', 'T4 Motion-R (Dorsal)', 'OPTIC_LOBE', 'T4_RIGHT', 85, 20);
    neurons['T4_R2'] = this.createNeuron('T4_R2', 'T4 Motion-R (Ventral)', 'OPTIC_LOBE', 'T4_RIGHT', 85, 35);
    neurons['T5_R1'] = this.createNeuron('T5_R1', 'T5 Off-Motion R', 'OPTIC_LOBE', 'T5_RIGHT', 82, 50);

    // Lobula Plate Tangential Cells (LPTCs) - Horizontal System (HS) & Vertical System (VS)
    neurons['LPTC_HS_L'] = this.createNeuron('LPTC_HS_L', 'HS-Cell (Left Flow)', 'OPTIC_LOBE', 'HS_L', 28, 30);
    neurons['LPTC_HS_R'] = this.createNeuron('LPTC_HS_R', 'HS-Cell (Right Flow)', 'OPTIC_LOBE', 'HS_R', 72, 30);

    // 2. GIANT FIBER SYSTEM (Looming Escape Reflex)
    neurons['LGMD_L'] = this.createNeuron('LGMD_L', 'Lobula Looming L', 'GIANT_FIBER', 'LGMD', 35, 60);
    neurons['LGMD_R'] = this.createNeuron('LGMD_R', 'Lobula Looming R', 'GIANT_FIBER', 'LGMD', 65, 60);
    neurons['GF_COMMAND'] = this.createNeuron('GF_COMMAND', 'Giant Fiber (GF) Axon', 'GIANT_FIBER', 'GF', 50, 70);

    // 3. CENTRAL COMPLEX (CX) RING ATTRACTOR (Compass & Navigation)
    // 8 E-PG compass neurons forming a ring
    const ringCount = 8;
    const ringCenterX = 50;
    const ringCenterY = 38;
    const ringRadius = 14;

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2 - Math.PI / 2;
      const x = ringCenterX + Math.cos(angle) * ringRadius;
      const y = ringCenterY + Math.sin(angle) * ringRadius;
      const id = `EPG_${i}`;
      neurons[id] = this.createNeuron(id, `E-PG Compass Wedge ${i}`, 'CENTRAL_COMPLEX', 'E_PG_RING', x, y);
    }

    // 4. DESCENDING MOTOR NEURONS (DNs)
    neurons['DNa01_TURN_L'] = this.createNeuron('DNa01_TURN_L', 'DNa01 (Turn Left Motor)', 'DESCENDING_MOTOR', 'DNa01', 35, 88);
    neurons['DNa02_TURN_R'] = this.createNeuron('DNa02_TURN_R', 'DNa02 (Turn Right Motor)', 'DESCENDING_MOTOR', 'DNa02', 65, 88);
    neurons['DNp01_THRUST'] = this.createNeuron('DNp01_THRUST', 'DNp01 (Wingbeat Thrust)', 'DESCENDING_MOTOR', 'DNp01', 50, 92);
    neurons['TTM_JUMP'] = this.createNeuron('TTM_JUMP', 'TTM (Tergotrochanteral Dash)', 'DESCENDING_MOTOR', 'TTM', 50, 80);

    // SYNAPTIC WIRING (Authentic connectome topology)
    // Optic Lobes -> LPTC Horizontal Cells
    synapses.push({ sourceId: 'T4_L1', targetId: 'LPTC_HS_L', weight: 1.8, transmitter: 'ACh', lastActivity: 0 });
    synapses.push({ sourceId: 'T4_L2', targetId: 'LPTC_HS_L', weight: 1.8, transmitter: 'ACh', lastActivity: 0 });
    synapses.push({ sourceId: 'T4_R1', targetId: 'LPTC_HS_R', weight: 1.8, transmitter: 'ACh', lastActivity: 0 });
    synapses.push({ sourceId: 'T4_R2', targetId: 'LPTC_HS_R', weight: 1.8, transmitter: 'ACh', lastActivity: 0 });

    // LPTCs -> Descending Steering Neurons
    synapses.push({ sourceId: 'LPTC_HS_L', targetId: 'DNa01_TURN_L', weight: 2.4, transmitter: 'ACh', lastActivity: 0 });
    synapses.push({ sourceId: 'LPTC_HS_R', targetId: 'DNa02_TURN_R', weight: 2.4, transmitter: 'ACh', lastActivity: 0 });
    // Reciprocal inhibition for sharp steering
    synapses.push({ sourceId: 'LPTC_HS_L', targetId: 'DNa02_TURN_R', weight: -1.2, transmitter: 'GABA', lastActivity: 0 });
    synapses.push({ sourceId: 'LPTC_HS_R', targetId: 'DNa01_TURN_L', weight: -1.2, transmitter: 'GABA', lastActivity: 0 });

    // Looming detectors -> Giant Fiber
    synapses.push({ sourceId: 'LGMD_L', targetId: 'GF_COMMAND', weight: 3.2, transmitter: 'Glutamate', lastActivity: 0 });
    synapses.push({ sourceId: 'LGMD_R', targetId: 'GF_COMMAND', weight: 3.2, transmitter: 'Glutamate', lastActivity: 0 });
    synapses.push({ sourceId: 'GF_COMMAND', targetId: 'TTM_JUMP', weight: 4.5, transmitter: 'ACh', lastActivity: 0 });

    // Central Complex Ring Attractor Recurrent Topology
    for (let i = 0; i < ringCount; i++) {
      const self = `EPG_${i}`;
      const next = `EPG_${(i + 1) % ringCount}`;
      const prev = `EPG_${(i - 1 + ringCount) % ringCount}`;
      const opposite = `EPG_${(i + 4) % ringCount}`;

      // Local excitation to adjacent neighbors
      synapses.push({ sourceId: self, targetId: next, weight: 0.8, transmitter: 'ACh', lastActivity: 0 });
      synapses.push({ sourceId: self, targetId: prev, weight: 0.8, transmitter: 'ACh', lastActivity: 0 });
      // Broad lateral inhibition across the circle to keep a single bump
      synapses.push({ sourceId: self, targetId: opposite, weight: -1.4, transmitter: 'GABA', lastActivity: 0 });
    }

    // Seed initial compass heading bump at index 0 (North/Front)
    neurons['EPG_0'].voltage = -45;

    return {
      neurons,
      synapses,
      centralRingHeading: 0,
      syncRatio: 78.4,
      octopamineLevel: 25,
      sugarSatiety: 60,
      loomingThreatLevel: 0,
      wingbeatFrequency: 200,
      motorOutputs: {
        yawRate: 0,
        pitchRate: 0,
        forwardThrust: 0.5,
        evasiveBurst: false,
      },
    };
  }

  private createNeuron(
    id: string,
    name: string,
    cluster: Neuron['cluster'],
    subType: string,
    x: number,
    y: number
  ): Neuron {
    return {
      id,
      name,
      cluster,
      subType,
      x,
      y,
      voltage: -70,
      threshold: -50,
      restingVoltage: -70,
      lastSpikeTime: -999,
      isSpiking: false,
      spikeHistory: [],
    };
  }

  // Sensory input feeding from visual battlefield / angel positions
  public feedSensoryData(params: {
    angelRelativeAngle: number; // Angle to angel in radians (-PI to PI)
    angelDistance: number; // Distance in arbitrary units (10 to 600)
    loomingExpansionVelocity: number; // Rate of angular visual growth (0 to 1)
    opticFlowLeft: number; // Left visual motion stimulus (-1 to 1)
    opticFlowRight: number; // Right visual motion stimulus (-1 to 1)
    sugarLureActive: boolean;
    lightStrobeActive: boolean;
  }) {
    const {
      angelRelativeAngle,
      angelDistance,
      loomingExpansionVelocity,
      opticFlowLeft,
      opticFlowRight,
      sugarLureActive,
      lightStrobeActive,
    } = params;

    // Update Ommatidia intensities
    this.ommatidia.forEach((omm) => {
      // Angular distance from angel heading
      const ommAngle = omm.x * (Math.PI / 2);
      const angleDiff = Math.abs(ommAngle - angelRelativeAngle);
      const proximityFactor = Math.max(0, 1 - angleDiff / 1.2);
      const distanceFactor = Math.max(0, 1 - angelDistance / 500);

      omm.intensity = 0.1 + (proximityFactor * distanceFactor * 0.9);
      if (lightStrobeActive) {
        omm.intensity = (omm.intensity + Math.sin(this.time * 25) * 0.5 + 0.5) % 1;
      }
      omm.motionLeft = Math.max(0, opticFlowLeft);
      omm.motionRight = Math.max(0, opticFlowRight);
      omm.motionLooming = loomingExpansionVelocity;
    });

    // Feed Optic Lobes
    const t4L1 = this.state.neurons['T4_L1'];
    const t4R1 = this.state.neurons['T4_R1'];
    if (t4L1) t4L1.voltage += (Math.max(0, opticFlowLeft) * 18);
    if (t4R1) t4R1.voltage += (Math.max(0, opticFlowRight) * 18);

    // Feed Looming Detectors (LGMD)
    // Non-linear Looming Drive ~ expansion rate * exp(-angular distance)
    const loomingRate = Math.min(1.0, loomingExpansionVelocity * (150 / Math.max(20, angelDistance)));
    this.state.loomingThreatLevel = loomingRate;

    const lgmdL = this.state.neurons['LGMD_L'];
    const lgmdR = this.state.neurons['LGMD_R'];
    if (lgmdL && lgmdR) {
      const loomingDrive = loomingRate * 35;
      lgmdL.voltage += loomingDrive * (angelRelativeAngle < 0.2 ? 1.0 : 0.4);
      lgmdR.voltage += loomingDrive * (angelRelativeAngle > -0.2 ? 1.0 : 0.4);
    }

    // Feed Central Complex ring with sensory compass heading
    // Determine closest compass wedge to angel or sugar attractor
    const targetAngle = sugarLureActive ? 0 : angelRelativeAngle;
    const normalizedAngle = ((targetAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const closestWedge = Math.floor((normalizedAngle / (Math.PI * 2)) * 8) % 8;
    const wedgeNeuron = this.state.neurons[`EPG_${closestWedge}`];
    if (wedgeNeuron) {
      wedgeNeuron.voltage += 8.0; // Sensory drive shifts the bump
    }

    if (sugarLureActive) {
      this.state.sugarSatiety = Math.min(100, this.state.sugarSatiety + 0.3);
    }
  }

  // Inject Octopamine (Adrenaline / Berserk booster)
  public injectOctopamine(amount = 25) {
    this.state.octopamineLevel = Math.min(100, this.state.octopamineLevel + amount);
  }

  // Step the Spiking Neural Network (Leaky Integrate-and-Fire simulation)
  public step(): ConnectomeState {
    this.time += this.dt;

    // Decay neuromodulators
    this.state.octopamineLevel = Math.max(0, this.state.octopamineLevel - 0.08);
    this.state.sugarSatiety = Math.max(20, this.state.sugarSatiety - 0.04);

    // Octopamine increases resting baseline & lowers spike threshold
    const octoFactor = this.state.octopamineLevel / 100;
    const effectiveResting = -70 + octoFactor * 6; // -70mV up to -64mV
    const effectiveThreshold = -50 - octoFactor * 4; // -50mV down to -54mV

    // 1. Update Membrane Potentials & Check Spikes
    const spikingNeurons: string[] = [];

    Object.values(this.state.neurons).forEach((neuron) => {
      // Natural membrane potential leak towards resting voltage
      const leakRate = 0.22;
      neuron.voltage += (effectiveResting - neuron.voltage) * leakRate;

      // Small biological stochastic noise (spontaneous baseline firing)
      neuron.voltage += (Math.random() - 0.5) * 1.5;

      // Threshold check
      if (neuron.voltage >= effectiveThreshold) {
        neuron.voltage = 35; // Action potential peak (+35mV)
        neuron.isSpiking = true;
        neuron.lastSpikeTime = this.time;
        neuron.spikeHistory.push(this.time);
        spikingNeurons.push(neuron.id);

        // Keep spike history trimmed to last 2 seconds
        if (neuron.spikeHistory.length > 30) {
          neuron.spikeHistory.shift();
        }
      } else {
        neuron.isSpiking = false;
        // Hyperpolarization refractoriness if just spiked
        if (this.time - neuron.lastSpikeTime < 0.035) {
          neuron.voltage = -78;
        }
      }
    });

    // 2. Synaptic Transmission (Propagate spikes to post-synaptic targets)
    this.state.synapses.forEach((syn) => {
      const source = this.state.neurons[syn.sourceId];
      const target = this.state.neurons[syn.targetId];

      if (source && target && source.isSpiking) {
        // Excitatory or inhibitory synaptic current
        target.voltage += syn.weight * (1 + octoFactor * 0.5);
        syn.lastActivity = this.time;
      }
    });

    // 3. Calculate Central Complex Compass Heading from E-PG bump
    let sumSin = 0;
    let sumCos = 0;
    let totalActivity = 0;

    for (let i = 0; i < 8; i++) {
      const epg = this.state.neurons[`EPG_${i}`];
      if (epg) {
        const activity = Math.max(0, epg.voltage - effectiveResting);
        const angle = (i / 8) * Math.PI * 2;
        sumSin += Math.sin(angle) * activity;
        sumCos += Math.cos(angle) * activity;
        totalActivity += activity;
      }
    }

    if (totalActivity > 5) {
      this.state.centralRingHeading = (Math.atan2(sumSin, sumCos) + Math.PI * 2) % (Math.PI * 2);
    }

    // 4. Derive Motor Outputs from Descending Neurons
    const dna01 = this.state.neurons['DNa01_TURN_L'];
    const dna02 = this.state.neurons['DNa02_TURN_R'];
    const dnp01 = this.state.neurons['DNp01_THRUST'];
    const gf = this.state.neurons['GF_COMMAND'];

    // Left vs Right steering differential
    const leftDrive = dna01 ? Math.max(0, dna01.voltage - effectiveResting) : 0;
    const rightDrive = dna02 ? Math.max(0, dna02.voltage - effectiveResting) : 0;
    const rawYaw = (rightDrive - leftDrive) / 30;
    this.state.motorOutputs.yawRate = Math.max(-1, Math.min(1, rawYaw));

    // Thrust & Wingbeat frequency
    const thrustDrive = dnp01 ? Math.max(0, dnp01.voltage - effectiveResting) : 0;
    this.state.motorOutputs.forwardThrust = Math.min(1, 0.4 + (thrustDrive / 50) + (octoFactor * 0.4));
    this.state.wingbeatFrequency = Math.round(180 + this.state.motorOutputs.forwardThrust * 45 + octoFactor * 35);

    // Evasive Burst (Giant Fiber all-or-nothing trigger!)
    const gfFired = gf ? gf.isSpiking : false;
    this.state.motorOutputs.evasiveBurst = gfFired;

    // 5. Calculate EVA Bio-Sync Ratio (%)
    // High sync is achieved when:
    // - Central Complex ring attractor has a sharp coherent activity bump
    // - Moderate stress / octopamine without hyper-saturation
    // - Balanced sugar satiety
    const bumpSharpness = totalActivity > 0 ? (Math.sqrt(sumSin * sumSin + sumCos * sumCos) / totalActivity) : 0.5;
    const baselineSync = 65 + bumpSharpness * 35;
    const octoBoost = octoFactor * 25;
    const sugarPenalty = Math.max(0, (40 - this.state.sugarSatiety) * 0.4);

    let calculatedSync = baselineSync + octoBoost - sugarPenalty;
    if (this.state.octopamineLevel > 85) {
      // Overdrive / Berserk threshold
      calculatedSync = 120 + (this.state.octopamineLevel - 85) * 3.5;
    }
    this.state.syncRatio = Math.round(calculatedSync * 10) / 10;

    return this.state;
  }
}
