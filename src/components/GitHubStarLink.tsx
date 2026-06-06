import { useEffect, useState } from 'react';
import { Github, Star } from 'lucide-react';

const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO ?? 'kouame09/Fiiltr';
const REPO_URL = `https://github.com/${GITHUB_REPO}`;
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;
const REFRESH_MS = 5 * 60 * 1000;

function formatStarCount(count: number): string {
  if (count >= 1000) {
    const rounded = count / 1000;
    return rounded >= 10 ? `${Math.round(rounded)}k` : `${rounded.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toLocaleString('fr-FR');
}

export default function GitHubStarLink() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStars = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) return;
        const data = (await response.json()) as { stargazers_count?: number };
        if (!cancelled && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      } catch {
        // Réseau ou rate-limit : on garde la dernière valeur connue
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStars();
    const intervalId = window.setInterval(fetchStars, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Voir le dépôt open source sur GitHub"
      className="cursor-pointer flex items-center gap-1.5 h-9 pl-2.5 pr-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
    >
      <Github className="w-4 h-4 shrink-0" aria-hidden />
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-900 min-w-[2.25rem] justify-center">
        <Star
          className="w-3 h-3 shrink-0 text-amber-500 fill-amber-400"
          aria-hidden
        />
        <span className="tabular-nums leading-none">
          {loading && stars === null ? '…' : stars !== null ? formatStarCount(stars) : '—'}
        </span>
      </span>
    </a>
  );
}
