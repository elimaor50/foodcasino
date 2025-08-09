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

  const segmentAngle = 360 / items.length;

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

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setSelectedItem(null);

    // Random spin amount (multiple full rotations + random angle)
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;

    // Reset ball position
    ballPositionX.setValue(CENTER);
    ballPositionY.setValue(CENTER - RADIUS + 10);

    // Create bouncing ball animation during spin
    const createBallBounce = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(ballAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(ballAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
        ]),
        { iterations: -1 }
      );
    };

    // Ball bouncing animation
    const ballBounce = createBallBounce();
    ballBounce.start();

    // Ball spiral animation
    const ballSpiral = Animated.timing(ballAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    });

    // Wheel spin animation
    const wheelSpin = Animated.timing(rotationValue, {
      toValue: totalRotation,
      duration: 4000,
      useNativeDriver: true,
    });

    // Start animations
    Animated.parallel([wheelSpin, ballSpiral]).start(() => {
      ballBounce.stop();
      
      // Calculate which segment the ball landed on
      const normalizedAngle = (360 - (totalRotation % 360) + 360) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % items.length;
      const winningItem = items[segmentIndex];
      
      // Position ball on winning segment
      const winningAngle = (segmentIndex * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
      const ballFinalX = CENTER + (RADIUS - 30) * Math.cos(winningAngle);
      const ballFinalY = CENTER + (RADIUS - 30) * Math.sin(winningAngle);
      
      Animated.parallel([
        Animated.spring(ballPositionX, {
          toValue: ballFinalX,
          useNativeDriver: false,
          tension: 150,
          friction: 8,
        }),
        Animated.spring(ballPositionY, {
          toValue: ballFinalY,
          useNativeDriver: false,
          tension: 150,
          friction: 8,
        }),
      ]).start();

      setSelectedItem(winningItem);
      setIsSpinning(false);
      onSpinComplete && onSpinComplete(winningItem);
    });
  };

  // Ball position during spin
  const ballX = ballAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CENTER, CENTER],
  });

  const ballY = ballAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CENTER - RADIUS + 10, CENTER - RADIUS + 40],
  });

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
                  fontSize={items.length > 12 ? "10" : "12"}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${index * segmentAngle + segmentAngle / 2} ${textPos.x} ${textPos.y})`}
                >
                  {item.length > 12 ? item.substring(0, 10) + '...' : item}
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
          left: isSpinning ? ballX : ballPositionX,
          top: isSpinning ? ballY : ballPositionY,
          marginLeft: -BALL_SIZE / 2,
          marginTop: -BALL_SIZE / 2,
        }}
      />
      
      {/* Pointer */}
      <View
        style={{
          position: 'absolute',
          top: -10,
          width: 0,
          height: 0,
          borderLeftWidth: 15,
          borderRightWidth: 15,
          borderBottomWidth: 30,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: colors.accent,
        }}
      />
    </View>
  );
});

export default RouletteWheel;
