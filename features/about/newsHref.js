export function newsHref(slug) {
  return `/about/news/${encodeURIComponent(slug)}`;
}

export function newsListHref(page) {
  return page > 1 ? `/about/news?page=${page}` : "/about/news";
}
