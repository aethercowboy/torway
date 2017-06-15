import React from 'react';

const canvasStyle = {
    //height: '1718px',
    //width: '1100px',
    //background: "url('./img/grid.png')",
    backgroundSize: 'contain',
    //transform: "scale(.5)",
    position: "absolute",
    top: 0,
    left: 0
};

const divStyle = {
  float: 'right',
  'text-align': 'left'
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: []
    };

    this.redraw = this.redraw.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.canvasImg = new Image();

    this.canvasImg.src = "./img/grid.png";
  }

  componentDidMount() {
    this.redraw();
  }

  /*
   * balance
   * -3 =   0 .. 163
   * -2 = 163 .. 322
   * -1 = 322 .. 482
   *  0 = 482 .. 613
   *  1 = 613 .. 772
   *  2 = 772 .. 931
   *  3 = 931 .. 1100
   * morality
   * -3 = 107 .. 342
   * -2 = 342 .. 541
   * -1 = 541 .. 741
   *  0 = 741 .. 939
   *  1 = 939 ..1139
   *  2 = 1139 .. 1339
   *  3 = 1339 .. 1560
   */

  calculateBalance(x) {
    switch(x) {
      case -3:
        return 82;
      case -2:
        return 243;
      case -1:
        return 402;
      case 0:
        return 548;
      case 1:
        return 693;
      case 2:
        return 852;
      case 3:
        return 1016;
    }
  }

  calculateMorality(y) {
    switch(y) {
      case -3:
        return 118;
      case -2:
        return 442;
      case -1:
        return 641;
      case 0:
        return 840;
      case 1:
        return 1039;
      case 2:
        return 1239;
      case 3:
        return 1450;
    }
  }

  redraw() {
    const vScale = 0;
    const hScale = 0;
    const vOffset = 4;
    const hOffset = 4;

    var c = this.canvas;
    var ctx = c.getContext("2d");
    //  ctx.scale(2,2);

    ctx.canvas.width = 1100/2;
    ctx.canvas.height = 1718/2;

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.drawImage(this.canvasImg, 0, 0, c.width, c.height);

    var textHeight = 22;
    ctx.font = "" + textHeight + "px Arial";

    for (var i = 0; i < this.state.works.length; ++i) {
      var work = this.state.works[i];

      var balance = parseInt(work.balance);
      var morality = parseInt(work.morality);

      var measure = ctx.measureText(work.title);
      var textWidth = measure.width;

      ctx.save();
      ctx.scale(0.5, 0.5);

      var x = this.calculateBalance(balance) - textWidth / 2;
      var y = this.calculateMorality(morality);

      ctx.fillStyle = "white";
      ctx.fillRect(x - 10, y - textHeight, textWidth + 20, textHeight + 10)

      ctx.fillStyle = "black";
      ctx.rect(x - 11, y - textHeight - 1, textWidth + 21, textHeight + 11)
      ctx.stroke();

      ctx.fillText(work.title, x, y);
      ctx.restore();
    }

  }

  addWork(val) {
    this.state.works.push(val);

    this.setState({works: this.state.works});

    this.redraw();
  }

  removeWork(idx) {
    this.state.works.splice(idx,1);

    this.setState({works: this.state.works});

    this.redraw();
  }

   render() {
      return (
        <div className="row">
          <div className="columns small-12 medium-6">
            <canvas ref={(e) => this.canvas = e} className="displayCanvas" style={canvasStyle} id="canvas">
            </canvas>
          </div>
          <div className="columns small-12 medium-6">
            <AddWork
              addWork={this.addWork.bind(this)}
            />
            <CurrentWorks
              works={this.state.works}
              removeWork={this.removeWork.bind(this)}
            />
          <p>Inspired by <a href="http://www.tor.com/2017/06/12/mapping-fantasies-into-a-single-multiverse-through-seanan-mcguires-wayward-children-series/">this post</a> at Tor.com. Image courtesy of <a href="http://www.tor.com/">Tor.com</a>, software provided by Jacob P. Silvia of <a href="https://whatcharacter.com">WhatCharacter.com</a>.</p>
          </div>
        </div>
      );
   }
}

const initialState = {
  title: '',
  balance: 0,
  morality: 0,
};

class AddWork extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addWork = props["addWork"];
  }

  handleSubmit(e, message) {
    e.preventDefault();

    let formData = {
      title: this.state.title,
      balance: this.state.balance,
      morality: this.state.morality
    };

    this.addWork(formData);
    this.setState(initialState);
  }

  handleChange(e) {
    let newState = {};

    newState[e.target.name] = e.target.value;

    this.setState(newState);
  }

  downloadImage(e) {
    var target = e.target;
    e.target.href = document.getElementById("canvas").toDataURL();
    e.target.download = "torway.png";
  }

  render() {
    return (
       <form onSubmit={this.handleSubmit}>
         <div className="row">
           <div className="columns small-12">
             <label className="label">Title</label>
             <input type="text" required name="title" value={this.state.title} onChange={e => this.handleChange(e)} placeholder="Enter Title" />
           </div>

           <div className="columns small-12 medium-6">
             <label className="label">Nonesense/Logic</label>
             <input type="number" name="balance" min="-3" max="3" value={this.state.balance} onChange={e => this.handleChange(e)}/>
           </div>

           <div className="columns small-12 medium-6">
             <label className="label">Virtue/Wicked</label>
             <input type="number" name="morality" min="-3" max="3" value={this.state.morality} onChange={e => this.handleChange(e)} />
           </div>
        </div>

        <div className="button-group">
          <button className="button" type="submit"><i className="fa fa-plus-circle"></i></button>
          <a className="button fa fa-download" id="downloadButton" onClick={this.downloadImage}></a>
        </div>
      </form>
      );
  }
}

class CurrentWorks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: []
    };

    if (props.works) {
      this.state.works = props.works;
    }

    this.removeWork = props.removeWork;

    this.removeElement = this.removeElement.bind(this);
  }

  removeElement(i) {
    return function() {
      this.removeWork(i);
    }.bind(this);
  }

  editElement(i) {

  }

  render() {
    var workList = this.state.works.map((work, i) =>
      <div key={i} className="columns small-12 callout">
          <div style={{float: 'right'}}>
            <a className="button" onClick={this.removeElement(i)}><i className="fa fa-trash"></i></a>
          </div>
          <h3>{work.title}<small> ({work.balance}, {work.morality})</small></h3>
      </div>
    )
    return (
      <div className="row">
      {workList}
      </div>
    );
  }
}

export default App;
