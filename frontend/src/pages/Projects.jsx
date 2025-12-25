import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/projects", { name });
      setName("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <Layout>
      <h2>Projects</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {user.role === "tenant_admin" && (
        <form onSubmit={createProject}>
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      )}

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.status}
            {user.role === "tenant_admin" && (
              <button onClick={() => deleteProject(p.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {projects.length === 0 && <p>No projects found</p>}
    </Layout>
  );
}
