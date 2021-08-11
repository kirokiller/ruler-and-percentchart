import Ruler from './Ruler';
import PercentCircle from './PercentCircle';
import './App.css'
function App() {


  function fillText(value){
    const elem = document.getElementById("numberID");
    elem.innerText = Number(value).toFixed(2);
  }

  // 刻度变化实时回调
  function onBackfill(value){
    fillText(value)
  }

  // 刻度变化结束回调
  function endClickScroll(value){
    fillText(value);
    // doSomething
  }

  


  return (
    <div>
      <p className="tc">百分比环形图</p>
      <PercentCircle current={50} total={100}/>

      <p className="tc">滑动刻度尺</p>
      <div className="tc">目标收益率</div>
      <div className="tc">
        +<span className="numberID" id="numberID">8</span>%
      </div>
      <Ruler
          minScale={4}
          maxScale={20}
          initScale={8}
          onBackfill={onBackfill}
          endClickScroll={endClickScroll}
      />
    </div>
  );
}

export default App;
