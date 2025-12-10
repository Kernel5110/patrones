const gameData = {
    architect: [
        {
            id: 1,
            title: "El Sistema de Notificaciones",
            description: "Estás construyendo una aplicación de clima. Cuando los datos del clima se actualizan, necesitas notificar automáticamente a la interfaz de usuario, al logger y al servicio de alertas. ¿Qué patrón usas?",
            options: [
                { id: 'a', text: "Singleton", correct: false },
                { id: 'b', text: "Observer", correct: true },
                { id: 'c', text: "Factory Method", correct: false },
                { id: 'd', text: "Adapter", correct: false }
            ],
            explanation: "El patrón **Observer** permite definir una dependencia uno-a-muchos entre objetos, de modo que cuando uno cambia su estado, todos sus dependientes son notificados."
        },
        {
            id: 2,
            title: "Conexión a Base de Datos",
            description: "Necesitas asegurarte de que tu aplicación tenga una y solo una instancia de la conexión a la base de datos para ahorrar recursos y evitar conflictos. ¿Qué patrón eliges?",
            options: [
                { id: 'a', text: "Singleton", correct: true },
                { id: 'b', text: "Prototype", correct: false },
                { id: 'c', text: "Builder", correct: false },
                { id: 'd', text: "Strategy", correct: false }
            ],
            explanation: "El patrón **Singleton** garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella."
        },
        {
            id: 3,
            title: "Algoritmos de Ordenamiento",
            description: "Tu aplicación debe permitir al usuario cambiar dinámicamente entre diferentes algoritmos de ordenamiento (BubbleSort, QuickSort, MergeSort) en tiempo de ejecución. ¿Cuál es la mejor opción?",
            options: [
                { id: 'a', text: "State", correct: false },
                { id: 'b', text: "Strategy", correct: true },
                { id: 'c', text: "Command", correct: false },
                { id: 'd', text: "Template Method", correct: false }
            ],
            explanation: "El patrón **Strategy** permite definir una familia de algoritmos, encapsular cada uno y hacerlos intercambiables."
        },
        {
            id: 4,
            title: "Interfaz Incompatible",
            description: "Tienes una clase antigua que funciona bien pero su interfaz no coincide con lo que espera tu nuevo sistema. No puedes cambiar el código antiguo. ¿Qué haces?",
            options: [
                { id: 'a', text: "Bridge", correct: false },
                { id: 'b', text: "Decorator", correct: false },
                { id: 'c', text: "Adapter", correct: true },
                { id: 'd', text: "Proxy", correct: false }
            ],
            explanation: "El patrón **Adapter** permite que clases con interfaces incompatibles trabajen juntas envolviendo una interfaz alrededor de una clase existente."
        },
        {
            id: 5,
            title: "Creación de Objetos Complejos",
            description: "Necesitas crear objetos complejos paso a paso (como una 'Pizza' con masa, salsa, ingredientes opcionales). Quieres que el mismo proceso de construcción pueda crear diferentes representaciones.",
            options: [
                { id: 'a', text: "Abstract Factory", correct: false },
                { id: 'b', text: "Builder", correct: true },
                { id: 'c', text: "Prototype", correct: false },
                { id: 'd', text: "Factory Method", correct: false }
            ],
            explanation: "El patrón **Builder** separa la construcción de un objeto complejo de su representación, permitiendo crear diferentes representaciones con el mismo proceso."
        }
    ],
    memory: [
        { id: 'singleton', icon: '1️⃣', name: 'Singleton' },
        { id: 'observer', icon: '👀', name: 'Observer' },
        { id: 'factory', icon: '🏭', name: 'Factory' },
        { id: 'adapter', icon: '🔌', name: 'Adapter' },
        { id: 'strategy', icon: '🗺️', name: 'Strategy' },
        { id: 'decorator', icon: '🎄', name: 'Decorator' },
        { id: 'command', icon: '🎮', name: 'Command' },
        { id: 'proxy', icon: '🛡️', name: 'Proxy' }
    ]
};
