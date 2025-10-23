import { FC, useEffect, useRef, useState } from 'react';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { toast } from 'react-toastify';
import * as d3 from 'd3';
import {
  ITwitterTweet,
  TwitterSentimentsCluster,
  TwitterSentimentsClusterNode,
} from '../../twitter.interfaces';
import TokenTwitterSentimentsModal from './TokenTwitterSentimentsModal';
import { colorBySentiment, prepareSourceDataGraph } from '../../twitter.utils';
import { ETweetSentiment } from '../../twitter.enums';
import { Typography, Button, ButtonGroup, Box } from '@mui/material';
import { useSocket } from '../../../../hooks/useSocket';
import { Stack } from '@mui/system';
import { formatNumber } from '../../../../helpers/formatNumber';
import { DrawerComponent } from '../../../../components/DrawerComponent';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface TokenTwitterSentimentsNodeDatum
  extends TwitterSentimentsCluster,
    SimulationNodeDatum {}

interface TokenTwitterSentimentsLinkDatum
  extends SimulationLinkDatum<TokenTwitterSentimentsNodeDatum> {
  sentiment?: ETweetSentiment;
}

interface TokenTwitterSentimentsGraphProp {
  rootNode: { tokenAddress: string; tokenImage: string };
  data: ITwitterTweet[];
  tokenPrice: number;
  height: number;
  tokenSymbol: string;
  tokenAddress: string;
  setNewTweetCount: (count: number) => void;
  customDates: [string, string] | undefined;
}

type Link = {
  id: string;
  source: Node;
  target: Node;
  sentiment: string;
};

type Node = {
  id: string;
  label?: string;
  x: number;
  y: number;
};

