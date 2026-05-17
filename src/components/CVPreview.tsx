import { CVData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Github, Globe, Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  data: CVData;
  id?: string;
}

export default function CVPreview({ data, id }: Props) {
  const { personalInfo, settings, profileSummary, experiences, skills, awards, projects, certifications, education, languages, interests, recommendations } = data;
  const layout = settings?.headerLayout || 'center';
  const photoStyle = settings?.photoStyle || 'circle';
  const fontFamily = settings?.fontFamily || 'serif';

  const renderPhoto = () => {
    if (!personalInfo.profilePicture) return null;
    return (
      <img
        src={personalInfo.profilePicture}
        alt={personalInfo.fullName}
        className={cn(
          "shrink-0 object-cover border border-gray-100 bg-gray-50",
          photoStyle === 'circle' ? "rounded-full" : "rounded-2xl",
          layout === 'center' ? "w-24 h-24 mx-auto mb-3" : "w-28 h-28"
        )}
      />
    );
  };

  const renderContactInfo = (isRow = false) => {
    const items = [
      { value: personalInfo.email, icon: Mail },
      { value: personalInfo.phone, icon: Phone },
      { value: personalInfo.location, icon: MapPin },
      { value: personalInfo.website, icon: Globe },
      { value: personalInfo.linkedin, icon: Linkedin },
      { value: personalInfo.github, icon: Github },
      { value: personalInfo.twitter, icon: Twitter },
      { value: personalInfo.facebook, icon: Facebook },
      { value: personalInfo.instagram, icon: Instagram },
    ].filter(item => item.value);

    // layout 'left' = photo left, coords right
    // layout 'right' = coords left, photo right
    const isCenter = layout === 'center' || !isRow;
    const isCoordsOnRight = layout === 'left' && isRow;
    const isCoordsOnLeft = layout === 'right' && isRow;

    return (
      <div className={cn(
        "text-[8.5pt] flex flex-wrap gap-x-3 gap-y-1",
        isCenter ? "justify-center items-center" : 
        isCoordsOnRight ? "flex-col items-end text-right" : "flex-col items-start text-left"
      )}>
        {items.map((item, idx) => (
          <div key={idx} className={cn(
            "flex items-center gap-1.5",
            isCoordsOnRight ? "flex-row-reverse" : "flex-row"
          )}>
            <item.icon className="w-3 h-3 text-gray-400 shrink-0 self-center" />
            <span className="leading-none">{item.value}</span>
            {(isCenter && idx < items.length - 1) && <span className="text-gray-200 ml-1">|</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      id={id}
      className={cn(
        "w-[210mm] min-h-[297mm] bg-white text-[#333] shadow-2xl p-[15mm] flex flex-col leading-tight",
        fontFamily === 'sans' ? 'font-sans' : fontFamily === 'mono' ? 'font-mono' : 'font-serif',
        "mx-auto my-0 box-border text-[11pt]"
      )}
      style={{ wordBreak: 'break-word' }}
    >
      {/* Header */}
      <header className={cn(
        "mb-6",
        layout === 'center' ? "text-center" : "flex justify-between items-start"
      )}>
        {layout === 'center' ? (
          <>
            {renderPhoto()}
            <h1 className="text-2xl font-bold text-black uppercase tracking-wide leading-none">
              {personalInfo.fullName || "NOM ICI"}
            </h1>
            <p className="text-[12pt] font-medium mt-1">
              {personalInfo.jobTitle || "Titre du Poste"}
            </p>
            <div className="mt-2">
              {renderContactInfo()}
            </div>
          </>
        ) : layout === 'left' ? (
          <>
            <div className="flex gap-5 items-center">
              {renderPhoto()}
              <div className="text-left">
                <h1 className="text-2xl font-bold text-black uppercase tracking-wide leading-none">
                  {personalInfo.fullName || "NOM ICI"}
                </h1>
                <p className="text-[12pt] font-medium mt-1">
                  {personalInfo.jobTitle || "Titre du Poste"}
                </p>
              </div>
            </div>
            <div className="mt-1">
              {renderContactInfo(true)}
            </div>
          </>
        ) : (
          <>
            <div className="mt-1">
              {renderContactInfo(true)}
            </div>
            <div className="flex gap-5 items-center text-right">
              <div className="text-right">
                <h1 className="text-2xl font-bold text-black uppercase tracking-wide leading-none">
                  {personalInfo.fullName || "NOM ICI"}
                </h1>
                <p className="text-[12pt] font-medium mt-1">
                  {personalInfo.jobTitle || "Titre du Poste"}
                </p>
              </div>
              {renderPhoto()}
            </div>
          </>
        )}
      </header>

      {/* Profile Summary */}
      {profileSummary && (
        <section className="mb-4">
          <SectionHeader title="RÉSUMÉ DU PROFIL" />
          <p className="text-[10pt] leading-relaxed text-left mt-1 italic md:not-italic">
            {profileSummary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="EXPÉRIENCE" />
          <div className="mt-1 space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-[10pt]">
                <div className="flex justify-between items-baseline font-bold italic md:not-italic">
                  <span className="text-[10.5pt]">
                    {exp.role}{exp.company && ` chez ${exp.company}`}{exp.location && `, ${exp.location}`}
                  </span>
                  <span className="text-[9pt] shrink-0 ml-2">
                    {exp.startDate}{exp.endDate && ` – ${exp.endDate}`}
                  </span>
                </div>
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[9.5pt]">
                  {exp.description.filter(d => d.trim()).map((bullet, idx) => (
                    <li key={idx} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills / Awards */}
      {(skills.length > 0 || awards) && (
        <section className="mb-4">
          <SectionHeader title="COMPÉTENCES / DISTINCTIONS" />
          <div className="mt-1 space-y-1 text-[10pt]">
            {skills.map((skillGroup) => (
              <div key={skillGroup.id} className="flex gap-1">
                <span className="font-bold shrink-0">{skillGroup.category}:</span>
                <span>{skillGroup.items}</span>
              </div>
            ))}
            {awards && (
              <div className="flex gap-1">
                <span className="font-bold shrink-0">Prix/Awards:</span>
                <span>{awards}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="PROJETS" />
          <div className="mt-1 space-y-3 font-serif">
            {projects.map((proj) => (
              <div key={proj.id} className="text-[10pt]">
                <div className="flex justify-between items-baseline italic md:not-italic">
                  <span className="font-bold text-[10.5pt]">
                    {proj.name} {proj.techStack && <span className="font-normal"> | {proj.techStack}</span>}
                  </span>
                  <span className="text-[9pt] font-bold shrink-0 ml-2">{proj.date}</span>
                </div>
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[9.5pt]">
                  {proj.description.filter(d => d.trim()).map((bullet, idx) => (
                    <li key={idx} className="pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="CERTIFICATIONS" />
          <div className="mt-1 space-y-1 text-[10pt]">
            {certifications.map((cert) => (
              <div key={cert.id}>
                {cert.name}{cert.issuer && `, ${cert.issuer}`}{cert.year && ` - ${cert.year}`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="FORMATION" />
          <div className="mt-1 space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div className="text-[10pt] leading-snug">
                  <p className="font-bold italic md:not-italic">{edu.degree}</p>
                  <p className="italic text-[9.5pt]">{edu.school}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold text-[9pt]">{edu.year}</p>
                  <p className="text-[9pt] italic">{edu.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Interests */}
      {((languages && languages.length > 0) || interests) && (
        <section className="mb-4">
          <SectionHeader title="LANGUES & CENTRES D'INTÉRÊT" />
          <div className="mt-1 space-y-1 text-[10pt]">
            {languages && languages.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                <span className="font-bold shrink-0">Langues:</span>
                {languages.map((lang, idx) => (
                  <span key={lang.id}>{lang.name} ({lang.level}){idx < languages.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
            {interests && (
              <div className="flex gap-1">
                <span className="font-bold shrink-0">Passions:</span>
                <span>{interests}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <section className="mb-4">
          <SectionHeader title="RECOMMANDATIONS" />
          <div className="mt-1 grid grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="text-[9.5pt] leading-tight">
                <p className="font-bold italic md:not-italic">{rec.name}</p>
                <p className="text-[9pt]">{rec.role}, {rec.company}</p>
                <p className="text-[9pt] text-gray-600 italic">{rec.contact}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-t border-black pt-1 mt-2 mb-0.5">
      <h2 className="text-[11pt] font-bold tracking-wider leading-none">{title}</h2>
    </div>
  );
}
