import './App.css';
import React from 'react'
import {describeArc} from './helper'
import {createState} from "./app/chartReducer";
import {useDispatch, useSelector} from "react-redux";

const colors = ['#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600'];

function App() {
    const dashboard = useSelector(state => state.dashboard.value);
    const dispatch = useDispatch();

    React.useEffect(() => {
        fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/chart2986176.json')
            .then(response => response.json())
            .then(data => {
                dispatch(createState(data))
            });
    }, []);

    return (
        <div>
            <span style={{fontSize: "xx-large"}}>Charting Dashboard</span>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, auto)"}}>
                {dashboard.map((e, i) => e.type == 'Pie' ? <div key={i}><PieChart data={e.elements}/></div> :
                    <div key={i}><BarChart data={e.elements} index={i}/></div>)}
            </div>
            <a href={'https://www.hackerearth.com/@sridatta555'}>https://www.hackerearth.com/@sridatta555</a>
        </div>
    );

}

function PieChart(props) {
    const [pie, setPie] = React.useState([]);
    let [points, setPoints] = React.useState(props.data.slice());

    React.useEffect(() => {
        updateChart();
    }, [])

    function updateChart() {
        let temp = [];
        let lastAngle = 0;
        points.forEach((x) => {
            let arc_angle = 360 / 100 * x;
            temp.push(describeArc(100, 100, 100, lastAngle, lastAngle + arc_angle));
            lastAngle = lastAngle + arc_angle;
        })
        setPie(temp)
    }

    return (<div className={"chart"}>
            <svg width={200} height={200} className={"pieChart"}>
                {pie.map((e, i) => <path key={i} d={e} fill={colors[i]}></path>)}
            </svg>
            <div className={"tooltip-container"}>
                <div className={"edit-tooltip"}>
                    <div>
                        {points.map((e, i) => <div className={"eachEdit"} key={i}>
                            <div style={{display: "flex", alignItems: "center", gap: 5, marginBottom: "0.5rem"}}>
                                <div style={{width: '0.7rem', height: '0.7rem', backgroundColor: colors[i]}}></div>
                                <input type="number" min={0} value={points[i]} onChange={(change) => {
                                    if (change.target.value >= 0) {
                                        const changedBy = (change.target.value - points[i]) / (points.length - 1)
                                        let temp = points
                                        temp[i] = change.target.value;
                                        for (let j = 0; j < temp.length; j++) {
                                            if (i != j) {
                                                temp[j] -= changedBy
                                            }
                                        }
                                        setPoints(temp);
                                        updateChart();
                                    }
                                }}/>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function BarChart(props) {
    const [chart, setChart] = React.useState([])
    let [points, setPoints] = React.useState(props.data.slice());
    let index = props.index;
    const dispatch = useDispatch();

    React.useEffect(() => {
        updatePoints();
    }, [])

    function updatePoints() {
        const maxPoint = points.reduce((p, c) => p > c ? p : c);
        let temp = []
        let last_x = 30;
        points.forEach((e, i) => {
            temp.push(<rect className={"bar"} x={last_x} y={200 - 200 / maxPoint * e} width={10}
                            height={200 / maxPoint * e}
                            fill={colors[i]} key={i}></rect>)
            last_x += 40
        })
        setChart(temp)
    }

    return (
        <div className={"chart"}>
            <svg width={250} height={200}>
                <line x1={0} y1={0} x2={0} y2={200} stroke="#29364e" strokeWidth={1}/>
                <line x1={0} y1={200} x2={250} y2={200} stroke="#29364e" strokeWidth={1}/>
                {chart.map((e, i) => e)}
            </svg>
            <div className={"tooltip-container"}>
                <div className={"edit-tooltip"}>
                    <div>
                        {points.map((e, i) => <div className={"eachEdit"} key={i}>
                            <div style={{display: "flex", alignItems: "center", gap: 5, marginBottom: "0.5rem"}}>
                                <div style={{width: '0.7rem', height: '0.7rem', backgroundColor: colors[i]}}></div>
                                <input type="number" min={0} value={points[i]} onChange={(change) => {
                                    if (change.target.value >= 0) {
                                        let temp = points
                                        temp[i] = change.target.value;
                                        setPoints(temp);
                                        updatePoints();
                                    }
                                }}/>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default App;
