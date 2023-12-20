export interface IGraph {
    description: string;
    entry: string;
    nodes: INode[];
    connections: IConnection[];
    executions: IExecution[];
    registries: string[];

    readonly?: false;

    // Private member in backend
    // hash: string;
}

export interface INode {
    id: string;
    type: string;
    inputs: { [key: string]: unknown };
    position: { x: number; y: number };
}

export interface IExecution {
    src: {
        node: string;
        port: string;
    };
    dst: {
        node: string;
        port: string;
    };
}

export interface IConnection {
    src: {
        node: string;
        port: string;
    };
    dst: {
        node: string;
        port: string;
    };
}