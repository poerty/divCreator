// drop area Component
class DropArea extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        list: [ 
          { id: 1, isDragging: false, isResizing: false, top:100, left: 50,   width:100, height:150 }, 
          { id: 2, isDragging: false, isResizing: false, top:50, left: 200, width:200, height:100 }, 
        ],
      };
    }
    onDragOver(e) {
      console.log("DropArea.onDragOver");
  
      // DnDを有効にするには既存のイベント処理を無効にする
      e.preventDefault();
      return false;
    }
    // dropイベントのリスナーを設定
    onDrop(e) {
      console.log("DropArea.onDrop");
      
      var obj     = JSON.parse(e.dataTransfer.getData('application/json'));
      
      
      
      
      let list = this.state.list;
      let index = this.state.list.findIndex((item) => item.id == obj.id);
      list[index].isDragging = false;
      list[index].top  = (e.clientY - obj.y);
      list[index].left = (e.clientX - obj.x);
      
      let newState = Object.assign(
        this.state, {
          list : list
        });
      
      
      
      
      
      
      this.setState(newState);
  
      // DnDを有効にするには既存のイベント処理を無効にする必要がある
      e.preventDefault();
    }
    updateStateDragging( id, isDragging){
      let list = this.state.list;
      let index = this.state.list.findIndex((item) => item.id == id);
      list[index].isDragging = isDragging;
  
      let newState = Object.assign(
        this.state, {
          list : list
        });
      this.setState(newState);
    }
    updateStateResizing( id, isResizing){
      let list = this.state.list;
      let index = this.state.list.findIndex((item) => item.id == id);
      list[index].isResizing = isResizing;
      
      
      let newState = Object.assign(
        this.state, {
          list : list
        });
      this.setState(newState);
    }
    funcResizing(id, clientX, clientY){
      let node = ReactDOM.findDOMNode(this.refs["node_" + id]);
      
      let list = this.state.list;
      let index = this.state.list.findIndex((item) => item.id == id);
      list[index].width =   clientX - node.offsetLeft + (16 / 2);
      list[index].height =  clientY - node.offsetTop  + (16 / 2);
      
      let newState = Object.assign(
        this.state, {
          list : list
        });
      this.setState(newState);
    }
    render() {
      let items = [];
      for (let item of this.state.list) {
        items.push(
          <Draggable 
            ref={"node_" + item.id}
            key={item.id}
            id={item.id}
            top={item.top}
            left={item.left}
            width={item.width}
            height={item.height}
            isDragging={item.isDragging}
            isResizing={item.isResizing}
            updateStateDragging={this.updateStateDragging.bind(this)}
            updateStateResizing={this.updateStateResizing.bind(this)}
            funcResizing={this.funcResizing.bind(this)}
          />
        );
      }
      return (
        <div
          className="drop-area"
          onDragOver={this.onDragOver.bind(this)}
          onDrop={this.onDrop.bind(this)} >
          {items}
        </div>
      );
    }
  };
  
  
  // draggable Component
  class Draggable extends React.Component {
    constructor(props) {
      super(props);
    }
    onMouseDown(e){
      console.log("Draggable.onMouseDown");
      // TODO:もっとちゃんと比較する
      var elm = document.elementFromPoint(e.clientX, e.clientY);
      if( elm.className != 'resizer' ){
        this.props.updateStateDragging( this.props.id, true );
      }
    }
    onMouseUp(e){
      console.log("Draggable.onMouseUp");
      this.props.updateStateDragging( this.props.id, false );
    }
    // Drag開始イベント
    onDragStart(e) {
      console.log("Draggable.onDragStart");
  
      const nodeStyle = this.refs.node.style;
      e.dataTransfer.setData( 'application/json', JSON.stringify({
        id: this.props.id,
        // mouse position in a draggable element
        x: e.clientX - parseInt(nodeStyle.left),
        y: e.clientY - parseInt(nodeStyle.top),
      }));
    }
    onDragEnd(e){
      console.log("Draggable.onDragEnd");
      
      this.props.updateStateDragging( this.props.id, false );
    }
    render() {
      const styles = {
        top:    this.props.top,
        left:   this.props.left,
        width:  this.props.width,
        height: this.props.height,
      };
      return (
        <div
          ref={"node"}
          draggable={this.props.isDragging}
          id={ 'item_' + this.props.id }
          className="item unselectable"
          style={styles}
          
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onDragStart={this.onDragStart.bind(this)}
          onDragEnd={this.onDragEnd.bind(this)}>
            { 'item_' + this.props.id }
          <Resizer
            ref={"resizerNode"}
            id={this.props.id}
            
            isResizing={this.props.isResizing}
            resizerWidth={16}
            resizerHeight={16}
            updateStateResizing={this.props.updateStateResizing}
            funcResizing={this.props.funcResizing} />
        </div>
      );
    }
  };
  Draggable.propTypes = {
      id:         React.PropTypes.number.isRequired,
      isDragging: React.PropTypes.bool.isRequired,
      isResizing: React.PropTypes.bool.isRequired,
      top:        React.PropTypes.number.isRequired,
      left:       React.PropTypes.number.isRequired,
      width:      React.PropTypes.number.isRequired,
      height:     React.PropTypes.number.isRequired,
      updateStateDragging: React.PropTypes.func.isRequired,
      updateStateResizing: React.PropTypes.func.isRequired,
      funcResizing:        React.PropTypes.func.isRequired,
    };
  
  
  
  // Resizer Component
  class Resizer extends React.Component {
    constructor(props) {
      super(props);
    }
    componentDidMount(){
      window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
      window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
    componentWillUnmount(){
      window.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
      window.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
    }
    onMouseDown(e) {
      console.log("Resizer.onMouseDown");
  
      this.props.updateStateResizing( this.props.id, true);
    }
    onMouseMove(e) {
      console.log("Resizer.onMouseMove");
      if( this.props.isResizing ){
        this.props.funcResizing( this.props.id, e.clientX, e.clientY);
      }
    }
    onMouseUp(e) {
      console.log("Resizer.onMouseUp");
      if( this.props.isResizing ){
        this.props.updateStateResizing( this.props.id, false);
      }
    }
    render() {
      const style = {
        width:  this.props.resizerWidth,
        height: this.props.resizerHeight,
      };
      return (
        <div className="resizer"
              style={style}
              onMouseDown={this.onMouseDown.bind(this)}
          ></div>
      );
    }
  };
  Resizer.propTypes = {
    id:                   React.PropTypes.number.isRequired,
    isResizing:           React.PropTypes.bool.isRequired,
    funcResizing:         React.PropTypes.func.isRequired,
    updateStateResizing:  React.PropTypes.func.isRequired,
    resizerWidth:         React.PropTypes.number.isRequired,
    resizerHeight:        React.PropTypes.number.isRequired
  };
  
  // Render Dom
  ReactDOM.render(
      <DropArea />,
    document.getElementById('app')
  );
  
  