export function PersonJsonLd() {
  const value = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sergey Kudelin",
    url: "https://sergeykudelin.com",
    jobTitle: "Growth Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.linkedin.com/in/sergeykudelin",
      "https://github.com/Seryozh",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }}
    />
  );
}
