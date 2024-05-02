class State {
  isAccepting: boolean = false;
  transitions: { [char: string]: State } = {};

  constructor(isAccepting?: boolean) {
    this.isAccepting = isAccepting || false;
  }
}

class DFA {
  startState: State;

  constructor(wordList: string[]) {
    this.startState = this.createStates(wordList);
  }

  private createStates(wordList: string[]): State {
    const startState = new State();

    for (const word of wordList) {
      let currentState = startState;
      for (const char of word) {
        if (!currentState.transitions[char]) {
          currentState.transitions[char] = new State();
        }
        currentState = currentState.transitions[char];
      }
      currentState.transitions = {}; // No further transitions from word end
      currentState.isAccepting = true; // Set the state to accepting state
    }

    return startState;
  }

  run(string: string): boolean {
    let currentState = this.startState;

    for (const char of string) {
      if (!currentState.transitions[char]) {
        return false;
      }
      currentState = currentState.transitions[char];
    }

    return currentState.isAccepting; // True if the string is accepted by the DFA, False otherwise.
  }
}

import conjunctions from "~/data/conjunctions";
import adverbs from "~/data/adverbs";
import adjectives from "~/data/adjectives";

const wordList = conjunctions.concat(adverbs, adjectives);
const dfa = new DFA(wordList);

export const useDFA = {
  $run(string: string) {
    return dfa.run(string);
  }
}