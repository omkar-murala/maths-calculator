import React, { useReducer } from "react";
import "./App.css";

// Define action types
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

// Reducer function
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Handle adding digits
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      // Handle choosing an operation
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      // Handle clearing
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
        overwrite: false,
      };

    case ACTIONS.DELETE_DIGIT:
      // Handle deleting a digit
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      // Handle evaluation
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

// Evaluate function
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    
    // Default case to handle unexpected operations
    default:
      computation = "Invalid operation";
      break;
  }

  return computation.toString();
}

// Integer formatter
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

// Format operand
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

// Main App component
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      {/* Buttons */}
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '7' } })}>7</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '8' } })}>8</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '9' } })}>9</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '+' } })}>+</button>
  
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '4' } })}>4</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '5' } })}>5</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '6' } })}>6</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '-' } })}>-</button>
  
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '1' } })}>1</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '2' } })}>2</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '3' } })}>3</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '*' } })}>*</button>
  
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '0' } })}>0</button>
      <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '.' } })}>.</button>
      <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })} className="span-two">=</button>
      <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '÷' } })}>÷</button>

      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })} className="span-two">AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL.</button>
    </div>
  );
}

export default App;
