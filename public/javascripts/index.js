import { formatAddress, getWeather } from './google-api.js';
const d3 = require('d3');
import buildData from "./build-data";
import buildGraph from "./build-graph";
import buildHtml from "./build-html";

document.addEventListener('DOMContentLoaded', () => {
    const graphDataPoints = [];
    let search = document.forms[0];
    let addressSearch = "";
    search.addEventListener("submit", async function(e){
        e.preventDefault();
        await removeData();
        let address = search.querySelector('input[type="text"]').value;
        addressSearch = address;
        let addressFormatted = formatAddress(address);
        let weatherRes = await getWeather(addressFormatted);
        let weather1 = weatherRes.short.data.properties.periods;
        await buildHtml(weather1);
        let buttonListener = document.getElementById("weather-buttons").querySelectorAll("#graph-button");
        for(let a = 0; a < buttonListener.length; a ++) {
            buttonListener[a].onclick = async function (e) {
                e.preventDefault();
                d3.selectAll("#d3-graph > *").remove();
                formatGraphData(weatherRes['long'], a);
        }}
        formatGraphData(weatherRes['long']);
    });
    let removeData = () => {
        let loadingFlag = document.getElementById("loader")
        loadingFlag.innerHTML = "<h1 id='loader-header'>Requesting from NOAA... Stand-By!</h1>"
        let table = document.getElementById("weather-info");
        table.innerHTML = "";
        let graph = document.getElementById("d3-graph")
        graph.innerHTML = "";
        let buttons = document.getElementById("weather-buttons");
        buttons.innerHTML = "";
        return true;
    }
    let formatGraphData = (data, value = 4) => {
        let dewPoint = data.data.properties.dewpoint.values;
        let relativeHumidity = data.data.properties.relativeHumidity.values;
        let skyCover = data.data.properties.skyCover.values;
        let temperature = data.data.properties.temperature.values;
        let windSpeed = data.data.properties.windSpeed.values;
        let windDirection = data.data.properties.windDirection.values;
        let theGoods = [dewPoint, relativeHumidity, skyCover, temperature, 
                        windSpeed, windDirection]
        for (let k = 0; k < theGoods.length; k++) {
            let answer = buildData(theGoods[k]);
            graphDataPoints.push(answer);
        }
        update(graphDataPoints, value);
    }
    async function update(data, value) {
        buildGraph(data[value], value)
        removeLoader();
    }
    let removeLoader = () => {
        let loadingFlag = document.getElementById("loader")
        loadingFlag.innerHTML = `<h1 id='loader-header'>Weather Forecast: ${addressSearch}</h1>`
    }
});