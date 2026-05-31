// ==========================================
// src/components/templates/MinimalTemplate.jsx
// ==========================================
// Clean, minimal resume template - Editorial Luxe Edition
// Designed for spacious, premium, high-end editorial look

import SkillBadge from "../SkillBadge";

const MinimalTemplate = ({ resume }) => {
  const { personal, about, skills, education, experience, projects, certifications, achievements, languages } = resume;

  const Section = ({ title, children }) => (
    <section className="mb-10 last:mb-0">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.2em] text-accent whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--color-text-accent)]/20 to-transparent" />
      </div>
      <div className="pl-2">
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-[1123px] bg-[#0c0c0c] font-sans text-main text-[13.5px] px-16 py-14 leading-relaxed relative overflow-hidden bg-grid-metallic selection:bg-accent/20">
      {/* Editorial Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />

      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b border-[var(--color-border-subtle)]">
        <h1 className="font-display text-4xl font-light text-main mb-3 tracking-[0.15em] uppercase">
          {personal?.fullName || "Your Name"}
        </h1>
        {personal?.role && (
          <p className="font-display text-xs text-accent font-semibold tracking-[0.3em] uppercase mb-4">
            {personal.role}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs text-muted font-medium tracking-wide">
          {personal?.email && (
            <a href={`mailto:${personal.email}`} className="hover:text-accent transition-colors flex items-center gap-1.5">
              <span>✉</span> {personal.email}
            </a>
          )}
          {personal?.phone && (
            <span className="flex items-center gap-1.5">
              <span className="text-accent/40">•</span>
              <span>📞 {personal.phone}</span>
            </span>
          )}
          {personal?.location && (
            <span className="flex items-center gap-1.5">
              <span className="text-accent/40">•</span>
              <span>📍 {personal.location}</span>
            </span>
          )}
          {personal?.linkedin && (
            <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <span className="text-accent/40">•</span>
              <span>🔗 LinkedIn</span>
            </a>
          )}
          {personal?.github && (
            <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1.5">
              <span className="text-accent/40">•</span>
              <span>⚡ GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {about && (
        <Section title="Summary">
          <p className="text-muted leading-relaxed max-w-2xl text-[14px] italic font-light">
            {about}
          </p>
        </Section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} color="indigo" />
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <Section title="Experience">
          <div className="space-y-8">
            {experience.map((exp, i) => (
              <div key={i} className="group relative">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="font-semibold text-main text-[15px] tracking-wide">
                    {exp.role}
                  </h3>
                  <div className="text-xs font-semibold text-accent/80 tracking-wider uppercase sm:text-right mt-1 sm:mt-0">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                </div>
                <div className="text-[11.5px] text-muted font-medium tracking-wider uppercase mb-2">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </div>
                <p className="text-muted leading-relaxed font-light whitespace-pre-line text-[13.5px]">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <Section title="Education">
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                  <h3 className="font-semibold text-main text-[14.5px]">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <div className="text-xs font-semibold text-accent/80 tracking-wider uppercase sm:text-right mt-1 sm:mt-0">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11.5px] text-muted font-medium uppercase mb-2">
                  <span>{edu.startDate} – {edu.endDate}</span>
                  {edu.grade && <span className="text-accent/60 tracking-wider">CGPA/Grade: {edu.grade}</span>}
                </div>
                {edu.description && (
                  <p className="text-muted leading-relaxed font-light text-[13px]">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Section title="Projects">
          <div className="space-y-6">
            {projects.map((proj, i) => (
              <div key={i} className="group">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1.5">
                  <h3 className="font-semibold text-main text-[14.5px] flex items-center gap-2">
                    {proj.name}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-accent hover:underline font-light tracking-widest uppercase">
                        ↗ Link
                      </a>
                    )}
                  </h3>
                  <span className="text-[11px] text-muted tracking-wider uppercase font-medium mt-1 sm:mt-0">
                    {proj.date}
                  </span>
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11.5px] text-accent/70 font-semibold tracking-wider uppercase mb-2">
                    {proj.technologies.join(" • ")}
                  </p>
                )}
                {proj.description && (
                  <p className="text-muted leading-relaxed font-light text-[13.5px]">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <Section title="Certifications">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface/30 border border-[var(--color-border-subtle)]">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0 animate-pulse-slow" />
                <div>
                  <h4 className="text-[13.5px] font-semibold text-main leading-tight">{cert.name}</h4>
                  <p className="text-[11.5px] text-muted font-medium mt-0.5">{cert.issuer} • {cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <Section title="Achievements">
          <ul className="space-y-2.5">
            {achievements.map((ach, i) => (
              <li key={i} className="flex items-start gap-3 text-muted leading-relaxed font-light">
                <span className="text-accent text-xs mt-1">✦</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <Section title="Languages">
          <div className="flex flex-wrap gap-5">
            {languages.map((lang, i) => (
              <div key={i} className="flex items-center gap-2 text-muted font-medium text-xs tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                <span>{lang}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default MinimalTemplate;