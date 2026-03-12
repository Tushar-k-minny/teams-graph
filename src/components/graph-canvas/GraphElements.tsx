import type { GraphData, PersonNode, SkillNode } from "@/types/graph";
import { renderToStaticMarkup } from "react-dom/server";
import { FaUserCircle, FaLaptopCode, FaCogs, FaDatabase } from "react-icons/fa";
import { 
  SiReact, SiTypescript, SiNodedotjs, SiPostgresql, 
  SiDocker, SiFigma, SiCss, SiGraphql, SiNextdotjs 
} from "react-icons/si";

export function getSvgDataUri(name: string, type: "person" | "skill") {
  let el;
  const props = { color: type === "person" ? "#60a5fa" : "#fb923c", size: 64 };
  
  if (type === "person") {
    el = <FaUserCircle {...props} />;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const iconMap: Record<string, any> = {
      react: <SiReact {...props} />,
      typescript: <SiTypescript {...props} />,
      "node.js": <SiNodedotjs {...props} />,
      postgresql: <SiPostgresql {...props} />,
      docker: <SiDocker {...props} />,
      figma: <SiFigma {...props} />,
      css: <SiCss {...props} />,
      graphql: <SiGraphql {...props} />,
      "next.js": <SiNextdotjs {...props} />,
      "ci/cd": <FaCogs {...props} />,
      backend: <FaDatabase {...props} />,
      frontend: <SiReact {...props} />,
      devops: <SiDocker {...props} />,
    };
    el = iconMap[name.toLowerCase()] || <FaLaptopCode {...props} />;
  }
  
  const svgString = renderToStaticMarkup(el);
  const withXmlns = svgString.includes("xmlns") 
    ? svgString 
    : svgString.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(withXmlns)}`;
}

export function toElements(data: GraphData) {
  const nodes = data.nodes.map((n) => ({
    data: {
      id: n.id,
      label: n.type === "person" ? `${n.name}\n${(n as PersonNode).role}` : n.name,
      nodeType: n.type,
      sublabel:
        n.type === "person"
          ? (n as PersonNode).role
          : (n as SkillNode).category,
      bgImage: getSvgDataUri(n.name, n.type)
    },
  }));

  const edges = data.edges.map((e) => ({
    data: {
      id: e.id,
      source: e.source,
      target: e.target,
      level: e.level,
    },
  }));

  return [...nodes, ...edges];
}
