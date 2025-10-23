import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ITwitterResponse, ITwitterTweet } from '../../twitter.interfaces';
import { aggregateSentiments } from '../../twitter.utils';
import { Box, Stack } from '@mui/system';
import * as d3 from 'd3';
import { CircularProgress, Tooltip } from '@mui/material';
import { formatNumber } from '../../../../helpers/formatNumber';
import { getIsMobile } from '../../../../helpers/isMobile';
import { useQuery } from '@tanstack/react-query';

import { ETweetSentiment } from '../../twitter.enums';

interface TokenTwitterSentimentsOverTimeProp {
    tokenSlug?: string;
    tokenChain: string;
    tokenAddress: string;
    start_date: number;
    end_date: number;
}

interface TooltipState {
    show: boolean;
    x: number;
    y: number;
    data: number[] | null;
    date: string | null;
}

const TokenTwitterSentimentsOverTime: FC<TokenTwitterSentimentsOverTimeProp> = ({
    start_date,
    end_date,
    tokenSlug
}) => {
    const {
        data: newData,
        isLoading,
        error
    } = useQuery<ITwitterResponse<ITwitterTweet[]>>({
        queryKey: [
            `/token/${tokenSlug}/twitter`,
            {
                page: '1',
                limit: 10000,
                from: new Date(start_date * 1000).toISOString(),
                to: new Date(end_date * 1000).toISOString()
            }
        ],
        enabled: !!tokenSlug
    });

    const newDatafilteredData = useMemo(() => {
        if (newData && newData.data.length) {
            return newData.data
                .map((t) => ({
                    ...t,
                    timestamp: new Date(t.message.messageTime).getTime(), // to ms
                    sentiment: t.sentiment ?? ETweetSentiment.NEUTRAL // if null make NEUTRAL
                }))
                .filter((t) => t.author.id); // has id
        }

        return [];
    }, [newData]);

    const { xAxisData, seriesData } = aggregateSentiments(newDatafilteredData);

    if (error) {
        console.error(error);
    }

    if (isLoading) {
        return (
            <Stack>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={250} py={2}>
                    <CircularProgress />
                </Box>
            </Stack>
        );
    }

    return (
        newData &&
        newDatafilteredData && (
            <Box
                sx={{
                    overflowX: 'auto',
                    overflowY: 'hidden'
                }}
            >
                <ScrollableLineChartWithHTMLYAxis xAxisData={xAxisData} seriesData={seriesData} />
            </Box>
        )
    );
};

interface ScrollableLineChartProps {
    xAxisData: Date[];
    seriesData: number[][];
}

