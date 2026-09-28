// ==========================================
// src/pages/InterviewPrep.jsx
// ==========================================

import { motion } from "framer-motion";
import { ArrowRight, Bot, ChevronDown, Clock3, Mic, MessageCircle, Sparkles, TerminalSquare, Video, Zap } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const sessionTypes = [
  {
    title: "Behavioral Mock",
    description: "Master soft skills and situational questions.",
    icon: MessageCircle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Technical Deep Dive",
    description: "Architecture, systems, and domain knowledge.",
    icon: TerminalSquare,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Live Coding",
    description: "Data structures, algorithms, and real-time solving.",
    icon: Video,
    color: "text-tertiary",
    bg: "bg-tertiary/10",
  },
];

const keywordTags = ["Leadership", "Collaboration", "Conflict", "Resolution", "Strategy"];
const feedbackItems = [
  { label: "Confidence Score", value: "82%", width: "82%" },
  { label: "Clarity & Pacing", value: "75%", width: "75%" },
];

const InterviewPrep = () => {
  return (
    <DashboardLayout title="Interview Prep">
      <div className="grid gap-xl lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">
        <div className="space-y-xl">
          <section className="space-y-sm">
            <h2 className="font-display text-headline-lg text-on-surface">Interview Preparation</h2>
            <p className="max-w-2xl text-body-md text-on-surface-variant">Master your next career move with AI-driven mock sessions.</p>
          </section>

          <section className="grid gap-lg md:grid-cols-3">
            {sessionTypes.map((session, index) => (
              <motion.button
                key={session.title}
                type="button"
                whileHover={{ y: -4 }}
                className="premium-card flex min-h-[220px] flex-col gap-md p-lg text-left"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${session.bg} ${session.color}`}>
                  <session.icon size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface">{session.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">{session.description}</p>
                </div>
                <div className={`mt-auto flex items-center gap-2 font-label-md ${session.color}`}>
                  Start Session <ArrowRight size={16} />
                </div>
              </motion.button>
            ))}
          </section>

          <section className="grid gap-lg xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.7fr)]">
            <div className="premium-card p-lg">
              <div className="mb-lg flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-md py-2 text-label-md text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  LIVE SESSION: BEHAVIORAL
                </div>
                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2 text-label-md text-primary">04:22</div>
              </div>

              <div className="flex flex-col items-center gap-lg py-8 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high shadow-[0_0_40px_rgba(173,198,255,0.12)]">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
                    <Bot size={42} />
                  </div>
                </div>
                <p className="max-w-2xl text-body-md text-on-surface">
                  "Tell me about a time you resolved a conflict with a stakeholder under high pressure."
                </p>
                <p className="text-body-md italic text-on-surface-variant">Use the STAR method to structure your response.</p>
              </div>
            </div>

            <div className="premium-card space-y-lg p-lg">
              <div className="flex items-center gap-2 text-headline-md text-on-surface">
                <Sparkles size={20} className="text-primary" /> Live Feedback
              </div>

              <div className="space-y-5">
                {feedbackItems.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">{item.label}</span>
                      <span className="font-semibold text-on-surface">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="h-full rounded-full bg-primary" style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-headline-md text-on-surface">
                  <Mic size={20} className="text-secondary" /> Clarity & Pacing
                </div>
                <p className="text-body-md text-on-surface-variant">Your pace is slightly fast. Take a breath between sentences.</p>
                <div className="flex h-32 items-center justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-on-surface-variant">
                    <span className="text-primary">75%</span>
                    <ChevronDown size={16} className="rotate-[-90deg]" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Detected Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {keywordTags.map((tag, index) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${index < 3 ? "border-primary/25 bg-primary/10 text-primary" : "border-outline-variant bg-surface-container-low text-on-surface-variant"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-lg">
          <div className="premium-card p-lg">
            <div className="mb-lg flex items-center justify-between">
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Past Performance</h3>
              <button type="button" className="text-label-md text-primary">View All</button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                <p className="text-body-sm text-on-surface-variant">Frontend Architect Role</p>
                <div className="mt-1 flex items-center gap-2 text-on-surface">
                  <Clock3 size={14} className="text-primary" />
                  <span>May 12 • Score: 92/100</span>
                </div>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                <p className="text-body-sm text-on-surface-variant">Product Strategy Session</p>
                <div className="mt-1 flex items-center gap-2 text-on-surface">
                  <Clock3 size={14} className="text-secondary" />
                  <span>Apr 30 • Score: 86/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-lg">
            <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Quick Actions</h3>
            <div className="mt-4 grid gap-3">
              <button type="button" className="btn-secondary flex items-center justify-between">
                <span>Generate questions</span>
                <Sparkles size={16} />
              </button>
              <button type="button" className="btn-secondary flex items-center justify-between">
                <span>Practice with AI</span>
                <Zap size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
