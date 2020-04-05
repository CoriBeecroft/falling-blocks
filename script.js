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

        this.state = {
            blocks: this.generateBlocks(),
        }

        this.intersectsBlocks = this.intersectsBlocks.bind(this);
        this.intersects = this.intersects.bind(this);
        this.consolidateBlocks = this.consolidateBlocks.bind(this);
        this.addRow = this.addRow.bind(this);
        this.enforceGravity = this.enforceGravity.bind(this);
        this.setBlockPosition = this.setBlockPosition.bind(this);
        this.blocksEqual = this.blocksEqual.bind(this);
    }

    intersectsBlocks(position, blocks) {
        for(let i=0; i<blocks.length; i++) {
            if(this.intersects(position, blocks[i])) {
                return true;
            }
        }

        return false;
    }

    intersects(block1, block2) {
        if(block1.y != block2.y) {
            return false;
        } if ((block1.x <= block2.x) && (block2.x <= (block1.x + block1.size - 1))) {
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

    enforceGravity(blocks) {
        let newBlocks = blocks.concat([]);
        newBlocks.sort((a, b) => {
            if(a.y < b.y) return 1;
            if(a.y > b.y) return -1;
            if(a.y == b.y) return 0;
        })

        newBlocks.forEach(block => {
            let newY = block.y;
            while(newY < 7 && !this.intersectsBlocks({ ...block, y: newY+1}, newBlocks)) {
                newY++;
            }
            if(block.y != newY) { block.animate = true; }

            block.y = newY;
        })

        return newBlocks;
    }

    consolidateBlocks(blocks) {
        return this.clearRight(blocks);
        // clearLeft();
        // clearCenter();
    }

    clearRight(blocks) {
        blocks.sort((b1, b2) => {
            if(b2.x == b1.x) { return 0; }
            if(b2.x > b1.x) { return -1; }
            else { return 1; }
        })

        let position = 0;
        for(let i=0; i<blocks.length; i++) {
            blocks[i].x = position;
            position = blocks[i].x + blocks[i].size;
        }

        return { min: position, max: 7 }
    }

    generateBlocks() {
        const blocks = [];
        this.generateBlockSizes().forEach((size) => {
            let x = Math.floor(Math.random() * (8 - (size-1)));
            let y = 7;
            let count = 0; 
            while(this.intersectsBlocks({ x: x, y: y, size: size }, blocks) && count < 200) {
                if(count > 10) {
                    let freeRange = this.consolidateBlocks(blocks);
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
                size: size,
                color: "rgb(" + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ", " + (Math.random()*128 + 128) + ")"
            }
            blocks.push(position);
            return position;
        });

        return blocks;
    }

    addRow() {
        this.setState(prevState => ({
            blocks: this.enforceGravity(prevState.blocks.map(b => ({
                ...b,
                y: b.y - 1
            })).concat(this.generateBlocks()))
        }));
    }

    blocksEqual(b1, b2) {
        return b1.x == b2.x && b1.y == b2.y;

    }

    setBlockPosition(block, x, y) {
        const newBlocks = this.state.blocks.map(b =>
            (this.blocksEqual(block, b) ? { ...b, x: x, y: y } : b));

        this.setState({ blocks: this.enforceGravity(newBlocks) }, () => {
            setTimeout(this.addRow, 300)
        })
    }

    render() {
        return <div className="blocks">
            { this.state.blocks.map(block => <Block { ...{
                ...block,
                setBlockPosition: this.setBlockPosition
            }} />) }
        </div>
    }
}

class Block extends React.Component {
    constructor(props) {
        super(props);

        this.dragStartX = 0;
        this.dragStartY = 0;
    }

    render () {
        return <div { ...{
            className: "block",
            draggable: true,
            onDragStart: e => {
                this.dragStartX = e.pageX;
                this.dragStartY = e.pageY;
            }, onDragEnd: e => {
                this.props.setBlockPosition(
                    { x: this.props.x, y: this.props.y },
                    this.props.x + Math.round((e.pageX - this.dragStartX) / 75),
                    this.props.y
                );
            },
            style: {
                width: this.props.size * 75,
                height: 75,
                top: this.props.y * 75 + 8,
                left: this.props.x * 75 + 8,
                backgroundColor: this.props.color,
            }
        }} />
    }

}

ReactDOM.render(<FallingBlocks />, container);