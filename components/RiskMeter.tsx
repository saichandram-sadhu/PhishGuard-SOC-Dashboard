import React from 'react';
import { RiskLevel } from '../types';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, level }) => {
  // Calculate SVG path for the arc
  const radius = 80;
  const stroke = 12;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'text-green-500';
  if (level === RiskLevel.MEDIUM) colorClass = 'text-yellow-500';
  if (level === RiskLevel.HIGH) colorClass = 'text-orange-500';
  if (level === RiskLevel.CRITICAL) colorClass = 'text-red-600';

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-xl">
      <div className="relative w-48 h-28 overflow-hidden">
        <svg className="w-48 h-48 transform rotate-180" viewBox="0 0 200 200">
          {/* Background Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end h-full pb-2">
          <span className={`text-4xl font-bold font-mono ${colorClass}`}>
            {score}%
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Confidence</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-slate-400">Risk Level</div>
        <div className={`text-xl font-bold uppercase tracking-widest ${colorClass}`}>
          {level}
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
