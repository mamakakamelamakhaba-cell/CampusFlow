
import { useEffect, useState } from "react";
import "./App.css";

const initialStudents = [
  {
    id: "STU001",
    name: "Amara Mokoena",
    age: 21,
    email: "amara@example.com",
    course: "Computer Science",
    status: "Active",
  },
  {
    id: "STU002",
    name: "Thabo Nkosi",
    age: 19,
    email: "thabo@example.com",
    course: "Information Technology",
    status: "Active",
  },
  {
    id: "STU003",
    name: "Lerato Molefe",
    age: 23,
    email: "lerato@example.com",
    course: "Business Management",
    status: "Inactive",
  },
];

const emptyForm = {
  id: "",
  name: "",
  age: "",
  email: "",
  course: "",
  status: "Active",
};

/*
  JavaScript variable declaration demonstration.
  This function demonstrates const, let, and var.
*/
function demonstrateVariables() {
  // const: the variable cannot be reassigned.
  const projectName = "CampusFlow";

  // let: the variable can be reassigned.
  let studentCount = 0;
  studentCount = studentCount + 1;

  // var: an older, function-scoped declaration.
  var projectVersion = 1;

  return {
    projectName,
    studentCount,
    projectVersion,
  };
}

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("campusflow-students");

      if (saved) {
        const parsedStudents = JSON.parse(saved);

        if (Array.isArray(parsedStudents)) {
          // Support older records that do not have an age field.
          return parsedStudents.map((student) => ({
            ...student,
            age: student.age ?? "",
            status: student.status || "Active",
          }));
        }
      }

      return initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Run the variable demonstration when the component mounts.
  useEffect(() => {
    const variableDemo = demonstrateVariables();

    console.log(
      "JavaScript variable demonstration:",
      variableDemo
    );
  }, []);

  // Save student records whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(
        "campusflow-students",
        JSON.stringify(students)
      );
    } catch {
      console.warn(
        "Student records could not be saved in this browser."
      );
    }
  }, [students]);

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveCount = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  // Search by student name, ID, email, or course.
  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      String(student.name || "").toLowerCase().includes(query) ||
      String(student.id || "").toLowerCase().includes(query) ||
      String(student.email || "").toLowerCase().includes(query) ||
      String(student.course || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openAddModal() {
    setEditingId(null);

    const nextNumber =
      students.reduce((maximum, student) => {
        const match = String(student.id || "").match(/^STU(\d+)$/);

        return match
          ? Math.max(maximum, Number(match[1]))
          : maximum;
      }, 0) + 1;

    setForm({
      ...emptyForm,
      id: `STU${String(nextNumber).padStart(3, "0")}`,
    });

    setError("");
    setModalOpen(true);
  }

  function openEditModal(student) {
    setEditingId(student.id);

    setForm({
      id: student.id || "",
      name: student.name || "",
      age: student.age ?? "",
      email: student.email || "",
      course: student.course || "",
      status: student.status || "Active",
    });

    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const id = form.id.trim().toUpperCase();
    const name = form.name.trim();
    const email = form.email.trim();
    const course = form.course.trim();
    const ageText = String(form.age).trim();
    const age = Number(ageText);

    if (!id || !name || !ageText || !email || !course) {
      setError("Please complete all required fields.");
      return;
    }

    if (!Number.isInteger(age) || age < 16 || age > 100) {
      setError("Age must be a whole number between 16 and 100.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const duplicateId = students.some(
      (student) =>
        String(student.id).toUpperCase() === id &&
        student.id !== editingId
    );

    if (duplicateId) {
      setError("That student ID already exists. Please use another.");
      return;
    }

    const duplicateEmail = students.some(
      (student) =>
        String(student.email || "").toLowerCase() ===
          email.toLowerCase() &&
        student.id !== editingId
    );

    if (duplicateEmail) {
      setError("That email address is already registered.");
      return;
    }

    const studentData = {
      id,
      name,
      age,
      email,
      course,
      status: form.status,
    };

    if (editingId !== null) {
      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingId ? studentData : student
        )
      );
    } else {
      setStudents((currentStudents) => [
        ...currentStudents,
        studentData,
      ]);
    }

    closeModal();
  }

  function openDeleteModal(student) {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  }

  function confirmDelete() {
    if (!studentToDelete) return;

    setStudents((currentStudents) =>
      currentStudents.filter(
        (student) => student.id !== studentToDelete.id
      )
    );

    closeDeleteModal();
  }

  function getInitials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">C</div>

          <div>
            <div>
              Campus<span className="brand-accent">Flow</span>
            </div>
            <small>STUDENT MANAGEMENT SYSTEM</small>
          </div>
        </div>

        <div className="topbar-label">STUDENT ADMINISTRATION</div>
      </header>

      <main className="content">
        <section className="welcome">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>
              Student <span>Directory.</span>
            </h1>
            <p className="subtitle">
              Manage student records, courses, and enrollment status
              all in one place.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={openAddModal}
          >
            <span>+</span> Add Student
          </button>
        </section>

        <section className="stats" aria-label="Student statistics">
          <div className="stat-card">
            <span className="stat-label">TOTAL STUDENTS</span>
            <strong>{students.length}</strong>
            <span className="stat-note">
              All registered student records
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">ACTIVE STUDENTS</span>
            <strong>{activeCount}</strong>
            <span className="stat-note">
              Currently active enrollments
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">INACTIVE STUDENTS</span>
            <strong>{inactiveCount}</strong>
            <span className="stat-note">
              Currently inactive enrollments
            </span>
          </div>
        </section>

        <section className="directory">
          <div className="directory-heading">
            <div>
              <h2>All Students</h2>
              <p>View and manage your student information.</p>
            </div>

            <span className="record-count">
              {filteredStudents.length}{" "}
              {filteredStudents.length === 1 ? "RECORD" : "RECORDS"}
            </span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                placeholder="Search by name, ID, email or course..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search students"
              />
            </div>

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter students by enrollment status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active only</option>
              <option value="Inactive">Inactive only</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>STUDENT ID</th>
                  <th>AGE</th>
                  <th>COURSE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-cell">
                        <div className="avatar">
                          {getInitials(student.name)}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <small>{student.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="student-id">{student.id}</span>
                    </td>

                    <td>{student.age || "Not provided"}</td>
                    <td>{student.course}</td>

                    <td>
                      <span
                        className={`status ${
                          student.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="icon-button edit-button"
                          type="button"
                          title={`Edit ${student.name}`}
                          aria-label={`Edit ${student.name}`}
                          onClick={() => openEditModal(student)}
                        >
                          ✎
                        </button>

                        <button
                          className="icon-button delete-button"
                          type="button"
                          title={`Delete ${student.name}`}
                          aria-label={`Delete ${student.name}`}
                          onClick={() => openDeleteModal(student)}
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <strong>No students found</strong>
                      Try a different search or status filter, or add
                      a new student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="table-footer">
            Showing {filteredStudents.length} of {students.length} student
            records
          </p>
        </section>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} CampusFlow Student Management
          </span>
          <span>BUILT FOR BETTER CAMPUS ADMINISTRATION</span>
        </footer>
      </main>

      {/* Add and edit student modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">STUDENT RECORD</p>
                <h2 id="student-modal-title">
                  {editingId !== null ? "Edit Student" : "Add New Student"}
                </h2>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={closeModal}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Student ID *
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    placeholder="e.g. STU004"
                    required
                  />
                </label>

                <label>
                  Full Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </label>

                <label>
                  Age *
                  <input
                    name="age"
                    type="number"
                    min="16"
                    max="100"
                    step="1"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    required
                  />
                </label>

                <label>
                  Enrollment Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <label className="full-field">
                  Email Address *
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                  />
                </label>

                <label className="full-field">
                  Course *
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                  />
                </label>
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button className="primary-button" type="submit">
                  {editingId !== null ? "Save Changes" : "Add Student"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModalOpen && studentToDelete && (
        <div className="modal-backdrop" onClick={closeDeleteModal}>
          <section
            className="modal delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow">CONFIRM ACTION</p>
                <h2 id="delete-modal-title">Delete Student?</h2>
              </div>

              <button
                className="close-button"
                type="button"
                onClick={closeDeleteModal}
                aria-label="Close confirmation"
              >
                ×
              </button>
            </div>

            <p>
              Are you sure you want to delete{" "}
              <strong>{studentToDelete.name}</strong>? This action cannot
              be undone.
            </p>

            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                type="button"
                onClick={confirmDelete}
              >
                Delete Student
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;

