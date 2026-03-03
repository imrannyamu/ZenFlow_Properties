import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LaunchScreen.css";

const LaunchScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard"); // change if needed
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="launch-container">
      <img
        src="/logo.png"
        alt="ZenFlow Logo"
        className="rotate-logo"
      />
    </div>
  );
};

export default LaunchScreen;