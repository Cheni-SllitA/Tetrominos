export const fetchHeartPuzzle = async () => {
  try {
    const response = await fetch(
      "https://marcconrad.com/uob/heart/api.php"
    );

    const data = await response.json();

    return data; // return whole object
  } catch (error) {
    console.error("Heart API failed:", error);
    return null;
  }
};