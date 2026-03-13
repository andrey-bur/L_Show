import { Component } from "../../utils/Component";

interface HeaderState {
    userName: string;
    score: number;
}

export class Header extends Component<HeaderState> {
    constructor() {
        super('header', { userName: 'Гость', score: 0 }, 'main-header');
        
        this.applyStyles('header-styles', `
            .main-header { display: flex; justify-content: space-between; padding: 10px; background: #f4f4f4; }
            .score { color: green; font-weight: bold; }
        `);
    }

    render(): string {
        return `
            <div>Привет, ${this.state.userName}!</div>
            <div class="score">Твои очки: ${this.state.score}</div>
        `;
    }
}

const header = new Header();

header.setState({ userName: 'Иван', score: 150 });
