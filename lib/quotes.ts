interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  {
    text: "The time you enjoy wasting is not wasted time.",
    author: "Bertrand Russell",
  },
  {
    text: "It's not that we have little time, but more that we waste a good deal of it.",
    author: "Seneca",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
  },
  {
    text: "Time is what we want most, but what we use worst.",
    author: "William Penn",
  },
  {
    text: "The bad news is time flies. The good news is you're the pilot.",
    author: "Michael Altshuler",
  },
  {
    text: "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "You will never find time for anything. If you want time, you must make it.",
    author: "Charles Buxton",
  },
  {
    text: "The trouble is, you think you have time.",
    author: "Buddha",
  },
  {
    text: "Time is a created thing. To say 'I don't have time' is to say 'I don't want to.'",
    author: "Lao Tzu",
  },
]

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}
