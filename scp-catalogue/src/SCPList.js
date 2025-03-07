import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SCPList() {
  const [hoveredSCP, setHoveredSCP] = useState(null);
  const [scpData, setScpData] = useState([]);

  useEffect(() => {
    fetch("/data/scp-data.json")
      .then((response) => response.json())
      .then((data) =>
        setScpData(Object.entries(data).map(([key, value]) => ({ id: key, ...value })))
      )
      .catch((error) => console.error("Error loading SCP data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center p-6">

      <h1 className="text-7xl font-extrabold text-green-500 tracking-wide mb-12">
        SCP Catalogue
      </h1>

      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        {scpData.map((scp, index) => (
          <Link
            to={`/scp/${scp.id}`}
            key={scp.id || index}
            className="scp-card w-full max-w-lg transition hover:scale-105"
            onMouseEnter={() => setHoveredSCP(scp.id)}
            onMouseLeave={() => setHoveredSCP(null)}
          >
            <div className="p-6 rounded-lg flex flex-col items-center transition hover:shadow-green-glow">
              {/* SCP Image Hover Effect */}
              {scp.image && (
                <div className="w-full flex justify-center items-center relative">
                  <img
                    src={hoveredSCP === scp.id ? scp.gif : scp.image}
                    alt={scp.subject}
                    className="rounded-lg w-full object-cover shadow-md transition-all max-h-[450px]"
                  />

                  {/* SCP Title & Class Fade in Effect */}
                  <div className={`scp-text-container ${hoveredSCP === scp.id ? "fade-in" : "fade-out"}`}>
                    <h2 className="text-3xl font-bold text-green-500">{scp.subject}</h2>
                    <p className="text-green-400 text-lg">Class: {scp.class}</p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SCPList;
