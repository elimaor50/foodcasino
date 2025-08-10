import React from 'react';
import Svg, { Circle, Path, Text as SvgText, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';

export const AppLogo = ({ size = 1024 }) => {
  const center = size / 2;
  const radius = size * 0.44;
  
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#1a1a2e" stopOpacity="1" />
          <Stop offset="100%" stopColor="#0f0f1e" stopOpacity="1" />
        </RadialGradient>
        <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ffd700" stopOpacity="1" />
          <Stop offset="100%" stopColor="#ff6b35" stopOpacity="1" />
        </RadialGradient>
        <LinearGradient id="segmentRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#dc2626" stopOpacity="1" />
          <Stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="segmentBlack" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#374151" stopOpacity="1" />
          <Stop offset="100%" stopColor="#1f2937" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="segmentGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#059669" stopOpacity="1" />
          <Stop offset="100%" stopColor="#047857" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Background */}
      <Circle cx={center} cy={center} r={center} fill="url(#bgGradient)"/>
      
      {/* Outer golden ring */}
      <Circle cx={center} cy={center} r={radius + 20} fill="none" stroke="#ffd700" strokeWidth="8"/>
      <Circle cx={center} cy={center} r={radius} fill="none" stroke="#ff6b35" strokeWidth="4"/>
      
      {/* Roulette segments (6 segments for clean look) */}
      <Path d={`M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center + radius * 0.866} ${center - radius * 0.5} Z`} fill="url(#segmentRed)" stroke="#ffd700" strokeWidth="2"/>
      
      <Path d={`M ${center} ${center} L ${center + radius * 0.866} ${center - radius * 0.5} A ${radius} ${radius} 0 0 1 ${center + radius * 0.866} ${center + radius * 0.5} Z`} fill="url(#segmentBlack)" stroke="#ffd700" strokeWidth="2"/>
      
      <Path d={`M ${center} ${center} L ${center + radius * 0.866} ${center + radius * 0.5} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} Z`} fill="url(#segmentGreen)" stroke="#ffd700" strokeWidth="2"/>
      
      <Path d={`M ${center} ${center} L ${center} ${center + radius} A ${radius} ${radius} 0 0 1 ${center - radius * 0.866} ${center + radius * 0.5} Z`} fill="url(#segmentRed)" stroke="#ffd700" strokeWidth="2"/>
      
      <Path d={`M ${center} ${center} L ${center - radius * 0.866} ${center + radius * 0.5} A ${radius} ${radius} 0 0 1 ${center - radius * 0.866} ${center - radius * 0.5} Z`} fill="url(#segmentBlack)" stroke="#ffd700" strokeWidth="2"/>
      
      <Path d={`M ${center} ${center} L ${center - radius * 0.866} ${center - radius * 0.5} A ${radius} ${radius} 0 0 1 ${center} ${center - radius} Z`} fill="url(#segmentGreen)" stroke="#ffd700" strokeWidth="2"/>
      
      {/* Center circle with gradient */}
      <Circle cx={center} cy={center} r={radius * 0.25} fill="url(#centerGradient)" stroke="#ffd700" strokeWidth="6"/>
      
      {/* Roulette ball */}
      <Circle cx={center + radius * 0.7} cy={center - radius * 0.4} r={size * 0.025} fill="white" stroke="#ffd700" strokeWidth="3"/>
      
      {/* Center logo text */}
      <SvgText 
        x={center} 
        y={center - size * 0.02} 
        fontSize={size * 0.08} 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="white"
      >
        FOOD
      </SvgText>
      <SvgText 
        x={center} 
        y={center + size * 0.06} 
        fontSize={size * 0.05} 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="#ffd700"
      >
        CASINO
      </SvgText>
    </Svg>
  );
};
