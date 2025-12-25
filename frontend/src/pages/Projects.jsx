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
  const [editingProjectId, setEditingProjectId] = useState(null);
    const [editProjectForm, setEditProjectForm] = useState({
    name: "",
    description: "",
    status: "active",
    });

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
    const startEditProject = (project) => {
        setEditingProjectId(project.id);
        setEditProjectForm({
            name: project.name,
            description: project.description || "",
            status: project.status,
        });
    };
    const updateProject = async (projectId) => {
    await api.put(`/projects/${projectId}`, {
        name: editProjectForm.name,
        description: editProjectForm.description,
        status: editProjectForm.status,
    });
    setEditingProjectId(null);
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

    <ul style={{ listStyle: "none", padding: 0 }}>
    {projects.map((p) => (
        <li
        key={p.id}
        style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "15px",
        }}
        >
        {/* -------- EDIT MODE -------- */}
        {editingProjectId === p.id ? (
            <>
            <h4>Edit Project</h4>

            <div style={{ marginBottom: "10px" }}>
                <label>Name</label>
                <input
                style={{ width: "100%" }}
                value={editProjectForm.name}
                onChange={(e) =>
                    setEditProjectForm({
                    ...editProjectForm,
                    name: e.target.value,
                    })
                }
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Description</label>
                <textarea
                style={{ width: "100%" }}
                value={editProjectForm.description}
                onChange={(e) =>
                    setEditProjectForm({
                    ...editProjectForm,
                    description: e.target.value,
                    })
                }
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Status</label>
                <select
                style={{ width: "100%" }}
                value={editProjectForm.status}
                onChange={(e) =>
                    setEditProjectForm({
                    ...editProjectForm,
                    status: e.target.value,
                    })
                }
                >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="completed">Completed</option>
                </select>
            </div>

            <button onClick={() => updateProject(p.id)}>Save</button>{" "}
            <button onClick={() => setEditingProjectId(null)}>Cancel</button>
            </>
        ) : (
            <>
            {/* -------- VIEW MODE -------- */}
            <h4>{p.name}</h4>

            {p.description && <p>{p.description}</p>}

            <p>
                <b>Status:</b> {p.status}
            </p>

            <p>
                <b>Created:</b>{" "}
                {new Date(p.createdAt).toLocaleDateString()}
            </p>

            <p>
                <b>Updated:</b>{" "}
                {new Date(p.updatedAt).toLocaleDateString()}
            </p>

            <a href={`/projects/${p.id}`}>View Tasks</a>

            {user.role === "tenant_admin" && (
                <div style={{ marginTop: "10px" }}>
                <button onClick={() => startEditProject(p)}>Edit</button>{" "}
                <button onClick={() => deleteProject(p.id)}>Delete</button>
                </div>
            )}
            </>
        )}
        </li>
    ))}
    </ul>


      {projects.length === 0 && <p>No projects found</p>}
    </Layout>
  );
}