const TokenTwitterSentimentsGraph: FC<TokenTwitterSentimentsGraphProp> = ({
  setNewTweetCount,
  tokenPrice,
  data: sourceData,
  rootNode,
  tokenSymbol,
  tokenAddress,
  height,
  customDates,
}) => {
  const isDebug = false;
  const graphRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<
    TokenTwitterSentimentsNodeDatum,
    TokenTwitterSentimentsLinkDatum
  > | null>(null);
  const groupRef = useRef<d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  > | null>(null);
  const [tweets, setTweet] = useState<ITwitterTweet[] | null>(null);
  const [opened, setOpen] = useState(false);

  const isPressedCMD = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  let timeoutId: null | NodeJS.Timeout = null;
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);

  const [data, setData] = useState(
    prepareSourceDataGraph(rootNode, sourceData),
  );

  const handleOpen = (tweetNodes: TwitterSentimentsClusterNode[]) => {
    const reversedData = tweetNodes.map(({ tweet }) => tweet).reverse();
    setTweet(reversedData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTweet(null);
  };

  const socket = useSocket();

  const updateGraph = (newClusters: TwitterSentimentsCluster[]) => {
    if (!graphRef.current || !simulationRef.current || !groupRef.current)
      return;

    const width = containerRef.current?.clientWidth || 0;
    const group = groupRef.current;

    const existingNodes = simulationRef.current.nodes().slice(1);

    const existingIds = new Set(existingNodes.map((node) => node.id));
    const uniqueNewClusters = newClusters.filter(
      (cluster) => !existingIds.has(cluster.id),
    );

    const newClusterNodes: TokenTwitterSentimentsNodeDatum[] =
      uniqueNewClusters.map((cluster) => ({
        ...cluster,
        id: cluster.id,
        ...(tokenPrice &&
          cluster.tokenPrice &&
          ((tokenPrice - cluster.tokenPrice) / cluster.tokenPrice) * 100 >
            -99 &&
          ((tokenPrice - cluster.tokenPrice) / cluster.tokenPrice) * 100 <
            500000 && {
            priceGain:
              ((tokenPrice - cluster.tokenPrice) / cluster.tokenPrice) * 100,
          }),
      }));

    const rootNodeData = simulationRef.current.nodes()[0] || {
      ...data.root,
      fx: width / 2,
      fy: height - data.root.r - 5,
    };

    const allNodes = [rootNodeData, ...existingNodes, ...newClusterNodes];

    const allLinks = allNodes.slice(1).map((node) => ({
      id: `${rootNodeData.id}-${node.id}`,
      sentiment: node.sentiment,
      source: rootNodeData,
      target: node,
    }));

    const links = group
      .select<SVGGElement>('.group-line')
      .selectAll<SVGLineElement, Link>('line.cluster-line')
      .data(allLinks, (d) => {
        return d.id;
      });

    links.exit().remove();

    links
      .enter()
      .append('line')
      .attr('class', 'cluster-line')
      .attr('stroke-width', 2)
      .attr('stroke', ({ sentiment }) => colorBySentiment(sentiment));

    const nodes = group
      .select<SVGGElement>('.group-clusters')
      .selectAll<SVGElement, Node>('.cluster-node')
      .data(allNodes.slice(1), (d) => d.id);

    nodes.exit().remove();

    const newNodeElements = nodes
      .enter()
      .append('g')
      .attr('class', 'cluster-node')
      .attr('id', (d) => d.id)
      .attr('cursor', 'pointer')
      .on('click', (_, d) => {
        if (d.nodes?.length) {
          handleOpen(d.nodes);
        } else {
          toast.error('There are no tweets to display.');
        }
      })
      .on('mouseenter', function (event, d) {
        // Show tooltip
        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'bubble-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '10000')
          .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)').html(`
            <div style="font-weight: bold; margin-bottom: 4px;">@${d.author?.username || 'Unknown'}</div>
            <div style="color: #aaa;">${formatNumber(d.author?.followers || 0, 0)} followers</div>
            <div style="color: #aaa; margin-top: 4px;">${d.nodes?.length || 1} ${(d.nodes?.length || 1) === 1 ? 'Tweet' : 'Tweets'}</div>
          `);

        // Position tooltip
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mousemove', function (event) {
        // Update tooltip position
        d3.select('.bubble-tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseleave', function () {
        // Remove tooltip
        d3.select('.bubble-tooltip').remove();
      });

    newNodeElements
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('stroke-width', 2)
      .attr('stroke', ({ sentiment }) => colorBySentiment(sentiment));

    simulationRef.current.nodes(allNodes).alpha(0.3).restart();

    newNodeElements
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('stroke-width', 2)
      .attr('stroke', ({ sentiment }) => colorBySentiment(sentiment));

    newNodeElements
      .append('image')
      .attr('width', (d) => d.r * 2)
      .attr('height', (d) => d.r * 2)
      .attr('x', (d) => -d.r)
      .attr('y', (d) => -d.r)
      .attr('preserveAspectRatio', 'none')
      .attr('style', (d) => `clip-path: circle(${d.r - 2}px)`)
      .attr(
        'xlink:href',
        (d, i) =>
          d.pic?.replace('_normal', '_400x400') ??
          `https://i.pravatar.cc/150?img=${i}`,
      )
      .on('error', function (_event, d) {
        // Handle 404 or failed image loads
        const imageElement = d3.select(this);
        const currentHref = imageElement.attr('xlink:href');

        // If it's not already the placeholder, switch to a consistent placeholder
        if (
          !currentHref.includes('pravatar.cc') &&
          !currentHref.includes('ui-avatars.com')
        ) {
          // Use ui-avatars.com with the username initial
          const initial = d.author?.username?.charAt(0).toUpperCase() || '?';
          imageElement.attr(
            'xlink:href',
            `https://ui-avatars.com/api/?name=${initial}&background=random&size=400`,
          );
        }
      });

    newNodeElements
      .append('rect')
      .attr('x', (d) => -d.r)
      .attr('y', (d) => -d.r)
      .attr('width', (d) => d.r * 2)
      .attr('height', (d) => d.r * 2)
      .attr('fill', 'rgba(0, 0, 0, 0.15)')
      .attr('rx', (d) => d.r);

    // Tweet count removed from bubble center - now shown in tooltip

    const nonClusterTextElements = newNodeElements
      .append('g')
      .attr('class', 'price-gain');

    nonClusterTextElements
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => -d.r)
      .attr('class', 'price-gain')
      .attr('width', 34)
      .attr('height', 14)
      .attr('fill', (element) => {
        if (element?.priceGain) {
          if (element?.priceGain > 0) {
            return 'green';
          } else {
            return 'red';
          }
        }

        return 'transparent';
      })
      .attr('rx', 4);

    nonClusterTextElements
      .append('text')
      .attr('class', 'node-count')
      .attr('x', 17)
      .attr('y', (d) => -d.r + 7)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', 8)
      .attr('font-weight', '600')
      .attr('fill', 'white')
      .text((element) => {
        if (element?.priceGain) {
          return `${formatNumber(element?.priceGain)}%`;
        }

        return '';
      });

    simulationRef.current
      .nodes([...simulationRef.current.nodes(), ...newClusterNodes])
      .restart()
      .alpha(0.3);
    // .tick(300);
  };

  useEffect(() => {
    if (!socket) return;

    const event1 = `social:twitter:${tokenSymbol?.toLowerCase()}`;
    const event2 = `social:twitter:${tokenAddress?.toLowerCase()}`;
    const event3 = 'social:twitter:randomToken';

    const handleNewTweet = (newTweets: ITwitterTweet[]) => {
      const filteredData = customDates
        ? newTweets.filter(
            (tweet) =>
              new Date(tweet.message.messageTime).getTime() >
                new Date(customDates[0]).getTime() &&
              new Date(tweet.message.messageTime).getTime() <
                new Date(customDates[1]).getTime(),
          )
        : newTweets;

      const prepareNewData = prepareSourceDataGraph(rootNode, [
        ...filteredData,
      ]);

      // change the tweet count
      setNewTweetCount(newTweets.length ?? 0);

      setData((prevData) => {
        const existingIds = new Set(
          prevData.clusters.map((cluster) => cluster.id),
        );
        const uniqueNewClusters = prepareNewData.clusters.filter(
          (cluster) => !existingIds.has(cluster.id),
        );

        const updatedData = {
          ...prevData,
          clusters: [...prevData.clusters, ...uniqueNewClusters],
        };

        updateGraph(updatedData.clusters);
        return updatedData;
      });
    };

    if (!isDebug) {
      socket.on(event1, handleNewTweet);
      socket.emit('subscribe', event1);
      socket.on(event2, handleNewTweet);
      socket.emit('subscribe', event2);

      return () => {
        socket.off(event1, handleNewTweet);
        socket.emit('unsubscribe', event1);
        socket.off(event2, handleNewTweet);
        socket.emit('unsubscribe', event2);
      };
    } else {
      // connection with random data for test
      socket.on(event3, handleNewTweet);
      socket.emit('subscribe', event3);

      return () => {
        socket.off(event3, handleNewTweet);
        socket.emit('unsubscribe', event3);
      };
    }
  }, [socket, rootNode, customDates]);

  useEffect(() => {
    if (containerRef.current && graphRef.current) {
      const width = containerRef.current.clientWidth;
      const svg = d3.select(graphRef.current);

      // Initial setup of the SVG
      svg.selectAll('*').remove();
      svg
        .attr('width', '100%')
        .attr('height', 'calc(100vh - 64px - 64px - 150px)')
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; min-height: 500px;');

      const group = svg
        .append('g')
        .attr('class', 'group-grab')
        .attr('cursor', 'grab');

      groupRef.current = group;

      // Group centers removed - using radial force layout instead

      if (isDebug) {
        const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, height]).range([height, 0]);
        const coordinatesText = svg
          .append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .text('');

        svg.on('mousemove', function (event) {
          const [mouseX, mouseY] = d3.pointer(event);

          const xValue = xScale.invert(mouseX).toFixed(2);
          const yValue = yScale.invert(mouseY).toFixed(2);

          coordinatesText.text(`x:${xValue}, y:${yValue}`);
        });
      }

      svg.on('doubleclick', null);

      // Create initial simulation with uniform forces
      // All bubbles pulled to center with same strength, but larger ones settle closer
      const simulation = d3
        .forceSimulation<
          TokenTwitterSentimentsNodeDatum,
          TokenTwitterSentimentsLinkDatum
        >()
        .force('charge', d3.forceManyBody().strength(-20))
        .force(
          'radial',
          d3
            .forceRadial<TokenTwitterSentimentsNodeDatum>(
              (d) => {
                // Target radius based on size: larger = smaller radius (closer to center)
                const maxRadius = Math.max(...data.clusters.map((c) => c.r));
                const minRadius = Math.min(...data.clusters.map((c) => c.r));
                const normalizedSize =
                  (d.r - minRadius) / (maxRadius - minRadius);
                // Inverse: larger bubbles (normalizedSize=1) get small radius, small bubbles get large radius
                return (1 - normalizedSize) * Math.min(width, height) * 0.4;
              },
              width / 2,
              height / 2,
            )
            .strength(0.3), // Same strength for all bubbles
        )
        .force(
          'collision',
          d3.forceCollide((d) => d.r + 15),
        )
        .alphaDecay(0.003) // Even slower for better settling
        .alphaMin(0.0001) // Lower threshold = runs longer before stopping
        .stop();

      simulationRef.current = simulation;

      // Create containers for clusters (no lines)
      group.append('g').attr('class', 'group-clusters');

      // Setup zoom behavior
      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .filter((event) => {
          // Prevent double-click zoom
          if (event.type === 'dblclick') return false;

          const isTouchEvent =
            typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;
          const isWheelEvent = event.type === 'wheel';

          setShowOverlay(false);

          // For touch events: require 2+ fingers
          if (isTouchEvent) {
            return event.touches.length >= 2;
          }

          // For wheel events: require Ctrl or Alt key
          if (isWheelEvent) {
            const hasModifier = event.ctrlKey || event.altKey || event.metaKey;
            if (!hasModifier) {
              // Show overlay message
              setOverlayMessage('Hold Ctrl or Alt to zoom');
              setShowOverlay(true);
              if (timeoutId) clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                setShowOverlay(false);
              }, 1500);
              return false;
            }
            return true;
          }

          // Allow drag/pan events
          return true;
        })
        .extent([
          [1, 1],
          [width, height],
        ])
        .scaleExtent([0.25, 4])
        .on('zoom', (event) => {
          group.attr('transform', event.transform);

          const currentScale = event.transform.k;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          group.selectAll('text').attr('fill', (d: any) => {
            if (d.type === 'coin') return '#fff';
            if (currentScale > 0.4) {
              return '#fff';
            } else {
              return '#ffffff00';
            }
          });
        });

      svg.call(zoomBehavior);

      // Handle single-finger touch to show overlay
      svg.on('touchstart', (event) => {
        const touchEvent = event as TouchEvent;
        if (touchEvent.touches.length === 1) {
          setOverlayMessage('Use 2 fingers to zoom');
          setShowOverlay(true);

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            setShowOverlay(false);
          }, 1500);
        }
      });

      // Root node removed - bubbles float freely from center

      // Store zoom behavior in ref for MUI buttons
      zoomBehaviorRef.current = zoomBehavior;

      // Set initial zoom to 0.6x (zoomed out) and center the view
      // Center the graph by translating to the middle of the viewport
      const initialScale = 0.6;
      const translateX = (width * (1 - initialScale)) / 2;
      const translateY = (height * (1 - initialScale)) / 2;

      svg.call(
        zoomBehavior.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(initialScale),
      );

      // Setup keyboard handlers for Ctrl/Alt tracking
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.altKey || event.metaKey) {
          isPressedCMD.current = true;
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
          isPressedCMD.current = false;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Set up tick function for simulation
      function ticked() {
        // Update nodes only (no links)
        const tickNodes = group
          .select<SVGGElement>('.group-clusters')
          .selectAll<SVGElement, Node>('.cluster-node');

        tickNodes.attr(
          'transform',
          (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`,
        );
      }

      simulation.on('tick', ticked);

      const initialData = prepareSourceDataGraph(rootNode, sourceData);
      updateGraph(initialData.clusters);

      // Cleanup function
      return () => {
        simulation.stop();
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [sourceData, height]);

  const followerCounterFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  });

  const renderOverlayText = (): string => {
    return overlayMessage || 'Use 2 fingers to zoom';
  };

  const handleZoomIn = () => {
    if (graphRef.current && zoomBehaviorRef.current) {
      d3.select(graphRef.current)
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current && zoomBehaviorRef.current) {
      d3.select(graphRef.current)
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.scaleBy, 0.75);
    }
  };

  const handleReset = () => {
    if (graphRef.current && zoomBehaviorRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth;
      const initialScale = 0.6;
      const translateX = (width * (1 - initialScale)) / 2;
      const translateY = (height * (1 - initialScale)) / 2;

      d3.select(graphRef.current)
        .transition()
        .duration(750)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.translate(translateX, translateY).scale(initialScale),
        );
    }
  };

  return (
    <>
      {showOverlay && (
        <Stack
          className="hyper-container"
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.25)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography fontWeight={700}>{renderOverlayText()}</Typography>
        </Stack>
      )}
      <div className="twitter-sentiments-wrap">
        <div
          style={{
            width: '100%',
            position: 'relative',
          }}
          ref={containerRef}
        >
          <svg ref={graphRef} />

          {/* MUI Control Buttons */}
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              zIndex: 10,
            }}
          >
            <Stack direction="column" spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={handleReset}
                // startIcon={<RestartAltIcon />}
                sx={{
                  minWidth: 'auto',
                  //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  //   '&:hover': {
                  //     backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  //   },
                }}
              >
                <RestartAltIcon />
              </Button>

              <ButtonGroup
                orientation="vertical"
                variant="contained"
                size="small"
                sx={{
                  minWidth: 'auto',
                }}
                // sx={{
                //   '& .MuiButton-root': {
                //     minWidth: 'auto',
                //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
                //     '&:hover': {
                //       backgroundColor: 'rgba(0, 0, 0, 0.85)',
                //     },
                //   },
                // }}
              >
                <Button onClick={handleZoomIn}>
                  <AddIcon />
                </Button>
                <Button onClick={handleZoomOut}>
                  <RemoveIcon />
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>

          <DrawerComponent
            drawerProps={{
              open: !!tweets && opened,
            }}
            handleClose={handleClose}
            headerComponent={
              tweets &&
              tweets.length > 0 && (
                <>
                  <Typography
                    variant="inherit"
                    fontWeight={'bold'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                  >
                    {tweets[0].author.name}
                  </Typography>
                  {/* HERE ARE FOLLOWERS TO TWEET */}
                  {tweets[0].author.followers ? (
                    <Typography>
                      {followerCounterFormatter.format(
                        tweets[0].author.followers,
                      )}{' '}
                      Followers
                    </Typography>
                  ) : null}
                </>
              )
            }
          >
            {tweets && (
              <TokenTwitterSentimentsModal
                tokenPrice={tokenPrice}
                tweets={tweets}
                opened={opened}
              />
            )}
          </DrawerComponent>
        </div>
      </div>
    </>
  );
};

export default TokenTwitterSentimentsGraph;
