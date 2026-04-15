// jokeService.js
// Fetches jokes from JokeAPI (https://jokeapi.dev)

const JOKE_API_BASE = "https://v2.jokeapi.dev/joke";

// Categories safe for a gaming context
const DEFAULT_CATEGORIES = ["Programming", "Misc", "Pun"];

/**
 * Fetches a single joke from JokeAPI.
 * Handles both "single" and "twopart" joke types returned by the API.
 *
 * @param {string[]} categories - Array of JokeAPI categories to pull from
 * @returns {Promise<{ setup: string, delivery: string, type: string }>}
 */
export const fetchJoke = async (categories = DEFAULT_CATEGORIES) => {
  const categoryString = categories.join(",");
  const url = `${JOKE_API_BASE}/${categoryString}?blacklistFlags=nsfw,racist,sexist,explicit&lang=en`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`JokeAPI responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || "JokeAPI returned an error");
    }

    // Normalise both joke types into a consistent shape
    if (data.type === "twopart") {
      return {
        type: "twopart",
        setup: data.setup,
        delivery: data.delivery,
      };
    }

    // "single" type — treat the whole joke as the setup, no delivery
    return {
      type: "single",
      setup: data.joke,
      delivery: null,
    };
  } catch (error) {
    console.error("[jokeService] Failed to fetch joke:", error);

    // Fallback joke so the UI never breaks if the API is down
    return {
      type: "twopart",
      setup: "Why do programmers prefer dark mode?",
      delivery: "Because light attracts bugs!",
      isFallback: true,
    };
  }
};

/**
 * Fetches a programming-only joke.
 * Useful if you want a more thematic joke for a game over screen.
 */
export const fetchProgrammingJoke = () => fetchJoke(["Programming"]);