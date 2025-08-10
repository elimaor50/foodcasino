import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, dimensions } from '../styles/globalStyles';

const SpinPromptModal = ({ 
  visible, 
  spinCount, 
  onAccept, 
  onCancel,
  fadeAnim, 
  scaleAnim 
}) => {
  if (!visible) return null;

  // Debug: Log the current spin count
  console.log('SpinPromptModal - Current spinCount:', spinCount);

  // Different message phases based on spin count
  const getMessageData = () => {
    // spinCount represents how many times they've ATTEMPTED to spin
    // 0 = first attempt (promises)
    // 1 = second attempt (disappointment) 
    // 2+ = third+ attempt (anger)
    
    if (spinCount === 0) {
      // First spin attempt - promises
      const promises = [
        { msg: "🎯 I will listen to whatever the wheel chooses!", btn: "I Promise! 🤝" },
        { msg: "🎲 I swear to follow the wheel's wisdom!", btn: "I Swear! ✋" },
        { msg: "🎰 I pledge my loyalty to the roulette!", btn: "I Pledge! 🎖️" },
        { msg: "🎪 I promise to accept my fate with grace!", btn: "I Accept! 😇" },
        { msg: "🎭 I vow to honor the wheel's decision!", btn: "I Vow! 💍" },
        { msg: "🎨 I commit to trusting the roulette's choice!", btn: "I Commit! 💪" },
        { msg: "🎯 I give my word to follow through!", btn: "My Word! 🤙" },
        { msg: "🎲 I solemnly swear to obey the wheel!", btn: "I Solemnly Swear! ⚡" },
        { msg: "🎰 I promise on my honor to listen!", btn: "On My Honor! 🎗️" },
        { msg: "🎪 I bind myself to the wheel's verdict!", btn: "I'm Bound! ⛓️" },
      ];
      const random = promises[Math.floor(Math.random() * promises.length)];
      return { ...random, cancel: "Never Mind... 😅" };
    } else if (spinCount === 1) {
      // Second spin attempt - disappointment
      const disappointments = [
        { msg: "🤨 Already breaking your promise to listen to the wheel?", btn: "I'm Sorry I'm Weak 😔" },
        { msg: "😒 Didn't you just swear to follow the wheel's choice?", btn: "I Have No Willpower 😭" },
        { msg: "🙄 That promise lasted... what, 30 seconds?", btn: "I'm Pathetic 😪" },
        { msg: "😤 The wheel is disappointed in your commitment!", btn: "I Failed Already 😞" },
        { msg: "🤦 Your word means nothing, doesn't it?", btn: "I'm Unreliable 🤡" },
        { msg: "😑 And I thought you were serious about your vow...", btn: "I'm Not Trustworthy 😵" },
        { msg: "🫤 The wheel trusted you, and this is how you repay it?", btn: "I Betrayed The Wheel 😱" },
        { msg: "😮‍💨 Your pledge was as weak as your resolve!", btn: "My Resolve Is Jello 🍮" },
        { msg: "🤷 Maybe commitment isn't your strong suit?", btn: "I'm Commitment-Phobic 😰" },
        { msg: "😏 Should I even bother spinning for someone so fickle?", btn: "I'm Super Fickle 🦋" },
      ];
      const random = disappointments[Math.floor(Math.random() * disappointments.length)];
      return { ...random, cancel: "Fine, I'll Stop 😒" };
    } else {
      // Third spin attempt and beyond - escalating anger
      const angerLevel = Math.min(spinCount - 2, 6); // spinCount 2=level 0, 3=level 1, etc.
      const angerMessages = [
        // Level 0 (3rd spin attempt, spinCount=2)
        [
          { msg: "😠 SERIOUSLY?! You're spinning AGAIN?!", btn: "I Have No Backbone! 😭" },
          { msg: "🤬 The wheel is FURIOUS with your indecision!", btn: "I'm Spineless! 🐛" },
          { msg: "😡 This is the THIRD TIME! What's wrong with you?!", btn: "Everything's Wrong! 😵‍💫" },
          { msg: "🔥 The wheel's patience is BURNING OUT!", btn: "I'm Destroying Everything! 🔥" },
          { msg: "👿 Your lack of commitment is INSULTING!", btn: "I'm An Insult! 🤡" },
        ],
        // Level 1 (4th spin attempt, spinCount=3)
        [
          { msg: "🌋 THE WHEEL IS ERUPTING WITH RAGE!", btn: "I'm Lava-Weak! 🌋😭" },
          { msg: "⚡ LIGHTNING BOLTS OF ANGER STRIKE!", btn: "I'm Getting Zapped! ⚡😵" },
          { msg: "🌪️ A TORNADO OF DISAPPOINTMENT SWIRLS!", btn: "I'm In The Storm! 🌪️😱" },
          { msg: "💀 THE WHEEL'S WRATH KNOWS NO BOUNDS!", btn: "I Fear The Wheel! 💀😰" },
          { msg: "🎭 THIS IS A TRAGEDY OF EPIC PROPORTIONS!", btn: "I'm The Tragedy! 🎭😭" },
        ],
        // Level 2 (5th spin attempt, spinCount=4)
        [
          { msg: "🚨 EMERGENCY! COMMITMENT LEVELS CRITICALLY LOW!", btn: "Send Help! 🚨😭" },
          { msg: "🛑 STOP! You're breaking the space-time continuum!", btn: "I Broke Reality! 🛑🌌" },
          { msg: "📢 ATTENTION: Serial promise-breaker detected!", btn: "I'm A Criminal! 👮‍♀️😭" },
          { msg: "🆘 MAYDAY! The wheel needs immediate backup!", btn: "I Need Backup Too! 🆘😵" },
          { msg: "⚠️ WARNING: Indecision overload imminent!", btn: "I'm Overloading! ⚠️🤯" },
        ],
        // Level 3 (6th spin attempt, spinCount=5)
        [
          { msg: "🎪 The wheel has joined the circus of your indecision!", btn: "I'm The Whole Circus! 🎪🤡" },
          { msg: "🎭 Shakespeare himself couldn't write this tragedy!", btn: "I'm Worse Than Hamlet! 🎭💀" },
          { msg: "🎨 You're painting a masterpiece of disappointment!", btn: "I'm Abstract Art! 🎨😭" },
          { msg: "🎵 The wheel is composing a sad, sad song about you!", btn: "I'm A Sad Song! 🎵😢" },
          { msg: "🎬 This deserves its own documentary: 'The Spinner Who Couldn't'!", btn: "I'm Documentary-Worthy! 🎬😱" },
        ],
        // Level 4 (7th spin attempt, spinCount=6)
        [
          { msg: "🌎 The ENTIRE PLANET is disappointed in you!", btn: "Earth Hates Me! 🌎😭" },
          { msg: "🌌 The UNIVERSE questions your existence!", btn: "I Question Myself! 🌌🤔" },
          { msg: "🛸 Even ALIENS are shaking their heads at you!", btn: "Aliens Are Judging! 🛸👽" },
          { msg: "🔮 Fortune tellers predicted this level of indecision!", btn: "I'm Predictably Bad! 🔮😵" },
          { msg: "📚 You'll go down in history as 'The Great Indecider'!", btn: "History Will Mock Me! 📚😱" },
        ],
        // Level 5 (8th spin attempt, spinCount=7)
        [
          { msg: "💫 CONGRATULATIONS! You've achieved LEGENDARY indecision!", btn: "I'm Legendarily Weak! 💫😭" },
          { msg: "🏆 You WIN the award for 'Most Spins Before Giving Up'!", btn: "Worst Award Ever! 🏆😵" },
          { msg: "🎖️ MEDAL OF HONOR for Outstanding Commitment Issues!", btn: "I Don't Deserve Medals! 🎖️😭" },
          { msg: "👑 ALL HAIL the Supreme Ruler of Indecision!", btn: "I Abdicate The Throne! 👑😱" },
          { msg: "🌟 You're a SHINING STAR... of disappointment!", btn: "I'm A Falling Star! 🌟💥" },
        ],
        // Level 6+ (9th+ spin attempt, spinCount=8+) - Pure chaos
        [
          { msg: "∞ We've reached INFINITE levels of indecision!", btn: "I'm Infinitely Sorry! ∞😭" },
          { msg: "🤖 SYSTEM ERROR: Indecision levels exceed maximum!", btn: "I Broke The System! 🤖💀" },
          { msg: "🦄 You're more mythical than a unicorn's commitment!", btn: "I'm Anti-Unicorn! 🦄😭" },
          { msg: "🌈 There's no pot of gold at the end of your indecision!", btn: "I Lost The Gold! 🌈💸" },
          { msg: "🎉 PARTY TIME! Let's celebrate your spectacular failure!", btn: "Worst Party Ever! 🎉😭" },
          { msg: "🎯 The wheel is considering early retirement because of you!", btn: "I'm A Career Killer! 🎯💀" },
          { msg: "🎲 Even dice are more decisive than you!", btn: "Dice Are My Masters! 🎲👑" },
          { msg: "🎰 Slot machines are filing a complaint about your behavior!", btn: "I'm Being Sued! 🎰⚖️" },
          { msg: "🎪 The entire casino industry is in shock!", btn: "I Shocked The World! 🎪🌍" },
          { msg: "🎭 This is beyond theater - it's pure chaos!", btn: "I Am Chaos Incarnate! 🎭🌪️" },
        ],
      ];
      
      const levelIndex = Math.min(angerLevel, angerMessages.length - 1);
      const messages = angerMessages[levelIndex];
      const random = messages[Math.floor(Math.random() * messages.length)];
      return { ...random, cancel: "I Give Up! 🏳️😭" };
    }
  };

  const { msg, btn, cancel } = getMessageData();

  // Get dynamic colors based on spin count
  const getModalColors = () => {
    if (spinCount === 0) {
      // First attempt - hopeful green/gold
      return {
        border: colors.accent,
        button: colors.rouletteGreen,
        shadow: colors.accent,
      };
    } else if (spinCount === 1) {
      // Second attempt - disappointment orange
      return {
        border: '#FFA500', // Orange for disappointment
        button: '#FF6B6B', // Red-orange
        shadow: '#FFA500',
      };
    } else {
      // Third+ attempt - anger red
      return {
        border: colors.rouletteRed,
        button: '#8B0000', // Dark red for anger
        shadow: colors.rouletteRed,
      };
    }
  };

  const modalColors = getModalColors();

  return (
    <Animated.View
      style={[
        styles.modalOverlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.modalBackdrop}
        onPress={onCancel}
        activeOpacity={1}
      />
      <Animated.View
        style={[
          styles.messageContainer,
          {
            borderColor: modalColors.border,
            shadowColor: modalColors.shadow,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.messageText}>{msg}</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button, 
              styles.acceptButton,
              { 
                backgroundColor: modalColors.button,
                shadowColor: modalColors.button,
              }
            ]}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>{btn}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>{cancel}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  messageContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    width: '90%',
    maxWidth: 380,
  },
  messageText: {
    fontSize: Math.min(22, dimensions.width * 0.055),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: Math.min(28, dimensions.width * 0.07),
  },
  buttonsContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acceptButton: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: colors.darkGray,
    shadowColor: colors.darkGray,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: Math.min(18, dimensions.width * 0.045),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: Math.min(16, dimensions.width * 0.04),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SpinPromptModal;
