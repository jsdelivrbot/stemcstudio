/**
 * Parse a string of Hypermedia links.
 *
 * Link := '<' href '>' ';' S 'rel="' rel '"'
 * Link := Link [',' S Link]
 */
export default function linkToMap(links: string): { [rel: string]: string } {
  const map: { [rel: string]: string } = {};
  const parts = links.split(',');
  for (let i = 0, iLength = parts.length; i < iLength; i++) {
    const link = parts[i];
    const lt = link.indexOf('<');
    const gt = link.indexOf('>');
    // const sc = link.indexOf(';');
    const rs = link.indexOf('rel=');
    const href = link.substring(lt + 1, gt);
    const rem = link.substring(rs + 5);
    const rel = rem.substring(0, rem.length - 1);
    map[rel] = href;
  }
  return map;
}
