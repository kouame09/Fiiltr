import React from 'react';
import { CVData, Experience, Project, SkillGroup, Certification, Education } from '../types';
import { 
  Settings,
  Image as ImageIcon,
  Layout,
  User, 
  Briefcase, 
  Cpu, 
  Award, 
  FolderGit2, 
  CheckCircle, 
  GraduationCap, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronUp,
  AlignLeft,
  Languages,
  Type,
  Heart,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: CVData;
  onChange: (data: CVData) => void;
}

export default function CVEditor({ data, onChange }: Props) {
  const [activeSection, setActiveSection] = React.useState<string | null>('personal');

  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateField = (field: keyof CVData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateSettings = (field: keyof CVData['settings'], value: any) => {
    onChange({
      ...data,
      settings: { ...data.settings, [field]: value }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('profilePicture', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (section: keyof CVData, newItem: any) => {
    onChange({
      ...data,
      [section]: [...(data[section] as any[]), newItem]
    });
  };

  const removeItem = (section: keyof CVData, id: string) => {
    onChange({
      ...data,
      [section]: (data[section] as any[]).filter((item: any) => item.id !== id)
    });
  };

  const updateItem = (section: keyof CVData, id: string, updates: any) => {
    onChange({
      ...data,
      [section]: (data[section] as any[]).map((item: any) => 
        item.id === id ? { ...item, ...updates } : item
      )
    });
  };

  return (
    <div className="p-8 pb-32 space-y-6">
      {/* Settings section */}
      <CollapsibleSection
        title="Configuration & Design"
        icon={<Settings className="w-4 h-4" />}
        isOpen={activeSection === 'settings'}
        onToggle={() => setActiveSection(activeSection === 'settings' ? null : 'settings')}
      >
        <div className="space-y-6 pt-4">
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
              <Layout className="w-3 h-3" /> Disposition de l'En-tête
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'center', label: 'Centré' },
                { id: 'left', label: 'G.: Photo / D.: Coordonnées' },
                { id: 'right', label: 'G.: Coordonnées / D.: Photo' }
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => updateSettings('headerLayout', layout.id)}
                  className={`cursor-pointer px-3 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                    data.settings?.headerLayout === layout.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Style de Photo
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'circle', label: 'Cercle' },
                  { id: 'rounded', label: 'Arrondi léger' }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => updateSettings('photoStyle', style.id)}
                    className={`cursor-pointer flex-1 px-3 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                      data.settings?.photoStyle === style.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Photo de Profil
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-all text-center uppercase tracking-widest leading-none">
                    {data.personalInfo.profilePicture ? 'Changer' : 'Télécharger'}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
                {data.personalInfo.profilePicture && (
                  <button
                    onClick={() => updatePersonalInfo('profilePicture', '')}
                    className="cursor-pointer p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
              <Type className="w-3 h-3" /> Police d'Écriture
            </label>
            <div className="flex gap-2">
              {[
                { id: 'serif', label: 'Serif' },
                { id: 'sans', label: 'Sans Serif' },
                { id: 'mono', label: 'Mono' }
              ].map((font) => (
                <button
                  key={font.id}
                  onClick={() => updateSettings('fontFamily', font.id)}
                  className={`cursor-pointer flex-1 px-3 py-2 text-[10px] font-bold rounded-xl border transition-all ${
                    (data.settings?.fontFamily || 'serif') === font.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {font.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Personal Info */}
      <CollapsibleSection
        title="Informations Personnelles"
        icon={<User className="w-4 h-4" />}
        isOpen={activeSection === 'personal'}
        onToggle={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
          <Input label="Nom Complet" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} />
          <Input label="Titre du Poste" value={data.personalInfo.jobTitle} onChange={(v) => updatePersonalInfo('jobTitle', v)} />
          <Input label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
          <Input label="Téléphone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} />
          <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v) => updatePersonalInfo('linkedin', v)} />
          <Input label="Github" value={data.personalInfo.github || ''} onChange={(v) => updatePersonalInfo('github', v)} />
          <Input label="Twitter / X" value={data.personalInfo.twitter || ''} onChange={(v) => updatePersonalInfo('twitter', v)} />
          <Input label="Site Web" value={data.personalInfo.website || ''} onChange={(v) => updatePersonalInfo('website', v)} />
          <Input label="Facebook" value={data.personalInfo.facebook || ''} onChange={(v) => updatePersonalInfo('facebook', v)} />
          <Input label="Instagram" value={data.personalInfo.instagram || ''} onChange={(v) => updatePersonalInfo('instagram', v)} />
          <Input label="Ville / Pays" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} />
        </div>
      </CollapsibleSection>

      {/* Profile Summary */}
      <CollapsibleSection
        title="Résumé du Profil"
        icon={<AlignLeft className="w-4 h-4" />}
        isOpen={activeSection === 'summary'}
        onToggle={() => setActiveSection(activeSection === 'summary' ? null : 'summary')}
      >
        <div className="pt-4">
          <textarea
            className="w-full p-4 border border-gray-100 bg-gray-50/50 rounded-xl focus:border-black outline-none transition-all h-32 text-sm leading-relaxed"
            placeholder="Décrivez brièvement votre parcours..."
            value={data.profileSummary}
            onChange={(e) => updateField('profileSummary', e.target.value)}
          />
        </div>
      </CollapsibleSection>

      {/* Experience */}
      <CollapsibleSection
        title="Expériences Professionnelles"
        icon={<Briefcase className="w-4 h-4" />}
        isOpen={activeSection === 'experience'}
        onToggle={() => setActiveSection(activeSection === 'experience' ? null : 'experience')}
      >
        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {data.experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4 relative group"
              >
                <button
                  onClick={() => removeItem('experiences', exp.id)}
                  className="cursor-pointer absolute top-4 right-4 p-2 text-gray-300 hover:text-black hover:bg-white rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mr-10">
                  <Input label="Poste" value={exp.role} onChange={(v) => updateItem('experiences', exp.id, { role: v })} />
                  <Input label="Entreprise" value={exp.company} onChange={(v) => updateItem('experiences', exp.id, { company: v })} />
                  <Input label="Lieu" value={exp.location} onChange={(v) => updateItem('experiences', exp.id, { location: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input label="Début" value={exp.startDate} onChange={(v) => updateItem('experiences', exp.id, { startDate: v })} />
                    <Input label="Fin" value={exp.endDate} onChange={(v) => updateItem('experiences', exp.id, { endDate: v })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points clés</label>
                  <textarea
                    className="w-full p-4 border border-gray-100 bg-white rounded-xl text-sm h-28 focus:border-black outline-none transition-all placeholder:text-gray-300"
                    value={exp.description.join('\n')}
                    onChange={(e) => updateItem('experiences', exp.id, { description: e.target.value.split('\n') })}
                    placeholder="Un point par ligne..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('experiences', { id: Math.random().toString(), role: '', company: '', location: '', startDate: '', endDate: '', description: [] })}
            className="cursor-pointer w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-widest uppercase"
          >
            <Plus className="w-4 h-4" /> Ajouter Experience
          </button>
        </div>
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection
        title="Compétences"
        icon={<Cpu className="w-4 h-4" />}
        isOpen={activeSection === 'skills'}
        onToggle={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
      >
        <div className="space-y-4 pt-4">
          <AnimatePresence>
            {data.skills.map((skill) => (
              <motion.div key={skill.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input label="Catégorie" value={skill.category} onChange={(v) => updateItem('skills', skill.id, { category: v })} />
                </div>
                <div className="flex-[2]">
                  <Input label="Compétences" value={skill.items} onChange={(v) => updateItem('skills', skill.id, { items: v })} />
                </div>
                <button
                  onClick={() => removeItem('skills', skill.id)}
                  className="cursor-pointer p-3 text-gray-300 hover:text-black transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('skills', { id: Math.random().toString(), category: '', items: '' })}
            className="cursor-pointer w-full py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-[10px] tracking-widest uppercase"
          >
            <Plus className="w-3 h-3" /> Ajouter Catégorie
          </button>
        </div>
      </CollapsibleSection>

       {/* Awards */}
       <CollapsibleSection
        title="Distinctions / Awards"
        icon={<Award className="w-4 h-4" />}
        isOpen={activeSection === 'awards'}
        onToggle={() => setActiveSection(activeSection === 'awards' ? null : 'awards')}
      >
        <div className="pt-4">
          <textarea
            className="w-full p-4 border border-gray-100 bg-gray-50/50 rounded-xl text-sm h-24 focus:border-black outline-none transition-all placeholder:text-gray-300"
            placeholder="Prix reçus, distinctions..."
            value={data.awards}
            onChange={(e) => updateField('awards', e.target.value)}
          />
        </div>
      </CollapsibleSection>

      {/* Projects */}
      <CollapsibleSection
        title="Projets"
        icon={<FolderGit2 className="w-4 h-4" />}
        isOpen={activeSection === 'projects'}
        onToggle={() => setActiveSection(activeSection === 'projects' ? null : 'projects')}
      >
         <div className="space-y-6 pt-4">
          <AnimatePresence>
            {data.projects.map((proj) => (
              <motion.div
                key={proj.id}
                className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4 relative"
              >
                <button
                  onClick={() => removeItem('projects', proj.id)}
                  className="cursor-pointer absolute top-4 right-4 p-2 text-gray-300 hover:text-black transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mr-10">
                  <Input label="Nom du Projet" value={proj.name} onChange={(v) => updateItem('projects', proj.id, { name: v })} />
                  <Input label="Date" value={proj.date} onChange={(v) => updateItem('projects', proj.id, { date: v })} />
                  <div className="col-span-2">
                    <Input label="Technologies, Outils, Méthodes, Mot clé" value={proj.keywords} onChange={(v) => updateItem('projects', proj.id, { keywords: v })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea
                    className="w-full p-4 border border-gray-100 bg-white rounded-xl text-sm h-28 focus:border-black outline-none transition-all placeholder:text-gray-300"
                    value={proj.description.join('\n')}
                    onChange={(e) => updateItem('projects', proj.id, { description: e.target.value.split('\n') })}
                    placeholder="Un point par ligne..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('projects', { id: Math.random().toString(), name: '', keywords: '', date: '', description: [] })}
            className="cursor-pointer w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-widest uppercase"
          >
            <Plus className="w-4 h-4" /> Ajouter Projet
          </button>
        </div>
      </CollapsibleSection>

      {/* Certifications */}
      <CollapsibleSection
        title="Certifications"
        icon={<CheckCircle className="w-4 h-4" />}
        isOpen={activeSection === 'certs'}
        onToggle={() => setActiveSection(activeSection === 'certs' ? null : 'certs')}
      >
         <div className="space-y-4 pt-4">
          <AnimatePresence>
            {data.certifications.map((cert) => (
              <motion.div key={cert.id} className="flex gap-4 items-end">
                <div className="flex-[2]">
                  <Input label="Certification" value={cert.name} onChange={(v) => updateItem('certifications', cert.id, { name: v })} />
                </div>
                <div className="flex-1">
                  <Input label="Organisme" value={cert.issuer} onChange={(v) => updateItem('certifications', cert.id, { issuer: v })} />
                </div>
                <div className="w-24">
                  <Input label="Année" value={cert.year} onChange={(v) => updateItem('certifications', cert.id, { year: v })} />
                </div>
                <button
                  onClick={() => removeItem('certifications', cert.id)}
                  className="cursor-pointer p-3 text-gray-300 hover:text-black transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('certifications', { id: Math.random().toString(), name: '', issuer: '', year: '' })}
            className="cursor-pointer w-full py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-[10px] tracking-widest uppercase"
          >
            <Plus className="w-3 h-3" /> Ajouter Certification
          </button>
        </div>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection
        title="Éducation"
        icon={<GraduationCap className="w-4 h-4" />}
        isOpen={activeSection === 'edu'}
        onToggle={() => setActiveSection(activeSection === 'edu' ? null : 'edu')}
      >
        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {data.education.map((edu) => (
              <motion.div
                key={edu.id}
                className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4 relative"
              >
                <button
                  onClick={() => removeItem('education', edu.id)}
                  className="cursor-pointer absolute top-4 right-4 p-2 text-gray-300 hover:text-black transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mr-10">
                  <Input label="Diplôme" value={edu.degree} onChange={(v) => updateItem('education', edu.id, { degree: v })} />
                  <Input label="Année" value={edu.year} onChange={(v) => updateItem('education', edu.id, { year: v })} />
                  <Input label="Établissement" value={edu.school} onChange={(v) => updateItem('education', edu.id, { school: v })} />
                  <Input label="Lieu" value={edu.location} onChange={(v) => updateItem('education', edu.id, { location: v })} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('education', { id: Math.random().toString(), degree: '', school: '', location: '', year: '' })}
            className="cursor-pointer w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-widest uppercase"
          >
            <Plus className="w-4 h-4" /> Ajouter Formation
          </button>
        </div>
      </CollapsibleSection>

      {/* Languages */}
      <CollapsibleSection
        title="Langues"
        icon={<Languages className="w-4 h-4" />}
        isOpen={activeSection === 'languages'}
        onToggle={() => setActiveSection(activeSection === 'languages' ? null : 'languages')}
      >
        <div className="space-y-4 pt-4">
          <AnimatePresence>
            {data.languages?.map((lang) => (
              <motion.div key={lang.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Input label="Langue" value={lang.name} onChange={(v) => updateItem('languages', lang.id, { name: v })} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">Niveau</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50/30 rounded-xl text-sm focus:border-black outline-none transition-all appearance-none cursor-pointer"
                    value={lang.level}
                    onChange={(e) => updateItem('languages', lang.id, { level: e.target.value })}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Maternel">Langue Maternelle</option>
                    <option value="C2 (Expérimenté)">C2 - Maîtrise</option>
                    <option value="C1 (Avancé)">C1 - Autonome</option>
                    <option value="B2 (Intermédiaire supérieur)">B2 - Avancé</option>
                    <option value="B1 (Intermédiaire)">B1 - Seuil</option>
                    <option value="A2 (Élémentaire)">A2 - Survie</option>
                    <option value="A1 (Débutant)">A1 - Introductif</option>
                    <option value="Professionnel">Professionnel</option>
                    <option value="Basique">Notions de base</option>
                  </select>
                </div>
                <button
                  onClick={() => removeItem('languages', lang.id)}
                  className="cursor-pointer p-3 text-gray-300 hover:text-black transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('languages', { id: Math.random().toString(), name: '', level: '' })}
            className="cursor-pointer w-full py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-[10px] tracking-widest uppercase"
          >
            <Plus className="w-3 h-3" /> Ajouter Langue
          </button>
        </div>
      </CollapsibleSection>

      {/* Interests */}
      <CollapsibleSection
        title="Passions / Centres d'intérêt"
        icon={<Heart className="w-4 h-4" />}
        isOpen={activeSection === 'interests'}
        onToggle={() => setActiveSection(activeSection === 'interests' ? null : 'interests')}
      >
        <div className="pt-4">
          <textarea
            className="w-full p-4 border border-gray-100 bg-gray-50/50 rounded-xl text-sm h-24 focus:border-black outline-none transition-all placeholder:text-gray-300"
            placeholder="Vos passions, loisirs..."
            value={data.interests}
            onChange={(e) => updateField('interests', e.target.value)}
          />
        </div>
      </CollapsibleSection>

      {/* Recommendations */}
      <CollapsibleSection
        title="Recommandations"
        icon={<Users className="w-4 h-4" />}
        isOpen={activeSection === 'recommendations'}
        onToggle={() => setActiveSection(activeSection === 'recommendations' ? null : 'recommendations')}
      >
        <div className="space-y-6 pt-4">
          <AnimatePresence>
            {data.recommendations?.map((rec) => (
              <motion.div
                key={rec.id}
                className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4 relative"
              >
                <button
                  onClick={() => removeItem('recommendations', rec.id)}
                  className="cursor-pointer absolute top-4 right-4 p-2 text-gray-300 hover:text-black transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mr-10">
                  <Input label="Nom" value={rec.name} onChange={(v) => updateItem('recommendations', rec.id, { name: v })} />
                  <Input label="Poste" value={rec.role} onChange={(v) => updateItem('recommendations', rec.id, { role: v })} />
                  <Input label="Entreprise" value={rec.company} onChange={(v) => updateItem('recommendations', rec.id, { company: v })} />
                  <Input label="Contact (Email/Tél)" value={rec.contact} onChange={(v) => updateItem('recommendations', rec.id, { contact: v })} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={() => addItem('recommendations', { id: Math.random().toString(), name: '', role: '', company: '', contact: '' })}
            className="cursor-pointer w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-all font-semibold text-xs tracking-widest uppercase"
          >
            <Plus className="w-4 h-4" /> Ajouter Recommandation
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white transition-all">
      <button
        onClick={onToggle}
        className="cursor-pointer w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 text-black rounded-lg">
            {icon}
          </div>
          <span className="font-bold text-sm text-gray-900 tracking-tight uppercase">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1">{label}</label>
      <input
        type="text"
        className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50/30 rounded-xl text-sm focus:border-black outline-none transition-all placeholder:text-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Saisir ${label.toLowerCase()}...`}
      />
    </div>
  );
}
