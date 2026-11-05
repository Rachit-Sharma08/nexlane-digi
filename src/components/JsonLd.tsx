/**
 * Renders JSON-LD script tag. The JSON is escaped so that `</script>` or `<`
 * inside user-controlled data can never break out (see OWASP JSON-LD advice).
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
