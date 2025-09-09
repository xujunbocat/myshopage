import { createDirectus, rest, readItems, authentication } from '@directus/sdk';
import { siteConfig } from '../config/site.ts';

// 创建Directus客户端
export const directus = createDirectus(import.meta.env.DIRECTUS_URL || 'https://your-directus-url')
  .with(rest())
  .with(authentication());

// 使用静态令牌进行身份验证
async function initAuth() {
  try {
    const token = import.meta.env.DIRECTUS_TOKEN;
    if (token) {
      await directus.setToken(token);
    }
  } catch (error) {
    // 保留错误处理但移除详细日志
  }
}

// 初始化身份验证
initAuth();

// 文本缩略函数
function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 获取文章列表
export async function getPosts() {
  try {
    const posts = await directus.request(
      readItems('posts', {
        sort: ['-published_at'],
        limit: 10,
        filter: {
          status: {
            _eq: 'published'
          },
          website: {
            _eq: siteConfig.url
          }
        }
      })
    );

    // 处理文章数据，确保所有必要字段都存在
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      date_created: post.published_at || new Date().toISOString(),
      image: post.image ? `/uploads/${typeof post.image === 'string' ? post.image : post.image.id}` : 'https://placehold.co/800x600?text=No+Image',
      author: post.author ? `${post.author.first_name} ${post.author.last_name || ''}`.trim() : 'Admin',
      excerpt: truncateText(post.description || 'No description available.'),
      content: post.content || '',
      seo: post.seo || {}
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// 获取所有评论（支持语言筛选）
export async function getReviews(options = {}) {
  try {
    const filter = {
      status: {
        _eq: 'published'
      },
      website: {
        _eq: siteConfig.url
      }
    };

    // 如果指定了语言，添加语言筛选
    if (options.language) {
      filter.language = {
        _eq: options.language
      };
    }

    const reviews = await directus.request(
      readItems('reviews', {
        sort: ['sort'],
        limit: options.limit || 100,
        filter
      })
    );
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// 根据Slug获取单个评论（支持语言筛选）
export async function getReviewBySlug(slug, language = null) {
  try {
    if (!slug) {
      return null;
    }
    
    const filter = {
      slug: {
        _eq: slug
      },
      status: {
        _eq: 'published'
      },
      website: {
        _eq: siteConfig.url
      }
    };

    // 如果指定了语言，添加语言筛选
    if (language) {
      filter.language = {
        _eq: language
      };
    }
    
    const review = await directus.request(
      readItems('reviews', {
        filter
      })
    );
    
    return review[0] || null;
  } catch (error) {
    console.error('Error fetching review by slug:', error);
    return null;
  }
}

// 根据ID获取单个列表
export async function getListing(id) {
  try {
    if (!id) {
      return null;
    }
    
    const listing = await directus.request(
      readItems('list', {
        filter: {
          id: {
            _eq: id
          }
        }
      })
    );
    
    return listing[0] || null;
  } catch (error) {
    return null;
  }
}

// 根据Slug获取单篇文章
export async function getPostBySlug(slug) {
  try {
    if (!slug) {
      return null;
    }
    
    const post = await directus.request(
      readItems('posts', {
        filter: {
          slug: {
            _eq: slug
          },
          status: {
            _eq: 'published'
          },
          website: {
            _eq: siteConfig.url
          }
        }
      })
    );
    
    if (!post[0]) return null;

    return {
      id: post[0].id,
      title: post[0].title,
      slug: post[0].slug,
      status: post[0].status,
      date_created: post[0].published_at || new Date().toISOString(),
      image: post[0].image ? `/uploads/${typeof post[0].image === 'string' ? post[0].image : post[0].image.id}` : 'https://placehold.co/800x600?text=No+Image',
      author: post[0].author ? `${post[0].author.first_name} ${post[0].author.last_name || ''}`.trim() : 'Admin',
      excerpt: truncateText(post[0].description || 'No description available.'),
      content: post[0].content || '',
      seo: post[0].seo || {}
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}