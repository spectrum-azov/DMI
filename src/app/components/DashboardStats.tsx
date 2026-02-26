import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    value: number;
    total: number;
    title: string;
    subtitle: string;
    color: 'blue' | 'yellow' | 'green' | 'red';
}

export function StatCard({ icon: Icon, value, total, title, subtitle, color }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-50/50 border-blue-200 p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/10 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-blue-900 dark:text-blue-200 text-blue-700/60 dark:text-blue-400/50 text-blue-700 dark:text-blue-300',
        yellow: 'bg-yellow-50/50 border-yellow-200 p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/10 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-yellow-900 dark:text-yellow-200 text-yellow-700/60 dark:text-yellow-400/50 text-yellow-700 dark:text-yellow-300',
        green: 'bg-green-50/50 border-green-200 p-2 bg-green-100 text-green-600 dark:bg-green-900/10 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 text-green-900 dark:text-green-200 text-green-700/60 dark:text-green-400/50 text-green-700 dark:text-green-300',
        red: 'bg-red-50/50 border-red-200 p-2 bg-red-100 text-red-600 dark:bg-red-900/10 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 text-red-900 dark:text-red-200 text-red-700/60 dark:text-red-400/50 text-red-700 dark:text-red-300',
    };

    // Actually simpler to just use dynamic classes if I know the structure
    const baseClasses = {
        blue: { bg: 'bg-blue-50/50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconText: 'text-blue-600', textMain: 'text-blue-900', textMuted: 'text-blue-700/60', textSub: 'text-blue-700' },
        yellow: { bg: 'bg-yellow-50/50', border: 'border-yellow-200', iconBg: 'bg-yellow-100', iconText: 'text-yellow-600', textMain: 'text-yellow-900', textMuted: 'text-yellow-700/60', textSub: 'text-yellow-700' },
        green: { bg: 'bg-green-50/50', border: 'border-green-200', iconBg: 'bg-green-100', iconText: 'text-green-600', textMain: 'text-green-900', textMuted: 'text-green-700/60', textSub: 'text-green-700' },
        red: { bg: 'bg-red-50/50', border: 'border-red-200', iconBg: 'bg-red-100', iconText: 'text-red-600', textMain: 'text-red-900', textMuted: 'text-red-700/60', textSub: 'text-red-700' },
    }[color];

    const darkClasses = {
        blue: { bg: 'dark:bg-blue-900/10', border: 'dark:border-blue-800', iconBg: 'dark:bg-blue-900/30', iconText: 'dark:text-blue-400', textMain: 'dark:text-blue-200', textMuted: 'dark:text-blue-400/50', textSub: 'dark:text-blue-300' },
        yellow: { bg: 'dark:bg-yellow-900/10', border: 'dark:border-yellow-800', iconBg: 'dark:bg-yellow-900/30', iconText: 'dark:text-yellow-400', textMain: 'dark:text-yellow-200', textMuted: 'dark:text-yellow-400/50', textSub: 'dark:text-yellow-300' },
        green: { bg: 'dark:bg-green-900/10', border: 'dark:border-green-800', iconBg: 'dark:bg-green-900/30', iconText: 'dark:text-green-400', textMain: 'dark:text-green-200', textMuted: 'dark:text-green-400/50', textSub: 'dark:text-green-300' },
        red: { bg: 'dark:bg-red-900/10', border: 'dark:border-red-800', iconBg: 'dark:bg-red-900/30', iconText: 'dark:text-red-400', textMain: 'dark:text-red-200', textMuted: 'dark:text-red-400/50', textSub: 'dark:text-red-300' },
    }[color];

    return (
        <div className={`${baseClasses.bg} border ${baseClasses.border} rounded-lg p-6 ${darkClasses.bg} ${darkClasses.border}`}>
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${baseClasses.iconBg} rounded-lg ${darkClasses.iconBg}`}>
                    <Icon className={`${baseClasses.iconText} ${darkClasses.iconText}`} size={24} />
                </div>
                <div className="text-right">
                    <span className={`text-3xl font-bold ${baseClasses.textMain} ${darkClasses.textMain}`}>{value}</span>
                    <span className={`text-lg font-medium ${baseClasses.textMuted} ${darkClasses.textMuted} ml-1`}>/ {total}</span>
                </div>
            </div>
            <h3 className={`font-medium ${baseClasses.textMain} ${darkClasses.textMain}`}>{title}</h3>
            <p className={`text-sm ${baseClasses.textSub} ${darkClasses.textSub} mt-1`}>{subtitle}</p>
        </div>
    );
}

interface StatProgressProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

export function StatProgress({ label, value, total, color }: StatProgressProps) {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
