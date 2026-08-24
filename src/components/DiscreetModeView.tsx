import React, { useState } from 'react';
import { Lock, Unlock, EyeOff, Check, RotateCcw, ArrowLeft, Shield } from 'lucide-react';

interface DiscreetModeViewProps {
  onExitDiscreetMode: () => void;
}

export const DiscreetModeView: React.FC<DiscreetModeViewProps> = ({ onExitDiscreetMode }) => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [pinBuffer, setPinBuffer] = useState<string>('');
  const [notesText, setNotesText] = useState<string>(
    'Shopping list:\n- Almond milk\n- Olive oil\n- Bananas\n- Oats\n- Herbal tea'
  );

  const handleDigit = (digit: string) => {
    // Secret exit PIN code (e.g. typing 1234 then =)
    setPinBuffer((prev) => (prev + digit).slice(-6));

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleOperator = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const current = prevValue || 0;
      let result = current;
      if (operation === '+') result = current + inputValue;
      if (operation === '-') result = current - inputValue;
      if (operation === '×') result = current * inputValue;
      if (operation === '÷') result = inputValue !== 0 ? current / inputValue : 0;
      setDisplay(String(result));
      setPrevValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEqual = () => {
    // Check if secret pin was entered (e.g., 2026 or 1234 or clicking exit)
    if (pinBuffer.includes('1234') || pinBuffer.includes('2026')) {
      onExitDiscreetMode();
      return;
    }

    const inputValue = parseFloat(display);
    if (operation && prevValue !== null) {
      let result = prevValue;
      if (operation === '+') result = prevValue + inputValue;
      if (operation === '-') result = prevValue - inputValue;
      if (operation === '×') result = prevValue * inputValue;
      if (operation === '÷') result = inputValue !== 0 ? prevValue / inputValue : 0;
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-[#F4F4F5] text-[#18181B] font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md border border-neutral-300 space-y-6">
        
        {/* Neutral disguised header */}
        <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
              ±
            </div>
            <h2 className="text-sm font-semibold text-neutral-800">Quick Utility & Notes</h2>
          </div>

          <button
            onClick={onExitDiscreetMode}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            title="Return to AURA"
          >
            <Unlock className="w-3 h-3 text-neutral-600" />
            <span>Exit Disguise</span>
          </button>
        </div>

        {/* Working Disguised Calculator */}
        <div className="bg-neutral-900 p-4 rounded-xl text-white shadow-inner space-y-3">
          <div className="text-right font-mono text-3xl tracking-wider overflow-hidden text-ellipsis py-2 px-1 text-emerald-400">
            {display}
          </div>

          <div className="grid grid-cols-4 gap-2 text-sm font-semibold font-mono">
            <button
              onClick={handleClear}
              className="p-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-amber-300 transition-colors"
            >
              AC
            </button>
            <button
              onClick={() => setDisplay(String(parseFloat(display) * -1))}
              className="p-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              ±
            </button>
            <button
              onClick={() => setDisplay(String(parseFloat(display) / 100))}
              className="p-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('÷')}
              className="p-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              ÷
            </button>

            <button onClick={() => handleDigit('7')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">7</button>
            <button onClick={() => handleDigit('8')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">8</button>
            <button onClick={() => handleDigit('9')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">9</button>
            <button onClick={() => handleOperator('×')} className="p-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white">×</button>

            <button onClick={() => handleDigit('4')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">4</button>
            <button onClick={() => handleDigit('5')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">5</button>
            <button onClick={() => handleDigit('6')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">6</button>
            <button onClick={() => handleOperator('-')} className="p-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white">-</button>

            <button onClick={() => handleDigit('1')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">1</button>
            <button onClick={() => handleDigit('2')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">2</button>
            <button onClick={() => handleDigit('3')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">3</button>
            <button onClick={() => handleOperator('+')} className="p-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white">+</button>

            <button onClick={() => handleDigit('0')} className="p-3 col-span-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">0</button>
            <button onClick={() => !display.includes('.') && handleDigit('.')} className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700">.</button>
            <button onClick={handleEqual} className="p-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">=</button>
          </div>
        </div>

        {/* Scratchpad note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600 block">Personal Scratchpad</label>
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={4}
            className="w-full text-xs p-3 rounded-lg border border-neutral-300 font-sans focus:outline-none focus:ring-1 focus:ring-neutral-500 bg-neutral-50"
            placeholder="Type notes here..."
          />
        </div>

        {/* Security Info */}
        <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-200">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-neutral-400" />
            Discreet Safe View Active
          </span>
          <span>Tip: Tap 'Exit Disguise' or type 1234 =</span>
        </div>

      </div>
    </div>
  );
};
