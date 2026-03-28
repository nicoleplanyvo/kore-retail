import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { API_URL } from '../lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  author: string;
  publishedAt: string;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageMeta({
    title: post ? `${post.title} | KORE Blog` : 'KORE Blog',
    description: post?.excerpt ?? 'KORE Retail Intelligence Blog',
  });

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/blog/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-14 section-padding">
        <div className="container-default max-w-3xl">
          <p className="text-kore-mid text-center py-12">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="pt-14 section-padding">
        <div className="container-default max-w-3xl text-center py-12">
          <h1 className="font-display text-h2 text-kore-ink mb-4">Beitrag nicht gefunden</h1>
          <Link to="/blog" className="text-kore-brass hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Zurück zum Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14">
      <section className="section-padding">
        <div className="container-default max-w-3xl">
          <Link to="/blog" className="text-kore-brass hover:underline inline-flex items-center gap-1 mb-8">
            <ArrowLeft className="w-4 h-4" /> Zurück zum Blog
          </Link>

          <p className="label-default mb-4">
            {new Date(post.publishedAt).toLocaleDateString('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {' · '}
            {post.author}
          </p>

          <h1 className="font-display text-h1 text-kore-ink mb-4">{post.title}</h1>

          {post.excerpt && (
            <p className="font-display text-lead italic text-kore-mid mb-8">{post.excerpt}</p>
          )}

          <div className="w-12 h-0.5 bg-kore-brass mb-8" />

          {post.coverImageUrl && (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full aspect-video object-cover mb-8"
            />
          )}

          <div
            className="blog-content prose prose-lg max-w-none text-kore-mid"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>
    </div>
  );
}
