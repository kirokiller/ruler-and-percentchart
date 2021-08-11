/*
 * @Description: 刻度尺组件
 * @Autor: niehongfeng
 * @Date: 2021-01-28 16:18:06
 * @params: {Numbe} cmWidth 厘米刻度宽度 default:50
 * @params: {Numbe} minScale 最小刻度 default:4
 * @params：{Numbe} maxScale 最大刻度 default:20
 * @params: {Numbe} initScale 初始刻度 default:0
 * @params: {func} onBackfill 刻度回填
 * @params: {func} endClickScroll 停止滚动时的回调
 * @description: 依赖iscroll
 */
import React from 'react';
import './style.css';
import lodash from 'lodash'

let iScroll = require('iscroll/build/iscroll-probe');

class Ruler extends React.Component {
	constructor(props) {
		super(props)
		this.state = {

		}
		this.myScroll = null;
	}

	componentWillUnmount() {
		this.myScroll && this.myScroll.destroy();
	}

	// this.x从0开始、往右滑为正、往左滑为负
	componentDidMount() {
		const { cmWidth = 50, minScale = 4, initScale = 0, onBackfill, endClickScroll } = this.props;
		// 刻度线宽度1px
		const realCmWidth = cmWidth + 1;
		const options = {
			scrollX: true,
			scrollY: false,
			mouseWheel: true,
			probeType: 3,
			startX: -((initScale - minScale) * realCmWidth),
		}

		this.myScroll = new iScroll('#tgt-iv-ruler-wrapper', { ...options });

		const that = this;
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		this.myScroll.on('scroll', function () {
			let num = that.limitNum(this.x);
			let dis = (num / realCmWidth + minScale).toFixed(0);
			if (onBackfill) {
				onBackfill(dis);
			}
		});

		this.myScroll.on('scrollEnd', lodash.debounce(function () {
			let num = that.limitNum(this.x);
			let dis = (num / realCmWidth + minScale).toFixed(0);

			if (onBackfill) {
				onBackfill(dis);
			}
			if (endClickScroll) {
				endClickScroll(dis);

			}
			if (num % realCmWidth > 1e-6) {
				that.myScroll.scrollTo(-Number((num / realCmWidth).toFixed(0) * realCmWidth), 0, 300, iScroll.utils.ease.quadratic);
			}

		}, 500, {
			leading: true,
			trailing: false
		}));

	}

	// 规范超出,返回滑动绝对值
	limitNum = (num) => {
		const { cmWidth = 50, minScale = 4, maxScale = 20 } = this.props;
		const diScale = maxScale - minScale;
		const realCmWidth = cmWidth + 1;
		if (num > 0) {
			return 0;
		} else if (num < -(diScale * realCmWidth)) {
			return Math.abs(diScale * realCmWidth);
		} else {
			return Math.abs(num)
		}
	}

	render() {
		const { cmWidth = 50, minScale = 4, maxScale = 20 } = this.props;
		const diScale = maxScale - minScale;
		const realCmWidth = cmWidth + 1;
		const rulerHtml = [];
		for (let i = minScale; i < maxScale; i++) {
			rulerHtml.push(
				<div className="cm" key={i}>
					<div className="mm"></div>
					<div className="mm"></div>
					<div className="mm"></div>
					<div className="mm"></div>
					<div className="tgt-iv-ruler-scale-num">{i}</div>
				</div>
			)
		}
		rulerHtml.push(<div className="cm" key={maxScale}><div className="tgt-iv-ruler-scale-num">{maxScale}</div></div>)
		return (
			<div className="tgt-iv-ruler-box">
				<div className="tgt-iv-ruler-pillar" />
				<div id="tgt-iv-ruler-wrapper" className="tgt-iv-ruler-wrapper">
					<div className="tgt-iv-ruler" style={{ width: diScale * realCmWidth }}>
						<div style={{ display: 'flex' }}>
							{rulerHtml}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Ruler;