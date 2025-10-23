import { SetStateAction, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Generate more comprehensive mock data
const generateMockData = () => {
    const today = new Date();
    const data = [];
    for (let i = 365; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const value = Math.sin(i / 10) * 10 - Math.random() * 5; // Generate some variation
        data.push({ date, value });
    }
    return data;
};

const InteractiveChart = () => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedRange, setSelectedRange] = useState('1Y');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState({
        x: 0,
        y: 0,

        date: new Date(),
        value: 0
    });

    const fullData = generateMockData();
    const [data, setData] = useState(fullData);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0].contentRect) {
                setDimensions({
                    width: entries[0].contentRect.width,
                    height: entries[0].contentRect.height
                });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const drawChart = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous render

        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const x = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date) as [Date, Date])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.value) || 0, d3.max(data, (d) => d.value) || 0])
            .range([height, 0]);

        const line = d3
            .line<{ date: Date; value: number }>()
            .x((d) => x(d.date))
            .y((d) => y(d.value));

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // Add x-axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5))
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick line').remove())
            .call((g) =>
                g
                    .selectAll('.tick text')
                    .attr('fill', '#666')
                    .text((d) => {
                        const data = d as string;
                        switch (selectedRange) {
                            case '1Y':
                            case '6M':
                                return new Intl.DateTimeFormat('default', {
                                    month: '2-digit',
                                    year: '2-digit'
                                }).format(new Date(data));

                            default:
                                return new Intl.DateTimeFormat('default', {
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(new Date(data));
                        }
                    })
            );

        // Add y-axis
        g.append('g')
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickFormat((d) => `${d.valueOf().toFixed(2)}%`)
            )
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick line').attr('stroke', '#666').attr('stroke-dasharray', '2,2'))
            .call((g) => g.selectAll('.tick text').attr('fill', '#666'));

        // Add horizontal grid lines
        g.append('g')
            .attr('class', 'grid')
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickSize(-width)
                    .tickFormat(() => '')
            )
            .call((g) => g.select('.domain').remove())
            .call((g) => g.selectAll('.tick line').attr('stroke', '#666').attr('stroke-dasharray', '2,2'));

        // Add the line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        // Add invisible rect for mouse tracking
        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mousemove', function (event) {
                const [xPos] = d3.pointer(event);
                const xDate = x.invert(xPos);

                const bisect = d3.bisector<{ date: Date; value: number }, Date>((d) => d.date).left;
                const index = bisect(data, xDate, 1);
                const d0 = data[index - 1];
                const d1 = data[index];
                const d = xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;
                setTooltipData({
                    x: x(d.date) + margin.left,
                    y: y(d.value) + margin.top,
                    date: d.date,
                    value: d.value
                });
                setTooltipVisible(true);
            })
            .on('mouseleave', () => setTooltipVisible(false));

        // Add dots
        g.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d) => x(d.date))
            .attr('cy', (d) => y(d.value))
            .attr('r', 1)
            .attr('fill', 'white');
    };

    useEffect(() => {
        if (data.length > 0 && dimensions.width > 0 && dimensions.height > 0) {
            drawChart();
        }
    }, [data, dimensions, selectedRange]);

    const handleRangeChange = (newRange: SetStateAction<string>) => {
        setSelectedRange(newRange);
        const now = new Date();
        let startDate;
        switch (newRange) {
            case '7D':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case '1M':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '2M':
                startDate = new Date(now.setMonth(now.getMonth() - 2));
                break;
            case '3M':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6M':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '1Y':
            default:
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }
        setData(fullData.filter((d) => d.date >= startDate));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'stretch',
                height: 400
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    borderColor: '#5d6167',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 2,
                    p: 0.5,
                    mt: 1
                }}
            >
                {['7D', '1M', '2M', '3M', '6M', '1Y'].map((range) => (
                    <Button
                        key={range}
                        onClick={() => handleRangeChange(range)}
                        size={'small'}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            lineHeight: 'normal',
                            color: 'white',
                            borderColor: selectedRange === range ? '#1c2026' : 'white',
                            background: selectedRange === range ? '#1c2026' : 'transparent',
                            '&:hover': {
                                borderColor: '#1c2026',
                                background: '#1c2026'
                            }
                        }}
                    >
                        {range}
                    </Button>
                ))}
            </Box>
            <Box
                ref={containerRef}
                sx={{
                    width: 'calc(100% + 32px)',
                    height: 'calc(100% - 35px)',
                    position: 'relative',
                    mx: -2
                }}
            >
                <svg ref={svgRef} width="100%" height="100%" />
                {tooltipVisible && (
                    <div
                        style={{
                            position: 'absolute',
                            left: `${tooltipData.x}px`,
                            top: `${tooltipData.y - 40}px`,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            pointerEvents: 'none'
                        }}
                    >
                        Date: {tooltipData.date.toLocaleDateString()}
                        <br />
                        Value: {tooltipData.value.toFixed(2)}%
                    </div>
                )}
            </Box>
        </Box>
    );
};
export default InteractiveChart;
