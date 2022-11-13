
class State{
    favAnchorId!: string | null;
    recAnchorId!: string | null;
    cnt!: number;
    limit!: number;
    State(){
        this.favAnchorId = null
        this.recAnchorId = null
        this.cnt = 0;
        this.limit = 0;
    }
}

export const state = new State()