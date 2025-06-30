const prompts: string[] = [
  "What are you hoping to get from this site visit?",
  "Is there something more meaningful you could be doing right now?",
  "How will you feel about this site visit in 24 hours?",
  "What's your intention for using this site today?",
  "Are you using this site mindfully or as a distraction?",
  "What would happen if you didn't visit this site right now?",
  "Is this site helping you move toward your goals?",
  "How does this site usually make you feel after using it?",
  "What need are you trying to fulfill by visiting this site?",
  "Could you meet this need in a more fulfilling way?",
]

export function getRandomPrompt(): string {
  return prompts[Math.floor(Math.random() * prompts.length)]
}
