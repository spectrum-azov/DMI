import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { statusChart } from '../data/statusChart';

export function StatusGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral', // Better for dark/light mode
            securityLevel: 'loose',
        });

        const renderChart = async () => {
            try {
                const { svg: generatedSvg } = await mermaid.render('status-chart-svg', statusChart);
                setSvg(generatedSvg);
            } catch (error) {
                console.error('Mermaid render error:', error);
            }
        };

        renderChart();
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 bg-card rounded-xl border border-border mt-4 overflow-x-auto min-h-[500px]">
            <div
                ref={containerRef}
                className="w-full h-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}
