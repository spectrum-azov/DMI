import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
});

const chart = `
flowchart TD
    %% Стилізація вузлів
    classDef needs fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef issuance fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef done fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef error fill:#ffebee,stroke:#b71c1c,stroke-width:2px;

    %% Початок
    Start([Початок]) --> N1

    %% Секція Потреб
    subgraph Needs ["📦 ПОТРЕБИ"]
    direction TB
    N1["На погодженні"]:::needs
    N2["Погоджено"]:::needs
    N1 --> N2
    end

    %% Секція Видачі
    subgraph Issuance ["🚀 ВИДАЧА"]
    direction TB
    I1["На видачу"]:::issuance

    subgraph Prep ["Підготовка"]
    direction LR
    I2["Готується"]:::issuance <--> I3["Готово"]:::issuance
    end

    subgraph Wait ["Очікування"]
    direction LR
    I4["На паузі"]:::issuance
    I5["Чекаєм на поставку"]:::issuance
    I7["Готується"]:::issuance
    I8["Готово"]:::issuance
    end

    I1 <--> Prep
    I1 <--> Wait
    I6["Відміна"]:::error
    end

    %% Кінцеві стани
    subgraph Final ["🏁 РЕЗУЛЬТАТ"]
    direction TB
    F2["Відхилено"]:::error
    F1["Видано"]:::done

    subgraph Post ["Сервіс"]
    direction LR
    F3["Повернули"]:::needs
    F4["Заміна"]:::issuance
    end
    end

    %% Основні переходи між блоками
    N1 --> F2
    N2 -- "Авто-перенос" --> I1

    I1 -- "Видати" --> F1
    F1 --> Post

    %% Повернення/Скасування
    I1 --> I6
    Prep --> I6
    I6 -- "Назад до потреб" --> N1
`;

export function StatusGraph() {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="mermaid">${chart}</div>`;
            mermaid.contentLoaded();
        }
    }, [theme]);

    return (
        <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 rounded-xl p-4 md:p-8 flex justify-center border border-border mt-4">
            <div ref={containerRef} className="min-w-[600px] w-full" />
        </div>
    );
}
