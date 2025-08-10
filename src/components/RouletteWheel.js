import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Animated, PanResponder, Dimensions } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors, dimensions } from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const ROULETTE_SIZE = dimensions.rouletteSize;
const RADIUS = ROULETTE_SIZE / 2 - 20;
const CENTER = ROULETTE_SIZE / 2;
const BALL_SIZE = 12;

const RouletteWheel = forwardRef(({ items, onSpinComplete, isSpinning, setIsSpinning }, ref) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const ballAnimation = useRef(new Animated.Value(0)).current;
  const ballPositionX = useRef(new Animated.Value(CENTER)).current;
  const ballPositionY = useRef(new Animated.Value(CENTER - RADIUS + 10)).current;

  // Calculate optimal text size for each segment
  const getOptimalTextSize = (text, segmentAngle) => {
    const wordLength = text.length;
    const availableSpace = (segmentAngle / 360) * (2 * Math.PI * RADIUS * 0.6); // 60% of segment width
    
    // Calculate font size based on available space and word length
    let fontSize;
    if (wordLength <= 4) {
      fontSize = Math.min(16, availableSpace / 3);
    } else if (wordLength <= 6) {
      fontSize = Math.min(14, availableSpace / 3.5);
    } else if (wordLength <= 8) {
      fontSize = Math.min(12, availableSpace / 4);
    } else {
      fontSize = Math.min(10, availableSpace / 5);
    }
    
    // Ensure minimum readable size
    return Math.max(fontSize, 8);
  };

  const getDisplayText = (text, segmentAngle) => {
    const availableWidth = (segmentAngle / 360) * (2 * Math.PI * RADIUS * 0.5);
    const charWidth = 8; // Approximate character width
    const maxChars = Math.floor(availableWidth / charWidth);
    
    if (text.length <= maxChars) {
      return text;
    } else if (maxChars >= 5) {
      return text.substring(0, maxChars - 2) + '..';
    } else {
      return text.substring(0, maxChars);
    }
  };

  const segmentAngle = 360 / items.length;

  // GUARANTEED MATCHING SYSTEM - Each triangle has a unique identifier
  const getTriangleAtAngle = (angle) => {
    // Normalize angle to 0-360
    const normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Calculate which triangle the pointer is pointing to
    // We add segmentAngle/2 to center the detection on each triangle
    const adjustedAngle = (normalizedAngle + (segmentAngle / 2)) % 360;
    const triangleIndex = Math.floor(adjustedAngle / segmentAngle);
    
    // Ensure we don't go out of bounds
    return triangleIndex % items.length;
  };

  // REAL ROULETTE PHYSICS - Ball position determines winner
  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setSelectedItem(null);

    // 1. SPIN THE WHEEL - Random rotation
    const wheelSpins = (Math.random() * 3 + 4) * 360; // 4-7 full rotations
    const finalWheelRotation = wheelSpins;

    // 2. ANIMATE WHEEL SPINNING
    Animated.timing(rotationValue, {
      toValue: finalWheelRotation,
      duration: 4000,
      useNativeDriver: true,
    }).start();

    // 3. BALL PHYSICS - Independent of wheel, lands randomly
    const ballFinalAngle = Math.random() * 360; // Ball lands at random angle
    const ballRadius = RADIUS - 25; // Ball settles near edge

    // Convert angle to X,Y coordinates
    const ballFinalX = CENTER + Math.cos((ballFinalAngle - 90) * Math.PI / 180) * ballRadius;
    const ballFinalY = CENTER + Math.sin((ballFinalAngle - 90) * Math.PI / 180) * ballRadius;

    // 4. BALL ANIMATION - Realistic bouncing then settling
    let bounceCount = 0;
    const maxBounces = 12;
    
    const bounceTimer = setInterval(() => {
      if (bounceCount < maxBounces) {
        // Ball spirals inward while bouncing
        const progress = bounceCount / maxBounces;
        const spiralAngle = ballFinalAngle + (1 - progress) * 720; // 2 full spirals
        const spiralRadius = RADIUS - 15 - (progress * 40); // Spiral inward
        
        const bounceX = CENTER + Math.cos((spiralAngle - 90) * Math.PI / 180) * spiralRadius;
        const bounceY = CENTER + Math.sin((spiralAngle - 90) * Math.PI / 180) * spiralRadius;
        
        ballPositionX.setValue(bounceX);
        ballPositionY.setValue(bounceY);
        bounceCount++;
      } else {
        clearInterval(bounceTimer);
        
        // 5. BALL SETTLES AT FINAL POSITION
        ballPositionX.setValue(ballFinalX);
        ballPositionY.setValue(ballFinalY);
        
        // 6. CALCULATE WINNER BASED ON BALL POSITION
        setTimeout(() => {
          // Get final wheel rotation (accounting for animation)
          const currentWheelRotation = finalWheelRotation % 360;
          
          // Calculate which segment the ball landed in
          // Ball angle relative to the rotated wheel
          const relativeAngle = (ballFinalAngle - currentWheelRotation + 360) % 360;
          
          // Find which segment this angle corresponds to
          const segmentSize = 360 / items.length;
          const winnerIndex = Math.floor(relativeAngle / segmentSize) % items.length;
          const winner = items[winnerIndex];
          
          // Show the result
          setSelectedItem(winner);
          setIsSpinning(false);
          onSpinComplete && onSpinComplete(winner);
          
          console.log(`Ball angle: ${ballFinalAngle.toFixed(1)}°, Wheel rotation: ${currentWheelRotation.toFixed(1)}°, Relative: ${relativeAngle.toFixed(1)}°, Winner: ${winner}`);
        }, 500);
      }
    }, 150);
  };

  // Generate segment colors (alternating casino colors)
  const getSegmentColor = (index) => {
    const colorPattern = [colors.rouletteRed, colors.rouletteBlack, colors.rouletteGreen];
    return colorPattern[index % colorPattern.length];
  };

  // Create SVG path for each segment
  const createSegmentPath = (index) => {
    const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
    
    const x1 = CENTER + RADIUS * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * Math.sin(startAngle);
    const x2 = CENTER + RADIUS * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * Math.sin(endAngle);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Calculate text position for each segment
  const getTextPosition = (index) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.7;
    return {
      x: CENTER + textRadius * Math.cos(angle),
      y: CENTER + textRadius * Math.sin(angle),
    };
  };

  // Ball position during spin
  const wheelRotation = rotationValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // Expose spin function to parent component
  useImperativeHandle(ref, () => ({
    spin: spin
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [{ rotate: wheelRotation }],
        }}
      >
        <Svg width={ROULETTE_SIZE} height={ROULETTE_SIZE}>
          <Defs>
            <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
            </RadialGradient>
          </Defs>
          
          {/* Outer ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 10}
            fill={colors.accent}
            stroke={colors.secondary}
            strokeWidth={4}
          />
          
          {/* Segments */}
          {items.map((item, index) => {
            const textPos = getTextPosition(index);
            const displayText = getDisplayText(item, segmentAngle);
            const fontSize = getOptimalTextSize(item, segmentAngle);
            
            return (
              <G key={index}>
                <Path
                  d={createSegmentPath(index)}
                  fill={getSegmentColor(index)}
                  stroke={colors.accent}
                  strokeWidth={2}
                />
                <SvgText
                  x={textPos.x}
                  y={textPos.y}
                  fill={colors.white}
                  fontSize={fontSize}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2 - 90} ${textPos.x} ${textPos.y})`}
                >
                  {displayText}
                </SvgText>
              </G>
            );
          })}
          
          {/* Center circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={30}
            fill="url(#centerGradient)"
            stroke={colors.accent}
            strokeWidth={3}
          />
        </Svg>
      </Animated.View>
      
      {/* Ball */}
      <Animated.View
        style={{
          position: 'absolute',
          width: BALL_SIZE,
          height: BALL_SIZE,
          borderRadius: BALL_SIZE / 2,
          backgroundColor: colors.white,
          shadowColor: colors.secondary,
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 8,
          left: ballPositionX,
          top: ballPositionY,
          marginLeft: -BALL_SIZE / 2,
          marginTop: -BALL_SIZE / 2,
        }}
      />
    </View>
  );
});

export default RouletteWheel;
