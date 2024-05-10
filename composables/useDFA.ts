// This is the state class for the DFA.
class State {
  isAccepting: boolean = false; // Whether the state is an accepting state
  transitions: { [char: string]: State } = {}; // The transitions from the state

  constructor(isAccepting?: boolean) {
    this.isAccepting = isAccepting || false; // Set the accepting state to the provided value or false
  }
}

// This is the DFA class.
class DFA {
  startState: State; // The starting state of the DFA

  constructor(wordList: string[]) {
    // Create the initial and following states based on the given word list
    this.startState = this.createStates(wordList);
  }

  // Create the states based on the given word list
  private createStates(wordList: string[]): State {
    const startState = new State(); // Create the initial state

    for (const word of wordList) {
      let currentState = startState; // Set the current state to the initial state

      // Iterate through the characters of the word
      for (const char of word) {
        // If the transition does not exist, create a new state
        if (!currentState.transitions[char]) { 
          currentState.transitions[char] = new State();
        }
        // Move to the next state based on the character transition
        currentState = currentState.transitions[char];
      }
      currentState.transitions = {}; // Clear transitions from the end state (no further transitions possible)
      currentState.isAccepting = true; // Mark the end state of the current word as accepting
    }

    return startState;
  }

  // Run the DFA on the given string
  run(string: string): boolean {
    let currentState = this.startState; // Set the current state to the initial state

    // Iterate through the characters of the string
    for (const char of string) {
      // If the transition does not exist, the string is not accepted by the DFA
      if (!currentState.transitions[char]) {
        return false;
      }
      // Move to the next state based on the character transition
      currentState = currentState.transitions[char];
    }

    return currentState.isAccepting; // True if the string is accepted by the DFA, False otherwise.
  }
}

// Import the data
import conjunctions from "~/data/conjunctions";
import adverbs from "~/data/adverbs";
import adjectives from "~/data/adjectives";

// Create the word list and the DFA
const wordList = conjunctions.concat(adverbs, adjectives);
const dfa = new DFA(wordList);

// Export the composable to call the DFA to check if a string is accepted by the DFA.
export const useDFA = {
  $run(string: string) {
    return dfa.run(string);
  }
}