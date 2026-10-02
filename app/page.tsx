"use client";

import { useMemo, useState } from "react";

type Status = "New lead" | "Follow-up due" | "Waiting" | "Won";

type Customer = {
  id: number;
  name: string;
  business: string;
  type: "Restaurant" | "Service" | "Beauty" | "Other";
  value: number;
  status: Status;
  lastContact: string;
};

const seedCustomers: Customer[] = [
  { id: 1, name: "Sofia Martins", business: "Casa Verde", type: "Restaurant", value: 180, status: "Follow-up due", lastContact: "2 days ago" },
  { id: 2, name: "Miguel Costa", business: "Costa Electric", type: "Service", value: 420, status: "Waiting", lastContact: "3 days ago" },
  { id: 3, name: "Ana Silva", business: "Studio Ana", type: "Beauty", value: 95, status: "New lead", lastContact: "Today" },
  { id: 4, name: "Daniel Rocha", business: "Bistro 24", type: "Restaurant", value: 240, status: "Won", lastContact: "Yesterday" },
  { id: 5, name: "Carla Mendes", business: "Mendes Clean", type: "Service", value: 320, status: "Follow-up due", lastContact: "4 days ago" }
];

const statusClass: Record<Status, string> = {
  "New lead": "badge blue",
  "Follow-up due": "badge red",
  Waiting: "badge amber",
  Won: "badge green"
};

export default function Home() {
  const [customers, setCustomers] = useState(seedCustomers);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesFilter = filter === "All" || c.status === filter;
      const q = search.toLowerCase();
      return matchesFilter && (!q || c.name.toLowerCase().includes(q) || c.business.toLowerCase().includes(q));
    });
  }, [customers, filter, search]);

  const followUps = customers.filter((c) => c.status === "Follow-up due");
  const pipeline = customers.reduce((sum, c) => sum + c.value, 0);
  const won = customers.filter((c) => c.status === "Won").reduce((sum, c) => sum + c.value, 0);

  function generateMessage(customer: Customer) {
    setSelected(customer);
    setMessage(
      `Hi ${customer.name.split(" ")[0]}, just checking in about your ${customer.type === "Restaurant" ? "reservation/request" : "request"}. Were you able to take a look? I'm happy to help if you have any questions.`
    );
  }

  function markWon(id: number) {
    setCustomers((current) => current.map((c) => c.id === id ? { ...c, status: "Won" } : c));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <strong>Recover</strong>
            <span>Customer recovery</span>
          </div>
        </div>
        <nav>
          <a className="nav-item active">Overview</a>
          <a className="nav-item">Customers <span>{customers.length}</span></a>
          <a className="nav-item">Follow-ups <span className="nav-alert">{followUps.length}</span></a>
          <a className="nav-item">Messages</a>
          <a className="nav-item">Analytics</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="eyebrow">Starter</span>
            <strong>14 of 25 leads</strong>
            <div className="progress"><i /></div>
            <small>Upgrade when you are ready.</small>
          </div>
          <div className="profile">
            <div className="avatar">HD</div>
            <div><strong>Houdini Dev</strong><span>Workspace</span></div>
            <button aria-label="Settings">•••</button>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Monday, October 5, 2026</p>
            <h1>Good morning 👋</h1>
            <p className="muted">Here is what needs your attention today.</p>
          </div>
          <button className="primary" onClick={() => setShowAdd(true)}>+ Add customer</button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Follow-ups due</span><strong>{followUps.length}</strong>
            <small className="negative">Needs attention</small>
          </article>
          <article className="stat-card">
            <span>Active pipeline</span><strong>€{pipeline.toLocaleString()}</strong>
            <small className="positive">Potential revenue</small>
          </article>
          <article className="stat-card">
            <span>Recovered</span><strong>€{won.toLocaleString()}</strong>
            <small className="positive">Won this period</small>
          </article>
          <article className="stat-card">
            <span>Response rate</span><strong>68%</strong>
            <small className="positive">+8.4% this month</small>
          </article>
        </section>

        <section className="attention">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Revenue at risk</p>
              <h2>People waiting for a reply</h2>
            </div>
            <button className="ghost" onClick={() => setFilter("Follow-up due")}>View all</button>
          </div>
          <div className="attention-list">
            {followUps.map((customer) => (
              <div className="attention-row" key={customer.id}>
                <div className="avatar">{customer.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="person">
                  <strong>{customer.name}</strong>
                  <span>{customer.business} · {customer.lastContact}</span>
                </div>
                <div className="amount">€{customer.value}</div>
                <button className="secondary" onClick={() => generateMessage(customer)}>Follow up</button>
                <button className="icon-btn" onClick={() => markWon(customer.id)} title="Mark as won">✓</button>
              </div>
            ))}
          </div>
        </section>

        <section className="customers">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Customer pipeline</p>
              <h2>All customers</h2>
            </div>
            <div className="toolbar">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." />
              <select value={filter} onChange={(e) => setFilter(e.target.value as "All" | Status)}>
                <option>All</option>
                <option>New lead</option>
                <option>Follow-up due</option>
                <option>Waiting</option>
                <option>Won</option>
              </select>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Business</th><th>Type</th><th>Value</th><th>Status</th><th>Last contact</th><th /></tr></thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id}>
                    <td><div className="table-person"><div className="avatar small">{customer.name.split(" ").map(n => n[0]).join("")}</div><strong>{customer.name}</strong></div></td>
                    <td>{customer.business}</td>
                    <td>{customer.type}</td>
                    <td><strong>€{customer.value}</strong></td>
                    <td><span className={statusClass[customer.status]}>{customer.status}</span></td>
                    <td>{customer.lastContact}</td>
                    <td><button className="more" onClick={() => generateMessage(customer)}>•••</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><p className="eyebrow">AI message assistant</p><h2>Follow up with {selected.name}</h2></div><button className="close" onClick={() => setSelected(null)}>×</button></div>
            <p className="muted">Ready-to-send message based on this customer&apos;s status.</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="modal-actions">
              <button className="ghost" onClick={() => navigator.clipboard?.writeText(message)}>Copy message</button>
              <a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">Open WhatsApp ↗</a>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><p className="eyebrow">Quick add</p><h2>Add a customer</h2></div><button className="close" onClick={() => setShowModal(false)}>×</button></div>
            <p className="muted">The first MVP uses local demo data. Database persistence comes next.</p>
            <button className="primary full" onClick={() => { setShowModal(false); alert("Customer form is the next MVP module."); }}>Continue</button>
          </div>
        </div>
      )}
    </main>
  );
}
