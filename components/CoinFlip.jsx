import { useState, useEffect } from "preact/hooks";
import "./coinflip.css"; // Import the CSS file

export function CoinFlip() {
  const [isHeads, setIsHeads] = useState(false);
  const [flipHistory, setFlipHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCoinClick = () => {
    // Disable clicking during the animation
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    const flipResult = Math.random();
    setIsHeads(false);

    setTimeout(() => {
      const result =
        flipResult <= 0.5
          ? "Yes, next game will be shit"
          : "No, you'll win next game";
      setIsHeads(result === "Yes, next game will be shit");

      // Update flip history in local storage after the animation is complete
      setTimeout(() => {
        const newHistory = [...flipHistory, { result, timestamp: new Date() }];
        setFlipHistory(newHistory);
        localStorage.setItem("flipHistory", JSON.stringify(newHistory));
        setIsAnimating(false);
      }, 3000);

      console.log(`it is ${result}`);
    }, 100);
  };

  const handleClearHistory = () => {
    setFlipHistory([]);
    localStorage.removeItem("flipHistory");
  };

  useEffect(() => {
    // Load flip history from local storage on component mount
    const storedHistory = localStorage.getItem("flipHistory");
    if (storedHistory) {
      setFlipHistory(JSON.parse(storedHistory));
    }
  }, []);

  const coinClass = isHeads ? "heads" : "tails";

  // Calculate averages
  const yesCount = flipHistory.filter(
    (result) => result.result === "Yes, next game will be shit"
  ).length;
  const noCount = flipHistory.filter(
    (result) => result.result === "No, you'll win next game"
  ).length;
  const totalFlips = flipHistory.length;

  const yesAverage = totalFlips === 0 ? 0 : (yesCount / totalFlips) * 100;
  const noAverage = totalFlips === 0 ? 0 : (noCount / totalFlips) * 100;

  return (
    <>
      <h1>🤔 ? SHIT TEAM NEXT GAME ? 🤔</h1>
      <div
        id="coin"
        class={`coin ${coinClass}`}
        onClick={handleCoinClick}
        style={{
          transformStyle: "preserve-3d",
          perspective: "800px",
          pointerEvents: isAnimating ? "none" : "auto",
        }}
      >
        <div class="side-a">Yes</div>
        <div class="side-b">No</div>
      </div>

      {/* Display flip history */}
      <div>
        <h2>Flip History:</h2>
        <ul>
          {flipHistory.map((result, index) => (
            <li key={index}>
              {result.result} - {result.timestamp.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Clear history button */}
      <button onClick={handleClearHistory}>Clear History</button>

      {/* Display averages */}
      <div>
        <h2>Averages:</h2>
        <p>Yes, next game will be shit: {yesAverage.toFixed(2)}%</p>
        <p>No, you'll win next game: {noAverage.toFixed(2)}%</p>
      </div>
    </>
  );
}
