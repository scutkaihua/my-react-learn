require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//读取图片信息
var imageDatas = require('../data/imageDatas.json');
console.log("imageDatas:" + JSON.stringify(imageDatas));

//由图片信息 读取 URL 信息
imageDatas = (function getImageURL(imageDatasArr) {
	for(var i = 0; i < imageDatasArr.length; i++) {
		var simg = imageDatasArr[i];
		simg.imageURL = require('../images/' + simg.fileName);
		imageDatasArr[i] = simg;
	}
	return imageDatasArr;
})(imageDatas);

var ImgFigure = React.createClass({

	render: function() {

		var styleObj = {};
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return(
			<figure className="img-figure" style={styleObj}>
			<img src={this.props.data.imageURL} 
				 alt={this.props.data.title}/>
			<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
			</figcaption>
			</figure>
		);
	}

});

/*取区间随机数*/
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

var AppComponent = React.createClass({

	getInitialState: function() {

		return {
			imgsArrangeArr: [
				//				{
				//					pos:{
				//						left:'0',
				//						top:'0'
				//					}
				//				}
			]
		};
	},

	Constant: {
		centerPos: {
			left: 0,
			rigth: 0
		},
		hPosRange: {
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		}
	},

	//重新布局所有图片
	rearrange: function(centerIndex) {
		console.log("imgsArrangeArr:");
		console.log(this);
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLefSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = {},
			topImgNum = Math.ceil(Math.random() * 2),
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.slice(centerIndex, 1);

		//剧中centerIndex 的图片
		imgsArrangeCenterArr[0].pos = centerPos;

		//取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.slice(topImgSpliceIndex, topImgNum);
		console.log("topImgSpliceIndex:"+ topImgSpliceIndex);

		//布局上侧图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
			}

		});

		//布局左右两侧
		for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			var hPosRangeLORX = null;

			//前半部分 左边   后半部分 右边
			if(i < k) {
				hPosRangeLORX = hPosRangeLefSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
				left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
			}
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.slice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.slice(centerIndex, 0, imgsArrangeCenterArr[0]);
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
		
		console.log(JSON.stringify(imgsArrangeArr));

	},

	componentDidMount: function() {
		console.log( ReactDOM.findDOMNode);
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = halfStageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		console.log(JSON.stringify(this.Constant));

		this.rearrange(0);
	},

	render: function() {

		var controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach(function(value, index) {

			if(!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: '0',
						top: '0'
					}
				}
			}

			imgFigures.push(<ImgFigure key={index} data={value} ref = {'imgFigure'+index} 
			 arrange = {this.state.imgsArrangeArr[index]}/>);
		}.bind(this));


		return(
			<section className="stage" ref="stage">
						<section className="img-sec">
						 {imgFigures}
						</section>
						<nav className="controller-nav">
						{controllerUnits}
						</nav>
		    </section>
		);
	}
});

export default AppComponent;