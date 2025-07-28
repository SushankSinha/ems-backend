import mongoose from 'mongoose';

const missionMetricsSchema = new mongoose.Schema({
  rice: { type: Number, required: true },
  pulses: { type: Number, required: true }, // dal
  atta: { type: Number, required: true },
});

const MissionMetrics = mongoose.model('MissionMetrics', missionMetricsSchema);
export default MissionMetrics;