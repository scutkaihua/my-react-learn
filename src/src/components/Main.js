require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

//读取图片信息
let imageDatas = require('../data/imageDatas.json');

//由图片信息 读取 URL 信息
imageDatas = (function getImageURL(imageDatasArr) {
	for(var i = 0; i < imageDatasArr.length; i++) {
		var img = imageDatasArr[i];
		img.imageURL = require('../images/' + img.fileName);
		imageDatasArr[i] = img;
	}
	return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
	render() {
		return(
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
		    </section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;