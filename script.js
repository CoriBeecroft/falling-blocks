const container = document.getElementById("container");

const FallingBlocks = () => {

    return <div className="grid-container">
        <div className="grid">
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
            <div className="grid-square" />
        </div>
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
        return block1.x <= block2.x && block2.x <= (block1.x + block1.size) ||
            block2.x <= block1.x && block1.x <= (block2.x + block2.size)
    }

    generateBlockSizes() {
        let spacesToBeFilled = 8 - Math.floor(Math.random() * 7) + 1
        // console.log(spacesToBeFilled);
        let sizes = [];

        while(spacesToBeFilled > 0) {
            const size = Math.floor(Math.random() * Math.min(4, spacesToBeFilled)) + 1;
            sizes.push(size);
            spacesToBeFilled -= size;
        }

        return sizes;
    }

    consolidateBlocks() {
        this.clearRight();
        // clearLeft();
        // clearCenter();
    }

    clearRight() {
        let position = 0;
        this.blockPositions.sort((b1, b2) => {
            console.log("in sort", );
            if(b2.x == b1.x) {
                return 0;
            } if(b2.x > b1.x) {
                return -1;
            } else { return 1}
        })

        console.log(JSON.stringify(this.blockPositions.map(p => p.x)));

        for(let i=0; i<this.blockPositions; i++) {
            let block = this.blockPositions[i];
            block.x = position;
            position = block.x + block.size;
        }
    }

    render() {
        return <div className="blocks">
            { this.generateBlockSizes().map((size, i) => <Block { ...{
                size: size,
                blockPositions: this.blockPositions,
                intersectsBlocks: this.intersectsBlocks,
                addBlockPosition: this.addBlockPosition,
                y: i, 
                consolidateBlocks: this.consolidateBlocks
            }} />) }
        </div>
    }
}

const Block = props => {
    let x = Math.floor(Math.random() * (8 - props.size));
    let y = props.y;//7// Math.floor(Math.random() * 8);

    let count = 0; 
    while(props.intersectsBlocks({ x: x, y: y, size: props.size }) && count < 100) {
        if(count > 10) {
            console.log("???");
            props.consolidateBlocks();
            // break;
        }
        count++;
        x = Math.floor(Math.random() * (8 - props.size));
    }

    props.addBlockPosition({ x: x, y: y, size: props.size });
    return <div className="block" style={{
        width: props.size*75,
        height: 75, 
        top: y * 75 + 8,
        left: x * 75 + 8, 
        borderColor: "rgb(" + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ")"
    }} />
}

ReactDOM.render(<FallingBlocks />, container);