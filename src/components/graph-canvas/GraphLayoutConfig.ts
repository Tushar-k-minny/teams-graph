import type { LayoutName } from "@/types/graph";
import cytoscape from "cytoscape";

export function getLayoutConfig(name: LayoutName) {
  const baseOpts = { 
    name, 
    animate: true, 
    animationDuration: 800, 
    padding: 50, 
    fit: true 
  };
  switch (name) {
    case "breadthfirst":
      return {
        ...baseOpts,
        directed: true,
        spacingFactor: 1.15,
        roots: '[nodeType="person"]',
        circle: false,
        grid: false,
      } as unknown as cytoscape.BreadthFirstLayoutOptions;
    case "cose":
      return {
        ...baseOpts,
        nodeRepulsion: () => 100000,
        nodeOverlap: 20,
        idealEdgeLength: () => 100,
        edgeElasticity: () => 100,
        nestingFactor: 5,
        gravity: 0.8,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0,
      } as unknown as cytoscape.CoseLayoutOptions;
    case "grid":
      return { ...baseOpts, spacingFactor: 1.15 } as unknown as cytoscape.GridLayoutOptions;
    case "circle":
      return { ...baseOpts, spacingFactor: 1.15 } as unknown as cytoscape.CircleLayoutOptions;
    case "concentric":
      return {
        ...baseOpts,
        spacingFactor: 1.15,
        minNodeSpacing: 30,
        concentric: (node: cytoscape.NodeSingular) => {
          return node.data("nodeType") === "person" ? 2 : 1;
        },
        levelWidth: () => 1,
      } as unknown as cytoscape.ConcentricLayoutOptions;
    default:
      return baseOpts;
  }
}
