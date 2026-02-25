import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';
import { statusChart } from '../data/statusChart';

export function StatusGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        const currentTheme = resolvedTheme || theme || 'light';
        const isDark = currentTheme === 'dark';

        mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'neutral',
            securityLevel: 'loose',
            themeVariables: isDark ? {
                primaryColor: '#1e293b',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#334155',
                lineColor: '#94a3b8',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e293b',
                mainBkg: '#0f172a',
                nodeBorder: '#334155',
                clusterBkg: '#1e293b',
                clusterBorder: '#334155',
                titleColor: '#f8fafc',
                edgeLabelBackground: '#1e293b',
                nodeTextColor: '#f8fafc',
            } : {
                primaryColor: '#f1f5f9',
                primaryTextColor: '#0f172a',
                primaryBorderColor: '#cbd5e1',
                lineColor: '#64748b',
            }
        });

        const renderChart = async () => {
            try {
                // Clear previous SVG to force complete re-render
                setSvg('');

                // Use a unique ID based on theme to avoid caching issues
                const id = `status-chart-${currentTheme}`;
                const { svg: generatedSvg } = await mermaid.render(id, statusChart);
                setSvg(generatedSvg);
            } catch (error) {
                console.error('Mermaid render error:', error);
            }
        };

        renderChart();
    }, [theme, resolvedTheme]);

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 bg-card rounded-xl border border-border mt-4 overflow-x-auto min-h-[600px] transition-colors duration-300">
            <div
                ref={containerRef}
                className="w-full h-full flex justify-center transition-opacity duration-500"
                style={{ opacity: svg ? 1 : 0 }}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
}
