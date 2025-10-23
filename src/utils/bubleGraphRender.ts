import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface NodeDatum extends SimulationNodeDatum {
  amount: number;
  id: string;
}

export interface LinkDatum<T extends SimulationNodeDatum>
  extends SimulationLinkDatum<T> {
  value: number;
}

export default function bubbleGraphRender<
  N extends NodeDatum = NodeDatum,
  L extends LinkDatum<N> = LinkDatum<N>,
>(
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  linksData: L[],
  nodesData: N[],
) {
  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = linksData.map((d) => ({ ...d })) as L[];
  const nodes = nodesData.map((d) => ({ ...d })) as N[];

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation<N>(nodes)
    .force(
      'link',
      d3.forceLink<N, L>(links).id((d) => d.id),
    )
    .force('charge', d3.forceManyBody())
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.log(d.value / 1000));

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('title', (d) => d.id)
    .attr('r', (d) => Math.log(d.amount))
    .attr('fill', (d) => color(String(d.amount)));

  node.append('title').text((d) => d.id);

  const dragHandler = d3
    .drag<SVGCircleElement, N>()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);

  // Add a drag behavior.
  (node as d3.Selection<SVGCircleElement, N, SVGGElement, unknown>).call(
    dragHandler,
  );

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation!.on('tick', () => {
    link
      .attr('x1', (d: L) => {
        const source = d.source;
        return typeof source === 'object' && 'x' in source
          ? (source.x ?? 0)
          : 0;
      })
      .attr('y1', (d: L) => {
        const source = d.source;
        return typeof source === 'object' && 'y' in source
          ? (source.y ?? 0)
          : 0;
      })
      .attr('x2', (d: L) => {
        const target = d.target;
        return typeof target === 'object' && 'x' in target
          ? (target.x ?? 0)
          : 0;
      })
      .attr('y2', (d: L) => {
        const target = d.target;
        return typeof target === 'object' && 'y' in target
          ? (target.y ?? 0)
          : 0;
      });

    node.attr('cx', (d: N) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
  });

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event: d3.D3DragEvent<SVGCircleElement, N, N>) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event: d3.D3DragEvent<SVGCircleElement, N, N>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  function dragended(event: d3.D3DragEvent<SVGCircleElement, N, N>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return simulation!;
}
