import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  schema?: object | object[];
  includeOrgSchema?: boolean;
}

const BASE_URL = "https://asap.sn";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const organizationSchemaBase = {
  "@type": "Organization",
  "name": "A.SAP SARL",
  "alternateName": "Académie Internationale SAP",
  "url": "https://asap.sn",
  "logo": "https://asap.sn/logo.png",
  "description": "Expert en conseil SAP, transformation digitale et formations certifiantes au Sénégal",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "SICAP Liberté 2, Villa N°1690",
    "addressLocality": "Dakar",
    "addressCountry": "SN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["French", "English"]
  },
  "sameAs": ["https://www.linkedin.com/company/asap-sarl"]
};

const localBusinessSchemaBase = {
  "@type": "LocalBusiness",
  "name": "A.SAP SARL",
  "image": "https://asap.sn/logo.png",
  "description": "Cabinet de conseil SAP et formation professionnelle à Dakar",
  "@id": "https://asap.sn",
  "url": "https://asap.sn",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "SICAP Liberté 2, Villa N°1690",
    "addressLocality": "Dakar",
    "addressRegion": "Dakar",
    "addressCountry": "SN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 14.6928,
    "longitude": -17.4467
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "19:00"
  },
  "priceRange": "€€"
};

function buildSchemaGraph(pageSchema?: object | object[], includeOrg = false): object {
  const graphItems: object[] = [];
  
  if (includeOrg) {
    graphItems.push(organizationSchemaBase, localBusinessSchemaBase);
  }
  
  if (pageSchema) {
    if (Array.isArray(pageSchema)) {
      pageSchema.forEach(s => {
        const { "@context": _, ...rest } = s as { "@context"?: string; [key: string]: unknown };
        graphItems.push(rest);
      });
    } else {
      const { "@context": _, ...rest } = pageSchema as { "@context"?: string; [key: string]: unknown };
      graphItems.push(rest);
    }
  }
  
  return {
    "@context": "https://schema.org",
    "@graph": graphItems
  };
}

export function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  noIndex = false,
  schema,
  includeOrgSchema = false,
}: SEOProps) {
  const { language } = useI18n();

  const defaultTitle = language === "fr" 
    ? "A.SAP - Conseil SAP & Transformation Digitale au Sénégal"
    : "A.SAP - SAP Consulting & Digital Transformation in Senegal";

  const defaultDescription = language === "fr"
    ? "A.SAP SARL, expert en conseil SAP, transformation digitale et formations certifiantes à Dakar. Accompagnement personnalisé pour votre réussite numérique."
    : "A.SAP SARL, expert in SAP consulting, digital transformation and certified training in Dakar. Personalized support for your digital success.";

  const fullTitle = title ? `${title} | A.SAP` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    updateMeta("description", fullDescription);
    if (keywords) {
      updateMeta("keywords", keywords);
    }

    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", fullDescription, true);
    updateMeta("og:image", image, true);
    updateMeta("og:url", fullUrl, true);
    updateMeta("og:type", type, true);
    updateMeta("og:site_name", "A.SAP", true);
    updateMeta("og:locale", language === "fr" ? "fr_FR" : "en_US", true);

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", fullDescription);
    updateMeta("twitter:image", image);

    if (noIndex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      updateMeta("robots", "index, follow");
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", fullUrl);

    const schemaData = buildSchemaGraph(schema, includeOrgSchema);
    const graphArray = (schemaData as { "@graph": object[] })["@graph"];
    
    if (graphArray && graphArray.length > 0) {
      let scriptSchema = document.querySelector('script[data-schema="page"]') as HTMLScriptElement;
      if (!scriptSchema) {
        scriptSchema = document.createElement("script");
        scriptSchema.setAttribute("type", "application/ld+json");
        scriptSchema.setAttribute("data-schema", "page");
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schemaData);
    }

    return () => {
      const pageSchema = document.querySelector('script[data-schema="page"]');
      if (pageSchema) {
        pageSchema.remove();
      }
    };
  }, [fullTitle, fullDescription, image, fullUrl, type, keywords, noIndex, schema, includeOrgSchema, language]);

  return null;
}

export function generateCourseSchema(course: {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "A.SAP SARL",
      "url": "https://asap.sn"
    },
    "courseMode": "blended",
    "educationalCredentialAwarded": course.category === "certification" ? "Professional Certificate" : undefined,
    "timeRequired": `PT${course.duration}H`,
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "XOF",
      "availability": "https://schema.org/InStock"
    }
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://asap.sn${item.url}`
    }))
  };
}
