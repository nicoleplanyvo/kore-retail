import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { API_URL } from '../lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  author: string;
  publishedAt: string;
}

export function BlogListPage() {
  usePageMeta({
    title: 'Blog | KORE — Retail Intelligence Insights',
    description: 'Aktuelle Insights, Strategien und Best Practices für den stationären Einzelhandel. Von KORE — Retail Intelligence.',
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/blog/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.data ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-14">
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">Blog</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Retail Insights
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Strategien, Best Practices und Impulse für den modernen stationären Einzelhandel.
          </p>
        </div>
      </section>

      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          {loading ? (
            <p className="text-kore-mid text-center py-12">Beiträge werden geladen...</p>
          ) : posts.length === 0 ? (
            <p className="text-kore-mid text-center py-12">Noch keine Beiträge veröffentlicht.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-white border border-kore-border hover:border-kore-brass/40 transition-colors"
                >
                  {post.coverImageUrl && (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <p className="label-default mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('de-DE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {' · '}
                      {post.author}
                    </p>
                    <h2 className="font-display text-xl text-kore-ink mb-3 group-hover:text-kore-brass transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-kore-mid line-clamp-3">{post.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-4 text-sm text-kore-brass font-medium">
                      Weiterlesen <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
