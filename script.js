const container = document.getElementById("container");

const FallingBlocks = () => {
    const squares = [];
    for(let i=0; i<64; i++) {
        const color = (((Math.floor(i/8) % 2 + i) % 2) == 0) ? "color1" : "color2";
        squares.push(<div className={ "grid-square " + color } />);
    }
    return <div className="grid-container">
        <div className="grid">{ squares }</div>
        <Blocks />
    </div>
}

class Blocks extends React.Component {
    constructor(props) {
        super(props);

        this.blockPositions = [];
        this.addBlockPosition = this.addBlockPosition.bind(this);
        this.intersectsBlocks = this.intersectsBlocks.bind(this);
        this.intersects = this.intersects.bind(this);
        this.consolidateBlocks = this.consolidateBlocks.bind(this);
    }

    addBlockPosition(position) {
        this.blockPositions.push(position);
    }
 
    intersectsBlocks(position) {
        for(let i=0; i<this.blockPositions.length; i++) {
            if(this.intersects(position, this.blockPositions[i])) {
                return true;
            }
        }

        return false;
    }

    intersects(block1, block2) {
        if(block1.y != block2.y) {
            return false;
        } if ((block1.x <= block2.x) && (block2.x <= (block1.x + block1.size))) {
            return true;
        } else if ((block2.x <= block1.x) && (block1.x <= (block2.x + block2.size - 1))) {
            return true;
        } else { return false; }
    }

    generateBlockSizes() {
        let spacesToBeFilled = 8 - (Math.floor(Math.random() * 7) + 1);
        let sizes = [];

        while(spacesToBeFilled > 0) {
            const size = Math.floor(Math.random() * Math.min(4, spacesToBeFilled)) + 1;
            sizes.push(size);
            spacesToBeFilled -= size;
        }

        return sizes;
    }

    consolidateBlocks() {
        return this.clearRight();
        // clearLeft();
        // clearCenter();
    }

    clearRight() {
        this.blockPositions.sort((b1, b2) => {
            if(b2.x == b1.x) { return 0; }
            if(b2.x > b1.x) { return -1; }
            else { return 1; }
        })

        let position = 0;
        for(let i=0; i<this.blockPositions.length; i++) {
            this.blockPositions[i].x = position;
            position = this.blockPositions[i].x + this.blockPositions[i].size;
        }

        return { min: position, max: 7 }
    }

    generateBlocks() {
        let blocks = this.generateBlockSizes().map(size => {
            let x = Math.floor(Math.random() * (8 - size));
            let y = 7;
            let count = 0; 
            while(this.intersectsBlocks({ x: x, y: y, size: size }) && count < 200) {
                if(count > 10) {
                    let freeRange = this.consolidateBlocks();
                    let freeSize = freeRange.max - freeRange.min;
                    x = Math.floor(Math.random() * (freeSize - size) + freeRange.min);
                } else {
                    x = Math.floor(Math.random() * (8 - size));
                }

                count++;
            }

            if(count >= 200) { console.error("Error positioning blocks."); }

            let position =  {
                x: x,
                y: y,
                size: size
            }
            this.blockPositions.push(position);
            return position;
        });

        return blocks;
    }

    render() {
        return <div className="blocks">
            { this.generateBlocks().map(block => <Block { ...{
                size: block.size,
                x: block.x,
                y: block.y, 
            }} />) }
        </div>
    }
}

const Block = props => {
    return <div className="block" style={{
        width: props.size * 75,
        height: 75, 
        top: props.y * 75 + 8,
        left: props.x * 75 + 8, 
        backgroundColor: "rgb(" + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ")"
    }} />
}

ReactDOM.render(<FallingBlocks />, container);