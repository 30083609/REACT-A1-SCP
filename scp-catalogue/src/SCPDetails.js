import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SCPDetails() {
  const { id } = useParams();
  const [scp, setScp] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [descHovered, setDescHovered] = useState(false); // Hover effect for description box

  // Fetch SCP details
  useEffect(() => {
    fetch("/data/scp-data.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load SCP data");
        return response.json();
      })
      .then((data) => {
        const foundSCP = data[id.toLowerCase()];
        if (foundSCP) {
          setScp(foundSCP);
        } else {
          setError("SCP not found.");
        }
      })
      .catch((error) => setError(error.message));
  }, [id]);

  // Fetch SCP description content
  useEffect(() => {
    if (scp?.content_file) {
      fetch(`/descriptions/${scp.content_file}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load SCP description");
          return response.text();
        })
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          let content = doc.body.innerHTML;
          content = content.replace(/src="images\//g, 'src="/images/');
          setDescription(content);
        })
        .catch((error) => setError(error.message));
    }
  }, [scp]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!scp) return <p className="text-center text-gray-500">Loading SCP details...</p>;

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center p-10">
      {/* SCP Title */}
      <h1 className="text-5xl font-bold text-green-500 mb-4">{scp.subject}</h1>

      {/* SCP Header Box */}
      <div className="scp-header-box text-center mb-6">
        <p className="text-green-400">
          Item #: <span className="font-bold">{scp.subject}</span>
        </p>
        <p className="text-green-500">
          Object Class: <span className="font-bold">{scp.class}</span>
        </p>
      </div>

      {/* SCP Description Box with Hover Effect */}
      <div
        className={`w-full max-w-2xl bg-[#111] p-6 rounded-lg mt-6 text-green-300 transition-all duration-300 border-2 ${
          descHovered ? "border-green-500 shadow-green-glow scale-105" : "border-transparent shadow-none"
        }`}
        onMouseEnter={() => setDescHovered(true)}
        onMouseLeave={() => setDescHovered(false)}
      >
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link to="/" className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition">
          ← Back to SCP List
        </Link>
      </div>
    </div>
  );
}

export default SCPDetails;
