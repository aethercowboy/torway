import React from 'react';

const canvasStyle = {
  backgroundSize: 'contain',
  position: 'absolute',
  top: 0,
  left: 0,
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      works: [],
    };

    this.redraw = this.redraw.bind(this);

    this.canvasImg = new Image();
    this.canvasImg.src = './img/grid.png';
    this.canvasImg.onload = this.redraw;
  }

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  calculateBalance(x) {
    switch (x) {
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
      default:
        return 548;
    }
  }

  calculateMorality(y) {
    switch (y) {
      case -3:
        return 1450;
      case -2:
        return 1239;
      case -1:
        return 1039;
      case 0:
        return 840;
      case 1:
        return 641;
      case 2:
        return 442;
      case 3:
        return 224.5;
      default:
        return 840;
    }
  }

  redraw() {
    const c = this.canvas;

    if (!c) {
      return;
    }

    const ctx = c.getContext('2d');

    ctx.canvas.width = 1100 / 2;
    ctx.canvas.height = 1718 / 2;

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(this.canvasImg, 0, 0, c.width, c.height);

    const textHeight = 22;
    ctx.font = `${textHeight}px Arial`;

    for (let i = 0; i < this.state.works.length; ++i) {
      const work = this.state.works[i];

      const balance = parseInt(work.balance, 10);
      const morality = parseInt(work.morality, 10);

      const measure = ctx.measureText(work.title);
      const textWidth = measure.width;

      ctx.save();
      ctx.scale(0.5, 0.5);

      const x = this.calculateBalance(balance) - textWidth / 2;
      const y = this.calculateMorality(morality);

      ctx.fillStyle = 'white';
      ctx.fillRect(x - 10, y - textHeight, textWidth + 20, textHeight + 10);

      ctx.fillStyle = 'black';
      ctx.rect(x - 11, y - textHeight - 1, textWidth + 21, textHeight + 11);
      ctx.stroke();

      ctx.fillText(work.title, x, y);
      ctx.restore();
    }
  }

  addWork(val) {
    this.setState((prevState) => ({
      works: [...prevState.works, val],
    }));
  }

  removeWork(idx) {
    this.setState((prevState) => ({
      works: prevState.works.filter((_, i) => i !== idx),
    }));
  }

  render() {
    return (
      <div className="row">
        <div className="columns small-12 medium-6">
          <canvas ref={(e) => (this.canvas = e)} className="displayCanvas" style={canvasStyle} id="canvas" />
        </div>
        <div className="columns small-12 medium-6">
          <AddWork addWork={this.addWork.bind(this)} />
          <CurrentWorks works={this.state.works} removeWork={this.removeWork.bind(this)} />
          <p>
            Inspired by{' '}
            <a
              href="http://www.tor.com/2017/06/12/mapping-fantasies-into-a-single-multiverse-through-seanan-mcguires-wayward-children-series/"
              target="_blank"
              rel="noreferrer"
            >
              this post
            </a>{' '}
            at Tor.com. Image courtesy of{' '}
            <a href="http://www.tor.com/" target="_blank" rel="noreferrer">
              Tor.com
            </a>
            , software provided by Jacob P. Silvia of{' '}
            <a href="https://whatcharacter.com" target="_blank" rel="noreferrer">
              WhatCharacter.com
            </a>
            . Fork this on{' '}
            <a href="https://github.com/aethercowboy/torway" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
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
    this.downloadImage = this.downloadImage.bind(this);
    this.addWork = props.addWork;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = {
      title: this.state.title,
      balance: this.state.balance,
      morality: this.state.morality,
    };

    this.addWork(formData);
    this.setState(initialState);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  downloadImage(e) {
    e.target.href = document.getElementById('canvas').toDataURL();
    e.target.download = 'torway.png';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="columns small-12">
            <label className="label">Title</label>
            <input
              type="text"
              required
              name="title"
              value={this.state.title}
              onChange={(e) => this.handleChange(e)}
              placeholder="Enter Title"
            />
          </div>

          <div className="columns small-12 medium-6">
            <label className="label">Nonesense/Logic</label>
            <input
              type="number"
              name="balance"
              min="-3"
              max="3"
              value={this.state.balance}
              onChange={(e) => this.handleChange(e)}
            />
          </div>

          <div className="columns small-12 medium-6">
            <label className="label">Wicked/Virtue</label>
            <input
              type="number"
              name="morality"
              min="-3"
              max="3"
              value={this.state.morality}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
        </div>

        <div className="button-group">
          <button className="button" type="submit">
            <i className="fa fa-plus-circle" />
          </button>
          <a className="button fa fa-download" id="downloadButton" onClick={this.downloadImage} />
        </div>
      </form>
    );
  }
}

class CurrentWorks extends React.Component {
  removeElement(i) {
    return () => {
      this.props.removeWork(i);
    };
  }

  render() {
    const workList = this.props.works.map((work, i) => (
      <div key={i} className="columns small-12 callout">
        <div style={{ float: 'right' }}>
          <a className="button" onClick={this.removeElement(i)}>
            <i className="fa fa-trash" />
          </a>
        </div>
        <h3>
          {work.title}
          <small>
            {' '}
            ({work.balance}, {work.morality})
          </small>
        </h3>
      </div>
    ));

    return <div className="row">{workList}</div>;
  }
}

export default App;
