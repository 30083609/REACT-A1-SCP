import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SCPDetails() {
  const { id } = useParams();
  const [scp, setScp] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch SCP details
  useEffect(() => {
    fetch("/data/scp-data.json")
      .then((response) => response.json())
      .then((data) => {
        const foundSCP = data.find((scpItem) => scpItem.id === id);
        if (foundSCP) {
          setScp(foundSCP);
        } else {
          setError("SCP not found.");
        }
      })
      .catch(() => setError("Error fetching SCP data"));
  }, [id]);

  // Fetch SCP description content
  useEffect(() => {
    if (scp?.content_file) {
      fetch(`/descriptions/${scp.content_file}`)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          setDescription(doc.body.innerHTML.replace(/src="images\//g, 'src="/images/'));
        })
        .catch(() => setError("Error fetching SCP description"));
    }
  }, [scp]);

  // Loading and error handling
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!scp) return <p className="text-center text-gray-500">Loading SCP details...</p>;

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold text-green-500 mb-4">{scp.subject}</h1>

      <div className="scp-header-box text-center mb-6">
        <p className="text-green-400">Item #: <span className="font-bold">{scp.subject}</span></p>
        <p className="text-green-500">Object Class: <span className="font-bold">{scp.class}</span></p>
      </div>

      {/* SCP Image - Mobile Tap Support */}
      {scp.image && (
        <div
          className={`w-full max-w-2xl p-4 rounded-lg transition ${
            isHovered ? "shadow-green-glow" : "shadow-none"
          }`}
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          onClick={() => isMobile && setIsHovered(!isHovered)}
        >
          <img src={scp.image} alt={scp.subject} className="object-cover w-full rounded-lg shadow-md" />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white p-4 text-center rounded-lg">
              <p className="text-sm">{scp.info}</p>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-2xl bg-[#111] shadow-lg p-6 rounded-lg mt-6 text-green-300">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      <div className="mt-8">
        <Link to="/" className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition">
          ← Back to SCP List
        </Link>
      </div>
    </div>
  );
}

export default SCPDetails;
