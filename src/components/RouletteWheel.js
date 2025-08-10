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

  // REAL ROULETTE PHYSICS - Ball spins with wheel then settles
  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setSelectedItem(null);

    // Reset ball to starting position (top of wheel)
    const startRadius = RADIUS - 10;
    ballPositionX.setValue(CENTER);
    ballPositionY.setValue(CENTER - startRadius);

    // 1. WHEEL PHYSICS - Spins and gradually slows down
    const wheelSpins = (Math.random() * 3 + 5) * 360; // 5-8 full rotations
    const wheelDuration = 4500; // Wheel spins for 4.5 seconds

    // 2. BALL PHYSICS - Starts spinning with wheel, then continues longer
    const ballInitialSpeed = wheelSpins + (Math.random() * 2 + 3) * 360; // Ball spins faster initially
    const ballTotalSpins = ballInitialSpeed + (Math.random() * 1.5 + 1) * 360; // Extra spins after wheel slows
    const ballDuration = wheelDuration + 2000; // Ball continues for 2 more seconds
    
    // Ball will settle at whatever position it naturally reaches
    const settleRadius = RADIUS - 25;

    // 3. START WHEEL ANIMATION
    Animated.timing(rotationValue, {
      toValue: wheelSpins,
      duration: wheelDuration,
      useNativeDriver: true,
    }).start();

    // 4. BALL ANIMATION - Three phases
    let currentBallAngle = 0;
    let ballRadius = startRadius;
    const animationInterval = 16; // 60fps
    let elapsedTime = 0;

    const ballTimer = setInterval(() => {
      elapsedTime += animationInterval;
      const progress = elapsedTime / ballDuration;

      if (progress >= 1) {
        // PHASE 3: Final settling - ball naturally stops where it is
        clearInterval(ballTimer);
        
        // Ball settles at its current natural position (no sudden jumps!)
        const naturalSettleRadius = settleRadius;
        const finalX = CENTER + Math.cos((currentBallAngle - 90) * Math.PI / 180) * naturalSettleRadius;
        const finalY = CENTER + Math.sin((currentBallAngle - 90) * Math.PI / 180) * naturalSettleRadius;
        
        // Smooth final settling animation to the natural position
        Animated.parallel([
          Animated.timing(ballPositionX, {
            toValue: finalX,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(ballPositionY, {
            toValue: finalY,
            duration: 400,
            useNativeDriver: false,
          })
        ]).start(() => {
          // Calculate winner based on where ball naturally ended up
          setTimeout(() => {
            const currentWheelRotation = wheelSpins % 360;
            // Use the ball's natural final angle instead of random
            const ballNaturalAngle = currentBallAngle % 360;
            const relativeAngle = (ballNaturalAngle - currentWheelRotation + 360) % 360;
            const segmentSize = 360 / items.length;
            const winnerIndex = Math.floor(relativeAngle / segmentSize) % items.length;
            const winner = items[winnerIndex];
            
            setSelectedItem(winner);
            setIsSpinning(false);
            onSpinComplete && onSpinComplete(winner);
            
            console.log(`Ball natural angle: ${ballNaturalAngle.toFixed(1)}°, Wheel rotation: ${currentWheelRotation.toFixed(1)}°, Relative: ${relativeAngle.toFixed(1)}°, Winner: ${winner}`);
          }, 200);
        });
        return;
      }

      // PHASE 1 & 2: Ball spinning and slowing down
      if (progress < 0.6) {
        // PHASE 1: Ball spins with high speed, follows wheel edge
        const speed = ballTotalSpins * (1 - progress * 0.3); // Gradually slow down
        currentBallAngle += (speed / ballDuration) * animationInterval;
        ballRadius = startRadius; // Stay at wheel edge
      } else {
        // PHASE 2: Ball starts spiraling inward while slowing down
        const spiralProgress = (progress - 0.6) / 0.4; // 0 to 1 for spiral phase
        const speed = ballTotalSpins * (0.7 - spiralProgress * 0.6); // Continue slowing
        currentBallAngle += (speed / ballDuration) * animationInterval;
        
        // Spiral inward gradually
        ballRadius = startRadius - (spiralProgress * (startRadius - settleRadius));
        
        // Add some randomness/wobble as ball loses momentum
        const wobble = Math.sin(elapsedTime * 0.02) * spiralProgress * 8;
        ballRadius += wobble;
      }

      // Update ball position
      const ballX = CENTER + Math.cos((currentBallAngle - 90) * Math.PI / 180) * ballRadius;
      const ballY = CENTER + Math.sin((currentBallAngle - 90) * Math.PI / 180) * ballRadius;
      
      ballPositionX.setValue(ballX);
      ballPositionY.setValue(ballY);
    }, animationInterval);
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
