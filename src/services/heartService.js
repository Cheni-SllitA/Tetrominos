export const checkHeart = async () => {
  try {
    const response = await fetch(
      "https://marcconrad.com/uob/heart/"
    );
    const data = await response.json();

    return data === true || data?.alive === true;
  } catch (error) {
    console.error("Heart API failed:", error);
    return false;
  }
};