const ScrollableLineChartWithHTMLYAxis: FC<ScrollableLineChartProps> = ({ xAxisData, seriesData }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const outerContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    xAxisData = xAxisData.map((item) => {
        const date = new Date(item);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });

    const [tooltip, setTooltip] = useState<TooltipState>({
        show: false,
        x: 0,
        y: 0,
        data: null,
        date: null
    });

    const margin = { top: 20, right: 20, bottom: 35, left: 15 };
    const chartHeight = 250;
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const minWidth = 700;

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.getBoundingClientRect().width;
                setDimensions({
                    width: Math.max(containerWidth - 40, minWidth),
                    height: chartHeight
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!chartRef.current || !containerRef.current) return;

        const height = chartHeight - margin.top - margin.bottom;

        const fullWidth = Math.max(
            xAxisData.length * 50,
            containerRef.current?.getBoundingClientRect().width
                ? containerRef.current?.getBoundingClientRect().width - 40
                : minWidth
        );

        d3.select(chartRef.current).selectAll('*').remove();

        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', fullWidth + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .on('mouseout', () => setTooltip({ ...tooltip, show: false }));

        const defs = svg.append('defs');

        const gradientColors = [
            { color: 'green', id: 'greenGradient' },
            { color: 'red', id: 'redGradient' },
            { color: 'white', id: 'whiteGradient' }
        ];

        gradientColors.forEach(({ color, id }) => {
            const gradient = defs
                .append('linearGradient')
                .attr('id', id)
                .attr('x1', '0%')
                .attr('x2', '0%')
                .attr('y1', '0%')
                .attr('y2', '100%');

            gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.2);

            gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);
        });

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleTime()
            .domain(d3.extent(xAxisData) as [Date, Date])
            .range([0, fullWidth]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(seriesData.flat()) ?? 0])
            .range([height, 0]);

        const colors = ['green', 'red', 'white'];

        g.selectAll('.horizontal-grid')
            .data(yScale.ticks(5))
            .enter()
            .append('line')
            .attr('class', 'horizontal-grid')
            .attr('x1', 0)
            .attr('y1', (d) => yScale(d))
            .attr('x2', fullWidth)
            .attr('y2', (d) => yScale(d))
            .attr('stroke', '#ccc')
            .attr('opacity', 0)
            .attr('stroke-dasharray', '4 2')
            .attr('stroke-width', 1);

        const ticks = xScale.ticks(xAxisData.length);
        g.selectAll('.vertical-grid')
            .data(ticks)
            .enter()
            .append('line')
            .attr('class', 'vertical-grid')
            .attr('x1', (d) => xScale(d as Date))
            .attr('y1', 0)
            .attr('x2', (d) => xScale(d as Date))
            .attr('y2', height)
            .attr('stroke', '#ccc')
            .attr('opacity', 0)
            .attr('stroke-dasharray', '4 2')
            .attr('stroke-width', 1);

        seriesData.forEach((data, i) => {
            const line = d3
                .line<number>()
                .x((_, idx) => xScale(xAxisData[idx]))
                .y((d) => yScale(d))
                .curve(d3.curveMonotoneX);

            const area = d3
                .area<number>()
                .x((_, idx) => xScale(xAxisData[idx]))
                .y0(height)
                .y1((d) => yScale(d))
                .curve(d3.curveMonotoneX);

            g.append('path').datum(data).attr('fill', `url(#${gradientColors[i].id})`).attr('d', area);

            g.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', colors[i])
                .attr('stroke-width', 2)
                .attr('d', line);

            g.selectAll(`.bubble-series-${i}`)
                .data(data)
                .enter()
                .append('circle')
                .attr('class', `bubble-series-${i}`)
                .attr('cx', (_, idx) => xScale(xAxisData[idx]))
                .attr('cy', (d) => yScale(d))
                .attr('r', 4)
                .attr('fill', colors[i]);
        });

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .attr('class', 'x-axis')
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(xAxisData.length)
                    .tickFormat(d3.timeFormat('%d.%m') as any)
            );

        g.append('rect')
            .attr('width', fullWidth)
            .attr('height', height)
            .attr('fill', 'transparent')
            .on('mousemove', (event) => {
                const [mouseX, mouseY] = d3.pointer(event);
                const xValue = xScale.invert(mouseX);

                const closestIndex = d3.bisectCenter(
                    xAxisData.map((date) => date.getTime()),
                    xValue.getTime()
                );

                if (closestIndex >= 0 && closestIndex < xAxisData.length) {
                    const data = seriesData.map((series) => series[closestIndex]);
                    const date = xAxisData[closestIndex];

                    setTooltip({
                        show: true,
                        x: mouseX,
                        y: mouseY,
                        data,
                        date: date.toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                        })
                    });
                }
            });
    }, [xAxisData, seriesData, dimensions]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    }, []);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (containerRef.current) {
            isDragging.current = true;
            startX.current = e.pageX - containerRef.current.offsetLeft;
            scrollLeft.current = containerRef.current.scrollLeft;
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging.current && containerRef.current) {
            e.preventDefault();
            const x = e.pageX - containerRef.current.offsetLeft;
            const walk = x - startX.current;
            containerRef.current.scrollLeft = scrollLeft.current - walk;
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;

        const isMobile = getIsMobile();

        if (isMobile) {
            setTooltip({ ...tooltip, show: false });
        }
    };

    if (xAxisData && xAxisData.length === 0) {
        return;
    }

    return (
        <>
            <div
                style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}
                ref={outerContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <div
                    style={{
                        position: 'relative',
                        bottom: '0px',
                        marginRight: 0,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 8,
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            flex: 1
                        }}
                    >
                        {d3
                            .scaleLinear()
                            .domain([0, d3.max(seriesData.flat()) ?? 0])
                            .range([chartHeight - margin.bottom, margin.top])
                            .ticks(getTickCount(seriesData))
                            .map((tick, idx) => {
                                const yScale = d3
                                    .scaleLinear()
                                    .domain([0, d3.max(seriesData.flat()) ?? 0])
                                    .range([chartHeight - margin.bottom, margin.top]);

                                const pixelPosition = yScale(tick);

                                return (
                                    <div
                                        key={`tick-${tick}-${idx}`}
                                        className="aaaaa"
                                        style={{
                                            position: 'absolute',
                                            zIndex: 10,
                                            right: 0,
                                            bottom: `${chartHeight - pixelPosition - 9}px`,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {formatNumber(Number(tick) * 1, 0)}
                                    </div>
                                );
                            })}

                        {d3
                            .scaleLinear()
                            .domain([0, d3.max(seriesData.flat()) ?? 0])
                            .range([chartHeight - margin.bottom, margin.top])
                            .ticks(getTickCount(seriesData))
                            .map((tick) => {
                                return (
                                    <div
                                        key={`tick-${tick}`}
                                        style={{
                                            zIndex: -1,
                                            opacity: 0
                                        }}
                                    >
                                        {formatNumber(Number(tick), 0)}
                                    </div>
                                );
                            })}
                    </div>
                    <div
                        className=""
                        style={{
                            marginLeft: 'auto',
                            marginTop: 20,
                            marginBottom: 32,
                            borderRight: '1px solid white'
                        }}
                    ></div>
                </div>
                <div
                    ref={containerRef}
                    style={{
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        flex: 1,
                        height: `${chartHeight}px`,

                        position: 'relative'
                    }}
                >
                    <div ref={chartRef} />
                    <Tooltip
                        id="hello"
                        open={tooltip.show}
                        title={
                            <Box
                                sx={{
                                    m: -1
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1,
                                        pb: 0.5,
                                        borderBottom: '1px solid rgba(255,255,255,0.25)'
                                    }}
                                >
                                    {tooltip?.date}
                                </Box>
                                <Box
                                    sx={{
                                        p: 1,
                                        pt: 0.5
                                    }}
                                >
                                    {tooltip?.data &&
                                        tooltip.data.map((value: number, i: number) => (
                                            <Box
                                                key={`${value}-${i}`}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}
                                            >
                                                <Box
                                                    style={{
                                                        background: ['green', 'red', 'white'][i],
                                                        display: 'inline-block',
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '100%'
                                                    }}
                                                ></Box>{' '}
                                                {value}
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                        }
                        placement="top"
                        arrow
                        sx={{
                            '&': {
                                pointerEvents: 'none!important'
                            },
                            '.MuiPopper-root.MuiTooltip-popper.MuiTooltip-popperInteractive': {
                                pointerEvents: 'none!important'
                            },
                            background: 'red!important'
                        }}
                        style={{
                            position: 'absolute',
                            left: `${tooltip.x + 13}px`,
                            top: `calc(${tooltip.y + 24}px )`
                        }}
                    >
                        <Box></Box>
                    </Tooltip>
                </div>
            </div>
        </>
    );
};

function getTickCount(data: number[][]) {
    const maxValue = d3.max(data.flat()) ?? 0;

    if (maxValue < 5) {
        return maxValue;
    }

    return 5;
}
export default TokenTwitterSentimentsOverTime;
