/*
 * @Description: 达成百分比图
 * @Autor: niehongfeng
 * @Date: 2021-01-11 16:18:06
 * @params: {stirng|Numbe} current 当前值
 * @params: {stirng|Numbe} total 总数
 */
import React from 'react'
import rocket_img from './rocket.png';
const CAVANSWIDTH = 300;
const CAVANSHEIGHT = 225;
class PercentCircle extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      total: '',
      current: '',
    }
  }

  componentDidMount(){
    this.paint();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.total !== prevState.total || nextProps.current !== prevState.current) {
      return {
        total: nextProps.total,
        current: nextProps.current,
      };
    }
    return null;
  }

  componentDidUpdate() {   
    this.clearPaint();
    this.paint();
  }

  // 清除画板
  clearPaint = () => {
    let c = document.getElementById('process');
    let ctx = c.getContext('2d');
    ctx.clearRect(0, 0, CAVANSWIDTH, CAVANSHEIGHT)
  }

  // 绘制图像
  paint = () => {
    const { total = '', current = '' } = this.state;

    let currentPercent = 0;
    // 解决total为空时Infinity绘制问题
    if(total !== ''){
      currentPercent = Number(current/total*100);
    }    
    // 解决接近当前百分比时显示数值精度问题
    let isFinish = false;

    let c = document.getElementById('process');
    let process = 0;
    let ctx = c.getContext('2d');

    // 最内层圆盘半径
    const r = 55;

    // 圆心
    const c_x = CAVANSWIDTH/2;
		const c_y = CAVANSHEIGHT/2;

    // 轨道填充渐变色
    const startColor = '#FFDD02';
		const endColor = '#FF7F38';
        
    // 火箭尾线渐变色
		const startColor2 = '#FFFFFF';
    const endColor2 = '#FFD3AE';
    

    const image = new Image();
    image.src = rocket_img;


    const gradientColor = function(startColor,endColor,step){
      let startRGB = this.colorRgb(startColor);//转换为rgb数组模式
      let startR = startRGB[0];
      let startG = startRGB[1];
      let startB = startRGB[2];
  
      let endRGB = this.colorRgb(endColor);
      let endR = endRGB[0];
      let endG = endRGB[1];
      let endB = endRGB[2];
  
      let sR = (endR-startR)/step;//总差值
      let sG = (endG-startG)/step;
      let sB = (endB-startB)/step;
  
      let colorArr = [];
      for(let i=0;i<step;i++){
          //计算每一步的hex值
          let hex = this.colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
          colorArr.push(hex);
      }
      return colorArr;
    }

    // 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
		gradientColor.prototype.colorRgb = function(sColorParam){
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      let sColor = sColorParam.toLowerCase();
      if(sColor && reg.test(sColor)){
          if(sColor.length === 4){
              let sColorNew = "#";
              for(let i=1; i<4; i+=1){
                  sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
              }
              sColor = sColorNew;
          }
          //处理六位的颜色值
          let sColorChange = [];
          for(let i=1; i<7; i+=2){
              sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
          }
          return sColorChange;
      }else{
          return sColor;
      }
    };

    // 将rgb表示方式转换为hex表示方式
			gradientColor.prototype.colorHex = function(rgb){
        let _this = rgb;
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if(/^(rgb|RGB)/.test(_this)){
            let aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
            let strHex = "#";
            for(let i=0; i<aColor.length; i++){
                let hex = Number(aColor[i]).toString(16);
                hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
                if(hex === "0"){
                    hex += hex;
                }
                strHex += hex;
            }
            if(strHex.length !== 7){
                strHex = _this;
            }
            return strHex;
        }else if(reg.test(_this)){
            let aNum = _this.replace(/#/,"").split("");
            if(aNum.length === 6){
                return _this;
            }else if(aNum.length === 3){
                let numHex = "#";
                for(let i=0; i<aNum.length; i+=1){
                    numHex += (aNum[i]+aNum[i]);
                }
                return numHex;
            }
        }else{
            return _this;
        }
    }

    ctx.moveTo(c_x, c_y);
    // 灰色填充轨道
    ctx.beginPath();
    ctx.arc(c_x, c_y, r + 25, 0, Math.PI*2);
    ctx.fillStyle  = '#ededed';
    ctx.fill();
    
    // 画第二层白色的圆盘
    ctx.beginPath();
    ctx.arc(c_x, c_y, r + 10, 0, Math.PI*2);
    ctx.fillStyle  = '#fcfcfc';
    ctx.fill();


    // 第一层灰色圆盘
    ctx.beginPath();
    ctx.arc(c_x, c_y, r + 5, 0, Math.PI*2);
    ctx.fillStyle  = '#f2f2f2';
    ctx.fill();



    // 填充文字
    ctx.font = "12pt PingFangSC-Medium, PingFang SC";
    ctx.fillStyle = '#FF5B2C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Number(total).toFixed(2) + '%', c_x - 110, c_y - 90,);

    ctx.beginPath();
		ctx.arc(c_x - 70, c_y - 92, 3, 0, Math.PI*2);
		ctx.fillStyle  = '#FF5B2C';
		ctx.fill();

    const drawCricle = (ctx, percent) => {
      let startAngle = Math.PI * 1.5;
				let endAngle = ((Math.PI*2)*percent*0.01 + startAngle);
				const unit = 0.01;
				let division = parseInt((endAngle-startAngle)/unit,10);
				let gradient = new gradientColor(startColor,endColor,division);
				
				let gradient2 = new gradientColor(startColor2,endColor2,division);
				
				let start = startAngle;
				let end = start;
        
        // 白色填充清除小火箭轨迹
				ctx.beginPath();
				ctx.lineWidth = 15;
				ctx.strokeStyle = "#fff"
				ctx.arc(c_x, c_y, r + 36, 0,Math.PI*2);
        ctx.stroke();
        
				for(let i=0; i<division; i++){

          // 彩色填充条
          ctx.beginPath();
          ctx.lineCap = "round";
          end = start+unit;
          ctx.lineWidth = 13;
          ctx.strokeStyle = gradient[i];
          ctx.arc(c_x, c_y, r + 18,start,end);
          ctx.stroke();
          
          // 小火箭尾线
					ctx.beginPath();
					ctx.lineCap = "round";
					end = start+unit;
					ctx.lineWidth = 5;
					ctx.strokeStyle = gradient2[i];
					ctx.arc(c_x, c_y, r + 35,start,end);
					ctx.stroke();
					
				  start+=unit;
					
				}

        // 最内层圆盘(白色填充覆盖上一次的作图 内容)
				ctx.beginPath();
				ctx.arc(c_x, c_y, r, 0, Math.PI*2);
				ctx.fillStyle  = '#fcfcfc';
				ctx.fill();
      
				// 填充文字
				ctx.font = "500 18pt PingFangSC-Medium, PingFang SC";
				ctx.fillStyle = '#FF5B2C';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
        ctx.moveTo(c_x, c_y,);
        if(isFinish){
          ctx.fillText(Number(current).toFixed(2) + '%', c_x, CAVANSHEIGHT/2 - 10);
        } else {
          ctx.fillText((process*total/100).toFixed(2) + '%', c_x, CAVANSHEIGHT/2 - 10);
        }
				
				ctx.fillStyle = '#666666';
				ctx.font="10pt Georgia";
				ctx.fillText("持有收益率",c_x,c_y + 20);
        
        // 小火箭
				ctx.save();
				let deg = 180 * endAngle / Math.PI;
				let start_positon = { x: 83, y: 0};
				ctx.translate(CAVANSWIDTH/2,CAVANSHEIGHT/2);//围绕矩形的中心点旋转
				ctx.rotate(Math.PI / 180 * deg);
				ctx.drawImage(image,start_positon.x,start_positon.y);//绘制图片
        ctx.restore();
        if(isFinish === true || Number(current) === 0){          
          // 最后绘制总收益率标识灰线避免被遮挡
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#EEEEEE";
          ctx.moveTo(c_x - 68, c_y - 92);
          ctx.lineTo(c_x - 5, c_y - 92);
          ctx.lineTo(c_x - 5, c_y - 80);
          ctx.stroke();
        }
    }
    const animate = () => {
      requestAnimationFrame(function (){
        drawCricle(ctx, process);
        if (process < currentPercent) {          
          if(process + 1 > currentPercent || process + 1 === currentPercent){
            isFinish = true;
          }
          animate();
        }
        process = process + 1;
      });
    }
    animate();
  }

  render(){
    return(
      <canvas id="process" width={CAVANSWIDTH} height={CAVANSHEIGHT} style={{ display: 'block', margin: '0 auto' }}/>
    )
  }
}

export default PercentCircle;