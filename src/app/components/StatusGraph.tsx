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

                // Define theme-aware classDefs
                const themeClassDefs = isDark ? `
                  classDef needs fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#eff6ff;
                  classDef issuance fill:#7c2d12,stroke:#f97316,stroke-width:2px,color:#fff7ed;
                  classDef done fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5;
                  classDef error fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fef2f2;
                ` : `
                  classDef needs fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#01579b;
                  classDef issuance fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#e65100;
                  classDef done fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px,color:#1b5e20;
                  classDef error fill:#ffebee,stroke:#b71c1c,stroke-width:2px,color:#b71c1c;
                `;

                const chartWithTheme = statusChart.replace('%% Стилізація вузлів', themeClassDefs);

                // Use a unique ID based on theme to avoid caching issues
                const id = `status-chart-${currentTheme}`;
                const { svg: generatedSvg } = await mermaid.render(id, chartWithTheme);
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
