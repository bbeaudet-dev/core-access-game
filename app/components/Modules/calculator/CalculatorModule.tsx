import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface CalculatorModuleProps {
  onGoHome: () => void;
}

export default function CalculatorModule({ onGoHome }: CalculatorModuleProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [puzzleCode, setPuzzleCode] = useState<string>('');
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);

  // Generate a random puzzle code
  useEffect(() => {
    const operations = ['+', '-', '*', '/'];
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let result: number;
    switch (op) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = Math.floor(num1 / num2);
        break;
      default:
        result = num1 + num2;
    }
    
    setPuzzleCode(result.toString());
  }, []);

  const inputDigit = (digit: string) => {
    playSound('ui_button_tap');
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    playSound('ui_button_tap');
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    playSound('ui_button_tap');
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const clearAll = () => {
    playSound('ui_button_tap');
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    playSound('ui_button_tap');
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    playSound('ui_button_tap');
    if (!previousValue || !operation) return;

    const inputValue = parseFloat(display);
    const newValue = calculate(previousValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);

    // Check if the result matches the puzzle code
    if (Math.floor(newValue).toString() === puzzleCode) {
      setPuzzleComplete(true);
    }
  };

  const renderButton = (text: string, onPress: () => void, type: 'number' | 'operation' | 'function' = 'number') => {
    const getButtonStyle = () => {
      switch (type) {
        case 'operation':
          return 'bg-orange-500';
        case 'function':
          return 'bg-gray-600';
        default:
          return 'bg-gray-700';
      }
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`${getButtonStyle()} w-16 h-16 rounded-full justify-center items-center m-1`}
        activeOpacity={0.7}
      >
        <Text className="text-white text-xl font-mono">
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenTemplate title="CALCULATOR" titleColor="orange" onGoHome={onGoHome}>
      <View className="flex flex-col space-y-4">
        {/* Display */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">DISPLAY</Text>
          <Text className="text-orange-400 text-3xl font-mono text-right">
            {display}
          </Text>
          {operation && (
            <Text className="text-gray-500 text-sm font-mono text-right">
              {previousValue} {operation}
            </Text>
          )}
        </View>

        {/* Calculator Buttons */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">CALCULATOR</Text>
          
          {/* Row 1 */}
          <View className="flex-row justify-center mb-2">
            {renderButton('C', clearAll, 'function')}
            {renderButton('CE', clearDisplay, 'function')}
            {renderButton('÷', () => performOperation('/'), 'operation')}
          </View>
          
          {/* Row 2 */}
          <View className="flex-row justify-center mb-2">
            {renderButton('7', () => inputDigit('7'))}
            {renderButton('8', () => inputDigit('8'))}
            {renderButton('9', () => inputDigit('9'))}
            {renderButton('×', () => performOperation('*'), 'operation')}
          </View>
          
          {/* Row 3 */}
          <View className="flex-row justify-center mb-2">
            {renderButton('4', () => inputDigit('4'))}
            {renderButton('5', () => inputDigit('5'))}
            {renderButton('6', () => inputDigit('6'))}
            {renderButton('-', () => performOperation('-'), 'operation')}
          </View>
          
          {/* Row 4 */}
          <View className="flex-row justify-center mb-2">
            {renderButton('1', () => inputDigit('1'))}
            {renderButton('2', () => inputDigit('2'))}
            {renderButton('3', () => inputDigit('3'))}
            {renderButton('+', () => performOperation('+'), 'operation')}
          </View>
          
          {/* Row 5 */}
          <View className="flex-row justify-center">
            {renderButton('0', () => inputDigit('0'))}
            {renderButton('.', inputDecimal)}
            {renderButton('=', handleEquals, 'operation')}
          </View>
        </View>
      </View>
    </ScreenTemplate>
  );
} 